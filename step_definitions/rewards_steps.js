// step_definitions/rewards_steps.js
const { Given, When, Then } = require("@cucumber/cucumber");
const { RewardsPage } = require("../pages/RewardsPage");

Given('registered user is on Points & Rewards page', async function () {
  this.rewardsPage = new RewardsPage(this.page, this.BASE_URL);
  await this.rewardsPage.navigateToRewardsPage();
});

Given('registered user is on Rewards page', async function () {
  this.rewardsPage = new RewardsPage(this.page, this.BASE_URL);
  await this.rewardsPage.navigateToRewardsPage();
});

Given('registered user has redeemed rewards', async function () {
  this.rewardsPage = new RewardsPage(this.page, this.BASE_URL);
  await this.rewardsPage.navigateToRewardsPage();
  await this.rewardsPage.redeemSampleReward();
});

Then('{string} link should be available', async function (linkText) {
  this.expect(await this.rewardsPage.isLinkAvailable(linkText)).to.be.true;
});

Then('reward points should be displayed', async function () {
  this.expect(await this.rewardsPage.isRewardPointsDisplayed()).to.be.true;
});

Then('Banner for U logo should be visible', async function () {
  this.expect(await this.rewardsPage.isBannerForULogoVisible()).to.be.true;
});

Then('{string} should be displayed', async function (text) {
  this.expect(await this.rewardsPage.isTextDisplayed(text)).to.be.true;
});

When('user clicks {string} button', async function (buttonText) {
  await this.rewardsPage.clickButton(buttonText);
});

Then('user should be navigated to {word} page', async function (expectedPage) {
  await this.page.waitForTimeout(2000);
  const currentUrl = this.page.url();
  this.expect(currentUrl).to.include(expectedPage.toLowerCase());
});

Then('rewards logo should be displayed as golden star-shaped circle', async function () {
  this.expect(await this.rewardsPage.isRewardsLogoCorrect()).to.be.true;
});

Then('point balance should be displayed to the right', async function () {
  this.expect(await this.rewardsPage.isPointBalanceDisplayedCorrectly()).to.be.true;
});

Then('expiration text should read {string}', async function (expectedText) {
  const actualText = await this.rewardsPage.getExpirationText();
  this.expect(actualText).to.match(/\d+ Points expire \w+ \d+/);
});

Then('{string} should be available', async function (featureText) {
  this.expect(await this.rewardsPage.isFeatureAvailable(featureText)).to.be.true;
});

When('toggle is {word}', async function (toggleState) {
  await this.rewardsPage.setToggleState(toggleState);
});

When('user toggles it {word}', async function (toggleState) {
  await this.rewardsPage.toggleState(toggleState);
});

Then('Grocery rewards should be displayed', async function () {
  this.expect(await this.rewardsPage.isGroceryRewardsDisplayed()).to.be.true;
});

Then('Grocery rewards should not be displayed', async function () {
  this.expect(await this.rewardsPage.isGroceryRewardsDisplayed()).to.be.false;
});

When('user redeems/clips a reward', async function () {
  this.initialPoints = await this.rewardsPage.getCurrentPoints();
  await this.rewardsPage.redeemReward();
});

Then('reward points should be deducted accordingly', async function () {
  const currentPoints = await this.rewardsPage.getCurrentPoints();
  this.expect(currentPoints).to.be.lessThan(this.initialPoints);
});

When('reward is reclaimed/unclipped', async function () {
  await this.rewardsPage.unredeemReward();
});

Then('balance should be updated accordingly', async function () {
  const finalPoints = await this.rewardsPage.getCurrentPoints();
  this.expect(finalPoints).to.equal(this.initialPoints);
});

When('user accesses Get your reward modal', async function () {
  await this.rewardsPage.openGetYourRewardModal();
});

Then('redeemed/clipped rewards should be listed', async function () {
  this.expect(await this.rewardsPage.areRedeemedRewardsListed()).to.be.true;
});

When('user clicks on {string} link', async function (linkText) {
  await this.rewardsPage.clickLink(linkText);
});

Then('reward details should be displayed', async function () {
  this.expect(await this.rewardsPage.isRewardDetailsDisplayed()).to.be.true;
});

Then('{string} link should be present', async function (linkText) {
  this.expect(await this.rewardsPage.isLinkPresent(linkText)).to.be.true;
});

When('user clicks {string} link', async function (linkText) {
  await this.rewardsPage.clickLink(linkText);
});

Then('{string} link should navigate to {word} page', async function (linkText, expectedPage) {
  await this.rewardsPage.clickLink(linkText);
  await this.page.waitForTimeout(2000);
  const currentUrl = this.page.url();
  this.expect(currentUrl).to.include(expectedPage.toLowerCase());
});

Then('{string} link should work correctly', async function (linkText) {
  this.expect(await this.rewardsPage.isLinkWorking(linkText)).to.be.true;
});

Then('all other links should work without errors', async function () {
  this.expect(await this.rewardsPage.verifyAllLinksWork()).to.be.true;
});