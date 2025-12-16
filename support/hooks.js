// support/hooks.js
const { Before, After, BeforeAll, AfterAll, Status } = require("@cucumber/cucumber");
const { chromium } = require("playwright");
const fs = require("fs");
let browser;

const screenshotDir = "reports/screenshots";
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

BeforeAll(async function () {
  browser = await chromium.launch({
    headless: false, // Changed to false to see browser actions
    args: ["--start-maximized"]
  });
});

AfterAll(async function () {
  if (browser) await browser.close();
});

Before(async function () {
  this.context = await browser.newContext({ 
    viewport: null,
    ignoreHTTPSErrors: true
  });
  this.page = await this.context.newPage();
  // Set longer timeouts for page actions
  this.page.setDefaultTimeout(30000);
  this.page.setDefaultNavigationTimeout(30000);
});

// Helper function to handle cookie consent
async function handleCookieConsent(page) {
  try {
    // Common cookie consent selectors
    const cookieSelectors = [
      'button:has-text("Accept All")',
      'button:has-text("Accept")',
      'button:has-text("OK")',
      'button:has-text("I Agree")',
      'button:has-text("Continue")',
      '[data-testid="accept-all-cookies"]',
      '[id*="cookie"][id*="accept"]',
      '.cookie-accept',
      '#cookie-accept',
      '.accept-cookies'
    ];
    
    for (const selector of cookieSelectors) {
      try {
        const element = await page.locator(selector).first();
        if (await element.isVisible({ timeout: 2000 })) {
          await element.click();
          console.log(`Cookie consent handled with selector: ${selector}`);
          await page.waitForTimeout(1000);
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
  } catch (error) {
    // Cookie handling is optional, don't fail the test
    console.log('No cookie consent banner found or handled');
  }
}

After(async function (scenario) {
  try {
    // Always take a screenshot for the report
    const scenarioTitle = (scenario.pickle && scenario.pickle.name) ? scenario.pickle.name.replace(/ /g, "_").replace(/[^\w-]+/g, "") : "scenario";
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const screenshotPath = `${screenshotDir}/${scenarioTitle}_${timestamp}.png`;
    
    // Take screenshot
    const screenshot = await this.page.screenshot({ path: screenshotPath, fullPage: true });
    
    // Attach screenshot to cucumber report
    await this.attach(screenshot, 'image/png');
    
    // Log page info
    const pageInfo = {
      url: this.page.url(),
      title: await this.page.title(),
      timestamp: new Date().toISOString()
    };
    
    await this.attach(JSON.stringify(pageInfo, null, 2), 'application/json');
    
    if (scenario.result && scenario.result.status === Status.FAILED) {
      console.log(`\nScreenshot captured on failure: ${screenshotPath}\n`);
      
      // Attach page source for failed tests
      const pageSource = await this.page.content();
      await this.attach(pageSource, 'text/html');
      
      // Log browser console errors
      const consoleMessages = [];
      this.page.on('console', msg => {
        consoleMessages.push(`${msg.type()}: ${msg.text()}`);
      });
      
      if (consoleMessages.length > 0) {
        await this.attach(consoleMessages.join('\n'), 'text/plain');
      }
    }
  } catch (err) {
    console.error("Error in After hook:", err);
  } finally {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
  }
});
