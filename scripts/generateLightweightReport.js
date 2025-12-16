const fs = require('fs');
const path = require('path');

function generateLightweightReport() {
    try {
        // Read the JSON report
        const reportPath = path.join(__dirname, '..', 'reports', 'cucumber-report.json');
        if (!fs.existsSync(reportPath)) {
            console.log('No cucumber-report.json found');
            return;
        }

        const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        
        // Get all screenshots from directory
        const screenshotDir = path.join(__dirname, '..', 'reports', 'screenshots');
        const screenshots = fs.existsSync(screenshotDir) ? 
            fs.readdirSync(screenshotDir).filter(file => file.endsWith('.png')) : [];

        // Generate lightweight HTML report
        const htmlContent = generateLightweightHTML(reportData, screenshots);
        
        const outputPath = path.join(__dirname, '..', 'reports', 'lightweight-report.html');
        fs.writeFileSync(outputPath, htmlContent);
        
        console.log(`Lightweight report generated: ${outputPath}`);
        console.log(`Report includes ${screenshots.length} screenshots and detailed logs`);
    } catch (error) {
        console.error('Error generating lightweight report:', error);
    }
}

function generateLightweightHTML(reportData, screenshots) {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>🧪 Automation Test Report - Lightweight</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: #f8f9fa;
        }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e9ecef; }
        .summary { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 20px; 
            margin-bottom: 30px; 
        }
        .summary-card { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 20px; 
            border-radius: 8px; 
            text-align: center;
        }
        .summary-card h3 { margin: 0 0 10px 0; }
        .summary-card .number { font-size: 2em; font-weight: bold; }
        
        .feature { 
            border: 1px solid #dee2e6; 
            margin-bottom: 25px; 
            border-radius: 8px; 
            overflow: hidden;
        }
        .feature-header { 
            background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%); 
            color: white; 
            padding: 15px 20px; 
            font-weight: 600; 
            font-size: 1.1em;
        }
        
        .scenario { 
            margin: 20px; 
            padding: 20px; 
            border-left: 4px solid #6c757d; 
            background: #f8f9fa;
            border-radius: 0 8px 8px 0;
        }
        .scenario.passed { border-color: #28a745; background: #d4edda; }
        .scenario.failed { border-color: #dc3545; background: #f8d7da; }
        
        .scenario-title { 
            font-size: 1.2em; 
            font-weight: 600; 
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .step { 
            margin: 8px 0; 
            padding: 12px; 
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; 
            border-radius: 6px;
            background: white;
        }
        .step.passed { border-left: 3px solid #28a745; }
        .step.failed { border-left: 3px solid #dc3545; background: #fff5f5; }
        .step.skipped { border-left: 3px solid #ffc107; background: #fffbf0; }
        
        .step-keyword { font-weight: bold; color: #495057; }
        .step-duration { float: right; color: #6c757d; font-size: 0.9em; }
        
        .error-details { 
            background: #f8d7da; 
            border: 1px solid #f5c6cb;
            padding: 15px; 
            margin: 10px 0; 
            border-radius: 6px; 
            border-left: 4px solid #dc3545;
        }
        .error-details pre { 
            margin: 0; 
            white-space: pre-wrap; 
            font-size: 0.9em;
            color: #721c24;
        }
        
        .attachments { 
            margin-top: 15px; 
            padding: 15px; 
            background: white; 
            border-radius: 6px; 
            border: 1px solid #e9ecef;
        }
        .attachment { 
            margin: 10px 0; 
            padding: 10px; 
            background: #f8f9fa; 
            border-radius: 4px;
            border-left: 3px solid #007bff;
        }
        
        .screenshot-gallery { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
            gap: 15px; 
            margin: 20px 0;
        }
        .screenshot-item { 
            text-align: center; 
            background: white; 
            padding: 15px; 
            border-radius: 8px; 
            border: 1px solid #dee2e6;
        }
        .screenshot-item img { 
            max-width: 100%; 
            height: auto; 
            border-radius: 4px; 
            cursor: pointer;
            transition: transform 0.2s;
        }
        .screenshot-item img:hover { transform: scale(1.02); }
        .screenshot-item h4 { margin: 0 0 10px 0; color: #495057; font-size: 0.9em; }
        
        .page-info { 
            background: #e3f2fd; 
            border-left: 4px solid #2196f3; 
            padding: 12px; 
            margin: 10px 0;
        }
        .console-logs { 
            background: #f3f4f6; 
            border-left: 4px solid #6b7280; 
            padding: 12px; 
            margin: 10px 0;
        }
        .console-logs pre { 
            margin: 0; 
            max-height: 200px; 
            overflow-y: auto; 
            font-size: 0.85em;
        }
        
        .timestamp { 
            text-align: center; 
            color: #6c757d; 
            font-size: 0.9em; 
            margin-top: 30px; 
            padding-top: 20px; 
            border-top: 1px solid #e9ecef;
        }
        
        details { margin: 10px 0; }
        summary { 
            cursor: pointer; 
            padding: 8px; 
            background: #f8f9fa; 
            border-radius: 4px;
            border: 1px solid #dee2e6;
        }
        summary:hover { background: #e9ecef; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 Automation Test Report</h1>
            <p>Comprehensive test execution results with screenshots and detailed logs</p>
        </div>
        
        ${generateLightweightSummary(reportData)}
        
        <h2>📸 Screenshots Gallery</h2>
        ${generateLightweightScreenshotGallery(screenshots)}
        
        <h2>📋 Detailed Test Results</h2>
        ${reportData.map(feature => generateLightweightFeatureHTML(feature)).join('')}
        
        <div class="timestamp">
            📅 Report generated: ${new Date().toLocaleString()}<br>
            🔗 Screenshots: ${screenshots.length} files | 📊 Features: ${reportData.length}
        </div>
    </div>
</body>
</html>`;
}

function generateLightweightSummary(reportData) {
    let totalScenarios = 0;
    let passedScenarios = 0;
    let failedScenarios = 0;
    let totalSteps = 0;
    let passedSteps = 0;
    
    reportData.forEach(feature => {
        feature.elements.forEach(scenario => {
            totalScenarios++;
            let scenarioPassed = true;
            
            scenario.steps.forEach(step => {
                totalSteps++;
                if (step.result.status === 'passed') {
                    passedSteps++;
                } else if (step.result.status === 'failed') {
                    scenarioPassed = false;
                }
            });
            
            if (scenarioPassed) passedScenarios++;
            else failedScenarios++;
        });
    });
    
    const successRate = totalScenarios > 0 ? Math.round((passedScenarios/totalScenarios) * 100) : 0;
    
    return `
    <div class="summary">
        <div class="summary-card">
            <h3>📊 Scenarios</h3>
            <div class="number">${totalScenarios}</div>
            <div>${passedScenarios} passed, ${failedScenarios} failed</div>
        </div>
        <div class="summary-card">
            <h3>📈 Success Rate</h3>
            <div class="number">${successRate}%</div>
            <div>${successRate >= 80 ? 'Good' : successRate >= 50 ? 'Moderate' : 'Needs Improvement'}</div>
        </div>
        <div class="summary-card">
            <h3>🔧 Steps</h3>
            <div class="number">${totalSteps}</div>
            <div>${passedSteps} passed, ${totalSteps - passedSteps} failed/skipped</div>
        </div>
        <div class="summary-card">
            <h3>⏱️ Features</h3>
            <div class="number">${reportData.length}</div>
            <div>Test suites executed</div>
        </div>
    </div>`;
}

function generateLightweightScreenshotGallery(screenshots) {
    if (screenshots.length === 0) {
        return '<p style="text-align: center; color: #6c757d;">📷 No screenshots available</p>';
    }
    
    return `
    <div class="screenshot-gallery">
        ${screenshots.slice(0, 12).map(screenshot => `
            <div class="screenshot-item">
                <h4>${screenshot.replace('.png', '').replace(/_/g, ' ').substring(0, 30)}${screenshot.length > 30 ? '...' : ''}</h4>
                <img src="screenshots/${screenshot}" 
                     onclick="window.open('screenshots/${screenshot}', '_blank')"
                     title="Click to view full size - ${screenshot}">
                <p style="font-size: 0.8em; color: #6c757d;">Click to enlarge</p>
            </div>
        `).join('')}
    </div>
    ${screenshots.length > 12 ? `<p style="text-align: center; margin-top: 15px;"><em>Showing first 12 of ${screenshots.length} screenshots</em></p>` : ''}`;
}

function generateLightweightFeatureHTML(feature) {
    return `
    <div class="feature">
        <div class="feature-header">
            🎯 ${feature.name}
        </div>
        ${feature.elements.map(scenario => generateLightweightScenarioHTML(scenario)).join('')}
    </div>`;
}

function generateLightweightScenarioHTML(scenario) {
    const scenarioStatus = scenario.steps.every(step => step.result.status === 'passed') ? 'passed' : 'failed';
    const statusIcon = scenarioStatus === 'passed' ? '✅' : '❌';
    
    // Collect all embeddings from steps
    let allEmbeddings = [];
    scenario.steps.forEach(step => {
        if (step.embeddings) {
            allEmbeddings = allEmbeddings.concat(step.embeddings);
        }
    });
    
    // Extract information from embeddings
    let pageInfo = null;
    let consoleLogs = [];
    let screenshotCount = 0;
    
    allEmbeddings.forEach(embedding => {
        if (embedding.mime_type === 'application/json') {
            try {
                pageInfo = JSON.parse(Buffer.from(embedding.data, 'base64').toString());
            } catch (e) {}
        } else if (embedding.mime_type === 'text/plain') {
            consoleLogs.push(Buffer.from(embedding.data, 'base64').toString());
        } else if (embedding.mime_type === 'image/png') {
            screenshotCount++;
        }
    });
    
    return `
    <div class="scenario ${scenarioStatus}">
        <div class="scenario-title">
            ${statusIcon} ${scenario.name}
            <span style="font-size: 0.8em; color: #6c757d;">(${scenario.steps.length} steps)</span>
        </div>
        
        ${scenario.steps.map(step => `
            <div class="step ${step.result.status}">
                <span class="step-keyword">${step.keyword}</span> ${step.name}
                <span class="step-duration">${step.result.duration ? (step.result.duration / 1000000).toFixed(0) + 'ms' : '0ms'}</span>
                
                ${step.result.status === 'failed' && step.result.error_message ? 
                    `<div class="error-details">
                        <strong>❌ Error Details:</strong><br>
                        <pre>${step.result.error_message}</pre>
                    </div>` : ''}
            </div>
        `).join('')}
        
        <div class="attachments">
            <h4>🔍 Additional Information</h4>
            
            ${pageInfo ? `
                <div class="page-info attachment">
                    <strong>📄 Page Information:</strong><br>
                    <strong>URL:</strong> ${pageInfo.url || 'N/A'}<br>
                    <strong>Title:</strong> ${pageInfo.title || 'N/A'}<br>
                    <strong>Timestamp:</strong> ${pageInfo.timestamp || 'N/A'}
                </div>
            ` : ''}
            
            ${screenshotCount > 0 ? `
                <div class="attachment">
                    <strong>📸 Screenshots Captured:</strong> ${screenshotCount} images<br>
                    <em>View in gallery above or check screenshots/ folder</em>
                </div>
            ` : ''}
            
            ${consoleLogs.length > 0 ? `
                <div class="console-logs attachment">
                    <strong>📝 Console Output:</strong>
                    <details>
                        <summary>View console logs (${consoleLogs.length} entries)</summary>
                        ${consoleLogs.map(log => `
                            <pre>${log}</pre>
                        `).join('')}
                    </details>
                </div>
            ` : ''}
            
            <div class="attachment">
                <strong>⏱️ Total Duration:</strong> ${scenario.steps.reduce((total, step) => total + (step.result.duration || 0), 0) / 1000000}ms
            </div>
        </div>
    </div>`;
}

// Run the report generation
generateLightweightReport();