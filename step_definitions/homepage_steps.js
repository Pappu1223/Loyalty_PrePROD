// step_definitions/homepage_steps.js
const { Given, When, Then } = require("@cucumber/cucumber");
const { HomePage } = require("../pages/HomePage");

Given('user is on the Home page', async function () {
  this.homePage = new HomePage(this.page, this.BASE_URL);
  await this.homePage.navigateToHomePage();
});

Given('registered user is on the Home page', async function () {
  this.homePage = new HomePage(this.page, this.BASE_URL);
  // Assume user is already logged in from previous steps
  await this.homePage.navigateToHomePage();
});

Then('Coupons & Deals Carousel should be displayed', async function () {
  this.expect(await this.homePage.isCouponsDealsCarouselVisible()).to.be.true;
});

Then('Nav bar should be displayed', async function () {
  this.expect(await this.homePage.isNavBarVisible()).to.be.true;
});

Then('{string} link should be present and functional', async function (linkText) {
  this.expect(await this.homePage.isLinkPresentAndFunctional(linkText)).to.be.true;
});

When('user clicks on {string} link in Coupons & Deals Carousel', async function (linkText) {
  await this.homePage.clickCarouselLink(linkText);
});

Then('user should be navigated to Banner for U Coupons & Deals page', async function () {
  const currentUrl = this.page.url();
  this.expect(currentUrl).to.include('coupons-deals');
});

When('user clips a coupon from the Carousel', async function () {
  await this.homePage.clipCouponFromCarousel();
});

Then('clipped coupon should be displayed in MyList', async function () {
  await this.homePage.navigateToMyList();
  this.expect(await this.homePage.isClippedCouponInMyList()).to.be.true;
});

When('user clicks on {string} link from homepage', async function (linkText) {
  await this.homePage.clickLink(linkText);
});

Then('offer details should be displayed in right drawer', async function () {
  this.expect(await this.homePage.isOfferDetailsDrawerVisible()).to.be.true;
});

Then('offer terms and conditions should be visible', async function () {
  this.expect(await this.homePage.isTermsAndConditionsVisible()).to.be.true;
});

Then('qualifying products should be displayed', async function () {
  this.expect(await this.homePage.isQualifyingProductsVisible()).to.be.true;
});

Then('products should be displayed two in a row when multiple products exist', async function () {
  this.expect(await this.homePage.verifyProductsDisplayedInRows()).to.be.true;
});