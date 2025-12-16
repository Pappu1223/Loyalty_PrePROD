// step_definitions/mylist_steps.js
const { Given, When, Then } = require("@cucumber/cucumber");
const { MyListPage } = require("../pages/MyListPage");

Given('the user has clipped at least three different coupons', async function () {
  // This step assumes the user is already logged in
  // Implementation would involve navigating to coupons page and clipping coupons
  this.myListPage = new MyListPage(this.page, this.BASE_URL);
  await this.myListPage.clipMultipleCoupons(3);
});

When('the user navigates to {string}', async function (pageName) {
  this.myListPage = new MyListPage(this.page, this.BASE_URL);
  if (pageName.toLowerCase() === 'mylist') {
    await this.myListPage.navigateToMyList();
  }
});

Then('the MyList page should be displayed', async function () {
  await this.page.waitForURL('**/my-list**', { timeout: 10000 });
  const currentUrl = this.page.url();
  this.expect(currentUrl).to.include('my-list', 'MyList page is not displayed');
});

Then('the three previously clipped coupons should be displayed', async function () {
  const couponCount = await this.myListPage.getClippedCouponCount();
  this.expect(couponCount).to.be.at.least(3, 'Expected at least 3 clipped coupons to be displayed');
});