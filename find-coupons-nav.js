// Find coupons/deals navigation
const { chromium } = require('playwright');

async function findCouponsNavigation() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://www.safeway.com/');
    
    // Handle cookies first
    await page.waitForTimeout(3000);
    const cookieButton = page.locator('button:has-text("Accept"), button:has-text("Allow All"), button:has-text("Got it")');
    if (await cookieButton.first().isVisible({ timeout: 5000 })) {
      await cookieButton.first().click();
      console.log('Cookies handled');
    }
    
    // Look for navigation elements
    console.log('Looking for navigation links...');
    
    // Check main navigation
    const navLinks = await page.locator('nav a, header a, [role="navigation"] a').all();
    console.log(`Found ${navLinks.length} navigation links:`);
    
    for (let i = 0; i < Math.min(10, navLinks.length); i++) {
      const text = await navLinks[i].textContent();
      const href = await navLinks[i].getAttribute('href');
      console.log(`  ${i + 1}. "${text?.trim()}" -> ${href}`);
    }
    
    // Check for specific coupon-related links
    const couponRelated = [
      'text=Deals',
      'text=Coupons',
      'text=Weekly Ad',
      'text=For U',
      'a[href*="deals"]',
      'a[href*="coupon"]',
      'a[href*="weekly"]'
    ];
    
    console.log('\nChecking coupon-related elements:');
    for (const selector of couponRelated) {
      const elements = await page.locator(selector).all();
      if (elements.length > 0) {
        console.log(`Found ${elements.length} elements for "${selector}"`);
        for (let i = 0; i < Math.min(2, elements.length); i++) {
          const text = await elements[i].textContent();
          const href = await elements[i].getAttribute('href');
          console.log(`  "${text?.trim()}" -> ${href}`);
        }
      }
    }
    
    await page.waitForTimeout(10000); // Keep open for inspection
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

findCouponsNavigation();