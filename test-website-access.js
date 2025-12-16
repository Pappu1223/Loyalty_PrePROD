// Simple test to verify website accessibility
const { chromium } = require('playwright');

async function testWebsiteAccess() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('Navigating to https://www.safeway.com...');
    await page.goto('https://www.safeway.com', { timeout: 30000 });
    console.log('Successfully loaded:', page.url());
    
    // Take a screenshot
    await page.screenshot({ path: 'website-test.png' });
    console.log('Screenshot saved as website-test.png');
    
    // Wait a bit to see the page
    await page.waitForTimeout(5000);
    
  } catch (error) {
    console.error('Error accessing website:', error.message);
  } finally {
    await browser.close();
  }
}

testWebsiteAccess();