// pages/BasePage.js
const fs = require("fs");

class BasePage {
  constructor(page, baseUrl) {
    this.page = page;
    this.baseUrl = baseUrl;
    this.screenshotDir = "reports/screenshots/steps";
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  async navigateTo(path) {
    await this.page.goto(this.baseUrl + path, { waitUntil: 'domcontentloaded', timeout: 30000 });
    // Wait a bit for dynamic content to load
    await this.page.waitForTimeout(3000);
    // Handle cookie consent after navigation
    await this.handleCookieConsent();
  }

  async click(selector) {
    await this.page.click(selector);
  }

  async fill(selector, value) {
    await this.page.fill(selector, value);
  }

  async getText(selector) {
    return this.page.textContent(selector);
  }

  async isVisible(selector) {
    try {
      await this.page.waitForSelector(selector, { state: "visible", timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async captureStepScreenshot(stepName) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const safeStepName = (stepName || "step").replace(/ /g, "_").replace(/[^\w-]+/g, "");
    const screenshotPath = `${this.screenshotDir}/${safeStepName}_${timestamp}.png`;
    const screenshot = await this.page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`[Screenshot] Step screenshot saved to: ${screenshotPath}`);
    
    // Also capture page state information
    const pageState = {
      url: this.page.url(),
      title: await this.page.title(),
      stepName: stepName,
      timestamp: timestamp
    };
    
    console.log(`[Page State] ${JSON.stringify(pageState, null, 2)}`);
    return { screenshotPath, pageState };
  }

  async handleCookieConsent() {
    try {
      // Priority order: specific xpath first, then fallbacks
      const cookieSelectors = [
        '#onetrust-accept-btn-handler',
        'button:has-text("Accept All")',
        'button:has-text("Accept")',
        'button:has-text("Allow All")',
        'button:has-text("OK")',
        'button:has-text("I Agree")',
        '[data-testid="accept-all-cookies"]',
        '[aria-label*="accept"]',
        '.cookie-accept-button'
      ];
      
      // Wait for page to stabilize first
      await this.page.waitForTimeout(2000);
      
      // Try xpath first
      try {
        console.log('Checking for cookie consent with xpath: //*[@id="onetrust-accept-btn-handler"]');
        const xpathElement = this.page.locator('xpath=//*[@id="onetrust-accept-btn-handler"]');
        if (await xpathElement.isVisible({ timeout: 5000 })) {
          console.log('Cookie consent button found via xpath');
          await xpathElement.click();
          console.log('Cookie consent handled successfully via xpath');
          await this.page.waitForTimeout(3000);
          return true;
        }
      } catch (e) {
        console.log(`Xpath selector failed: ${e.message}`);
      }
      
      for (const selector of cookieSelectors) {
        try {
          console.log(`Checking for cookie consent with selector: ${selector}`);
          const element = this.page.locator(selector).first();
          
          if (await element.isVisible({ timeout: 5000 })) {
            console.log(`Cookie consent button found: ${selector}`);
            await element.click();
            console.log(`Cookie consent handled successfully with: ${selector}`);
            await this.page.waitForTimeout(3000); // Wait for banner to disappear
            return true;
          }
        } catch (e) {
          console.log(`Selector ${selector} failed: ${e.message}`);
        }
      }
    } catch (error) {
      console.log('Cookie consent handling failed:', error.message);
    }
    return false;
  }

  async handleCookies() {
    return await this.handleCookieConsent();
  }
}

module.exports = { BasePage };
