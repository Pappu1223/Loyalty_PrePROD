const fs = require('fs');
const path = require('path');

function generateEnhancedReport() {
    try {
        // Read the JSON report
        const reportPath = path.join(__dirname, '..', 'reports', 'cucumber-report.json');
        if (!fs.existsSync(reportPath)) {
            console.log('No cucumber-report.json found');
            return;
        }

        const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        
        // Get all screenshots
        const screenshotDir = path.join(__dirname, '..', 'reports', 'screenshots');
        const screenshots = fs.existsSync(screenshotDir) ? 
            fs.readdirSync(screenshotDir).filter(file => file.endsWith('.png')) : [];

        // Generate enhanced HTML report
        const htmlContent = generateHTML(reportData, screenshots);
        
        const outputPath = path.join(__dirname, '..', 'reports', 'enhanced-report.html');
        fs.writeFileSync(outputPath, htmlContent);
        
        console.log(`Enhanced report generated: ${outputPath}`);
    } catch (error) {
        console.error('Error generating enhanced report:', error);
    }
}

function generateHTML(reportData, screenshots) {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Automation Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .summary { background: #f5f5f5; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
        .feature { border: 1px solid #ddd; margin-bottom: 20px; border-radius: 5px; }
        .feature-header { background: #e8f4f8; padding: 10px; font-weight: bold; }
        .scenario { margin: 10px; padding: 15px; border-left: 3px solid #ccc; }
        .scenario.passed { border-color: #5cb85c; }
        .scenario.failed { border-color: #d9534f; background: #fafafa; }
        .step { margin: 8px 0; padding: 8px; font-family: monospace; border-radius: 3px; }
        .step.passed { color: green; background: #f0f8f0; }
        .step.failed { color: red; background: #ffe6e6; }
        .step-duration { color: #666; font-size: 0.8em; margin-left: 10px; }
        .screenshot { max-width: 100%; margin: 10px 0; border: 1px solid #ddd; cursor: pointer; }
        .error-details { background: #f8d7da; padding: 10px; margin: 10px 0; border-radius: 3px; border: 1px solid #f5c6cb; }
        .error-details pre { margin: 5px 0; white-space: pre-wrap; word-wrap: break-word; }
        .timestamp { color: #666; font-size: 0.9em; }
        .attachments { margin: 15px 0; padding: 10px; background: #f8f9fa; border-radius: 5px; }
        .attachment { margin: 10px 0; padding: 10px; background: #fff; border-radius: 3px; border: 1px solid #e9ecef; }
        .step-attachments { margin: 10px 0; padding: 10px; background: #f1f3f4; border-radius: 3px; }
        .scenario-attachments { margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 5px; border: 1px solid #dee2e6; }
        .page-info p { margin: 5px 0; }
        .console-logs pre { background: #2d3748; color: #e2e8f0; padding: 10px; border-radius: 3px; font-size: 12px; }
        .screenshots img { transition: transform 0.2s; }
        .screenshots img:hover { transform: scale(1.05); }
        details summary { cursor: pointer; font-weight: bold; padding: 5px; background: #e9ecef; border-radius: 3px; }
        details[open] summary { margin-bottom: 10px; }
        h5 { margin: 10px 0 5px 0; color: #495057; }
    </style>
</head>
<body>
    <h1>🧪 Automation Test Report</h1>
    
    ${generateSummary(reportData)}
    
    <h2>📸 Screenshots Gallery</h2>
    ${generateScreenshotGallery(screenshots)}
    
    <h2>📋 Test Results</h2>
    ${reportData.map(feature => generateFeatureHTML(feature)).join('')}
    
    <div class="timestamp">
        Report generated: ${new Date().toLocaleString()}
    </div>
</body>
</html>`;
}

function generateSummary(reportData) {
    let totalScenarios = 0;
    let passedScenarios = 0;
    let failedScenarios = 0;
    
    reportData.forEach(feature => {
        feature.elements.forEach(scenario => {
            totalScenarios++;
            const scenarioStatus = scenario.steps.every(step => step.result.status === 'passed') ? 'passed' : 'failed';
            if (scenarioStatus === 'passed') passedScenarios++;
            else failedScenarios++;
        });
    });
    
    return `
    <div class="summary">
        <h2>📊 Summary</h2>
        <p><strong>Total Scenarios:</strong> ${totalScenarios}</p>
        <p><strong>✅ Passed:</strong> ${passedScenarios}</p>
        <p><strong>❌ Failed:</strong> ${failedScenarios}</p>
        <p><strong>Success Rate:</strong> ${totalScenarios > 0 ? Math.round((passedScenarios/totalScenarios) * 100) : 0}%</p>
    </div>`;
}

function generateScreenshotGallery(screenshots) {
    if (screenshots.length === 0) {
        return '<p>No screenshots available</p>';
    }
    
    return `
    <div class="screenshots-gallery">
        ${screenshots.map(screenshot => `
            <div class="screenshot-item" style="display: inline-block; margin: 10px;">
                <h4>${screenshot.replace('.png', '').replace(/_/g, ' ')}</h4>
                <img src="screenshots/${screenshot}" class="screenshot" style="max-width: 300px;" 
                     onclick="window.open('screenshots/${screenshot}', '_blank')">
                <p><small>Click to view full size</small></p>
            </div>
        `).join('')}
    </div>`;
}

function generateFeatureHTML(feature) {
    return `
    <div class="feature">
        <div class="feature-header">🎯 ${feature.name}</div>
        ${feature.elements.map(scenario => generateScenarioHTML(scenario)).join('')}
    </div>`;
}

function generateScenarioHTML(scenario) {
    const scenarioStatus = scenario.steps.every(step => step.result.status === 'passed') ? 'passed' : 'failed';
    
    // Collect all embeddings from all steps
    let allEmbeddings = [];
    let consoleLog = '';
    scenario.steps.forEach(step => {
        if (step.embeddings) {
            allEmbeddings = allEmbeddings.concat(step.embeddings);
        }
    });
    
    return `
    <div class="scenario ${scenarioStatus}">
        <h3>${scenarioStatus === 'passed' ? '✅' : '❌'} ${scenario.name}</h3>
        
        ${scenario.steps.map(step => `
            <div class="step ${step.result.status}">
                <strong>${step.keyword}</strong> ${step.name}
                <span class="step-duration">(${step.result.duration ? (step.result.duration / 1000000).toFixed(0) + 'ms' : '0ms'})</span>
                
                ${step.result.status === 'failed' && step.result.error_message ? 
                    `<div class="error-details">
                        <strong>❌ Error Details:</strong><br>
                        <pre>${step.result.error_message}</pre>
                    </div>` : ''}
                
                ${generateStepAttachments(step)}
            </div>
        `).join('')}
        
        ${generateScenarioAttachments(allEmbeddings)}
        
        <div class="attachments">
            <strong>⏱️ Total Duration:</strong> ${scenario.steps.reduce((total, step) => total + (step.result.duration || 0), 0) / 1000000}ms
        </div>
    </div>`;
}

function generateStepAttachments(step) {
    if (!step.embeddings || step.embeddings.length === 0) {
        return '';
    }
    
    return `
        <div class="step-attachments">
            <h5>📎 Step Attachments:</h5>
            ${step.embeddings.map(embedding => generateAttachment(embedding)).join('')}
        </div>`;
}

function generateScenarioAttachments(embeddings) {
    if (!embeddings || embeddings.length === 0) {
        return '';
    }
    
    let pageInfo = null;
    let screenshots = [];
    let logs = [];
    let pageSource = null;
    
    embeddings.forEach(embedding => {
        if (embedding.mime_type === 'application/json') {
            try {
                pageInfo = JSON.parse(Buffer.from(embedding.data, 'base64').toString());
            } catch (e) {}
        } else if (embedding.mime_type === 'image/png') {
            screenshots.push(embedding.data);
        } else if (embedding.mime_type === 'text/plain') {
            logs.push(Buffer.from(embedding.data, 'base64').toString());
        } else if (embedding.mime_type === 'text/html') {
            pageSource = Buffer.from(embedding.data, 'base64').toString();
        }
    });
    
    return `
        <div class="scenario-attachments">
            <h4>🔍 Detailed Information</h4>
            
            ${pageInfo ? `
                <div class="page-info attachment">
                    <h5>📄 Page Information:</h5>
                    <p><strong>URL:</strong> ${pageInfo.url || 'N/A'}</p>
                    <p><strong>Title:</strong> ${pageInfo.title || 'N/A'}</p>
                    <p><strong>Timestamp:</strong> ${pageInfo.timestamp || 'N/A'}</p>
                </div>
            ` : ''}
            
            ${screenshots.length > 0 ? `
                <div class="screenshots attachment">
                    <h5>📸 Captured Screenshots:</h5>
                    ${screenshots.map((screenshot, index) => `
                        <img src="data:image/png;base64,${screenshot}" 
                             style="max-width: 300px; margin: 5px; border: 1px solid #ddd;" 
                             onclick="window.open('data:image/png;base64,${screenshot}', '_blank')"
                             title="Click to view full size">
                    `).join('')}
                </div>
            ` : ''}
            
            ${logs.length > 0 ? `
                <div class="console-logs attachment">
                    <h5>📝 Console Logs:</h5>
                    ${logs.map(log => `
                        <pre style="background: #f4f4f4; padding: 10px; border-radius: 3px; max-height: 200px; overflow-y: auto;">${log}</pre>
                    `).join('')}
                </div>
            ` : ''}
            
            ${pageSource ? `
                <div class="page-source attachment">
                    <h5>🌐 Page Source Summary:</h5>
                    <p><strong>Size:</strong> ${Math.round(pageSource.length / 1024)}KB</p>
                    <p><strong>Title:</strong> ${(pageSource.match(/<title>(.*?)<\/title>/i)?.[1] || 'No title').substring(0, 100)}</p>
                    <p><strong>Meta Description:</strong> ${(pageSource.match(/<meta name="description" content="([^"]*)">/i)?.[1] || 'None').substring(0, 200)}</p>
                    <p><em>Full source available in browser dev tools during test execution</em></p>
                </div>
            ` : ''}
        </div>`;
}

function generateAttachment(embedding) {
    if (embedding.mime_type === 'image/png') {
        return `
            <div class="attachment">
                <img src="data:image/png;base64,${embedding.data}" class="screenshot" 
                     style="max-width: 200px;" onclick="window.open('data:image/png;base64,${embedding.data}', '_blank')">
                <p><small>Screenshot (click to enlarge)</small></p>
            </div>`;
    } else if (embedding.mime_type === 'application/json') {
        try {
            const data = JSON.parse(Buffer.from(embedding.data, 'base64').toString());
            return `
                <div class="attachment">
                    <strong>📊 Data:</strong>
                    <pre>${JSON.stringify(data, null, 2)}</pre>
                </div>`;
        } catch (e) {
            return `<div class="attachment"><strong>Data:</strong> Invalid JSON</div>`;
        }
    } else if (embedding.mime_type === 'text/plain') {
        const text = Buffer.from(embedding.data, 'base64').toString();
        return `
            <div class="attachment">
                <strong>📝 Log:</strong>
                <pre style="background: #f9f9f9; padding: 5px;">${text}</pre>
            </div>`;
    }
    
    return `<div class="attachment">Unknown attachment type: ${embedding.mime_type}</div>`;
}

// Run the report generation
generateEnhancedReport();