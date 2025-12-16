// Debug script to find Banner for U link
const { chromium } = require('playwright');

async function debugBannerForULink() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('Navigating to Safeway homepage...');
    await page.goto('https://www.safeway.com', { timeout: 30000 });
    
    console.log('Page loaded, looking for Banner for U links...');
    
    // Look for various possible selectors
    const possibleSelectors = [
      'a:has-text("Banner for U")',
      'a:has-text("Banner forU")',
      'a:has-text("banner for u")',
      'a[href*="banner"]',
      'a[href*="coupon"]',
      'a[href*="deals"]',
      'nav a',
      'header a'
    ];
    
    for (const selector of possibleSelectors) {
      try {
        const elements = await page.locator(selector).all();
        if (elements.length > 0) {
          console.log(`Found ${elements.length} elements with selector: ${selector}`);
          for (let i = 0; i < Math.min(3, elements.length); i++) {
            const text = await elements[i].textContent();
            const href = await elements[i].getAttribute('href');
            console.log(`  Element ${i + 1}: "${text}" -> ${href}`);
          }
        }
      } catch (error) {
        // Selector not found, continue
      }
    }
    
    // Wait to inspect manually
    console.log('Waiting 10 seconds for manual inspection...');
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

debugBannerForULink();