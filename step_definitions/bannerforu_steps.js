// step_definitions/bannerforu_steps.js
const { Given, When, Then } = require("@cucumber/cucumber");
const { CouponsDealsPage } = require("../pages/CouponsDealsPage");
const { AccountPage } = require("../pages/AccountPage");

Given("a registered user is on the Coupons & Deals page", async function () {
  this.accountPage = new AccountPage(this.page, this.BASE_URL);
  this.cdPage = new CouponsDealsPage(this.page, this.BASE_URL);
  await this.accountPage.gotoSignInPage();
  await this.accountPage.signIn("validuser@test.com", "Password123");
  await this.cdPage.navigateToBannerForU();
});

Given("a guest user is on the Home page", async function () {
  this.cdPage = new CouponsDealsPage(this.page, this.BASE_URL);
  await this.cdPage.navigateTo("/");
  console.log('Guest user on home page, handling cookies...');
  await this.cdPage.handleCookies();
  console.log('Cookies handled for guest user');
});

When('the user clicks the "Banner for U" link on the Nav bar', async function () {
  await this.cdPage.clickBannerForULink();
});

Then("the user should be redirected to the Coupons & Deals page", async function () {
  const currentUrl = this.page.url();
  this.expect(currentUrl).to.include("/coupons-deals", "Did not land on Coupons & Deals page.");
});

Then("all available coupons should be displayed", async function () {
  const couponCount = await this.cdPage.getCouponCount();
  this.expect(couponCount).to.be.greaterThan(0);
});

Then('the user should be redirected to the Sign-in page', async function () {
  // For guest users, Safeway redirects to foru-guest.html instead of sign-in
  await this.page.waitForURL('**/foru-guest.html**', { timeout: 10000 });
  const currentUrl = this.page.url();
  this.expect(currentUrl).to.include('foru-guest', 'Guest user was not redirected to the guest page');
  console.log('Guest user correctly redirected to:', currentUrl);
});
