// step_definitions/weeklyad_steps.js
const { Given, When, Then } = require("@cucumber/cucumber");
const { WeeklyAdPage } = require("../pages/WeeklyAdPage");

When('the user clicks the "Weekly Ad" link from the header', async function () {
  this.weeklyAdPage = new WeeklyAdPage(this.page, this.BASE_URL);
  // Handle cookies if needed
  await this.weeklyAdPage.handleCookies();
  await this.weeklyAdPage.clickWeeklyAdLink();
});

Then("the Weekly Ad publication flyer should load", async function () {
  this.expect(await this.weeklyAdPage.isFlyerVisible()).to.be.true;
});
