const { launchStealthBrowser } = require('../pages/StealthBrowser');

(async () => {
  const { browser, page } = await launchStealthBrowser();
  await page.goto('https://www.safeway.com');
  console.log('Stealth browser launched and navigated to Safeway.com');
  // Keep browser open for manual inspection
  await page.waitForTimeout(60000); // 1 minute
  await browser.close();
})();
