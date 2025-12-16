// Script to inspect and find correct selectors
const { chromium } = require('playwright');

async function inspectSelectors() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    console.log('Navigating to Safeway homepage...');
    await page.goto('https://www.safeway.com', { waitUntil: 'networkidle', timeout: 30000 });
    
    console.log('\n=== INSPECTING PAGE ELEMENTS ===\n');
    
    // 1. Check for cookie banners/consent
    console.log('1. Looking for cookie consent elements...');
    const cookieSelectors = [
      '[data-testid*="cookie"]',
      '[class*="cookie"]',
      '[id*="cookie"]',
      'button:has-text("Accept")',
      'button:has-text("Allow")',
      'button:has-text("Got it")',
      'button:has-text("OK")',
      '.onetrust-banner',
      '#onetrust-accept-btn-handler'
    ];
    
    for (const selector of cookieSelectors) {
      try {
        const elements = await page.locator(selector).all();
        if (elements.length > 0) {
          console.log(`  Found ${elements.length} cookie elements: ${selector}`);
          for (let i = 0; i < Math.min(2, elements.length); i++) {
            const text = await elements[i].textContent();
            console.log(`    Element ${i + 1}: "${text?.trim()}"`);
          }
        }
      } catch (e) { /* ignore */ }
    }
    
    // 2. Navigation links
    console.log('\n2. Looking for navigation elements...');
    const navSelectors = [
      'nav a',
      'header a',
      '[role="navigation"] a',
      'a[href*="coupon"]',
      'a[href*="deals"]',
      'a[href*="loyalty"]',
      'text=Safeway for U',
      'text=Banner for U'
    ];
    
    for (const selector of navSelectors) {
      try {
        const elements = await page.locator(selector).all();
        if (elements.length > 0) {
          console.log(`  Found ${elements.length} nav elements: ${selector}`);
          for (let i = 0; i < Math.min(3, elements.length); i++) {
            const text = await elements[i].textContent();
            const href = await elements[i].getAttribute('href');
            console.log(`    Element ${i + 1}: "${text?.trim()}" -> ${href}`);
          }
        }
      } catch (e) { /* ignore */ }
    }
    
    // 3. Sign-in related elements
    console.log('\n3. Looking for sign-in elements...');
    const signInSelectors = [
      'a[href*="sign-in"]',
      'a[href*="login"]',
      'text=Sign In',
      'text=Log In',
      'button:has-text("Sign In")',
      '[data-testid*="sign-in"]',
      '[data-testid*="login"]'
    ];
    
    for (const selector of signInSelectors) {
      try {
        const elements = await page.locator(selector).all();
        if (elements.length > 0) {
          console.log(`  Found ${elements.length} sign-in elements: ${selector}`);
          for (let i = 0; i < Math.min(2, elements.length); i++) {
            const text = await elements[i].textContent();
            const href = await elements[i].getAttribute('href');
            console.log(`    Element ${i + 1}: "${text?.trim()}" -> ${href}`);
          }
        }
      } catch (e) { /* ignore */ }
    }
    
    // 4. Weekly Ad elements
    console.log('\n4. Looking for Weekly Ad elements...');
    const weeklyAdSelectors = [
      'a[href*="weekly"]',
      'a[href*="ad"]',
      'text=Weekly Ad',
      'text=Weekly Ads',
      '[data-testid*="weekly"]'
    ];
    
    for (const selector of weeklyAdSelectors) {
      try {
        const elements = await page.locator(selector).all();
        if (elements.length > 0) {
          console.log(`  Found ${elements.length} weekly ad elements: ${selector}`);
          for (let i = 0; i < Math.min(2, elements.length); i++) {
            const text = await elements[i].textContent();
            const href = await elements[i].getAttribute('href');
            console.log(`    Element ${i + 1}: "${text?.trim()}" -> ${href}`);
          }
        }
      } catch (e) { /* ignore */ }
    }
    
    console.log('\n=== INSPECTION COMPLETE ===');
    console.log('Press Ctrl+C in terminal when ready to close browser...');
    
    // Keep browser open for manual inspection
    await page.waitForTimeout(60000);
    
  } catch (error) {
    console.error('Error during inspection:', error.message);
  } finally {
    await browser.close();
  }
}

inspectSelectors();