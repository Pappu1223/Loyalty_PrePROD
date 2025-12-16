// step_definitions/account_steps.js
const { Given, When, Then } = require("@cucumber/cucumber");
const { AccountPage } = require("../pages/AccountPage");
const { fetchLatestOTP } = require("../utils/otpFetcher");

Given("a registered user is on the Sign-in page", async function () {
  this.accountPage = new AccountPage(this.page, this.BASE_URL);
  await this.accountPage.gotoSignInPage();
});

When("the user signs in with valid credentials", async function () {
  await this.accountPage.signIn("validuser@test.com", "Password123");
  await this.accountPage.captureStepScreenshot("After_SignIn_Attempt");
  // Wait and fetch OTP from Outlook
  const otp = await fetchLatestOTP({
    email: "test.pre.dep@outlook.com",
    password: "Dallas2022@",
    subjectKeyword: "OTP" // adjust if your subject is different
  });
  // Enter OTP in the app (assuming you have a method for this)
  await this.accountPage.enterOTP(otp);
  await this.accountPage.captureStepScreenshot("After_OTP_Entry");
});

Then("the user should be successfully redirected to the Home page", async function () {
  await this.page.waitForURL(this.BASE_URL + "/home");
  const currentUrl = this.page.url();
  this.expect(currentUrl).to.include("/home", "User was not redirected to the Home page");
  await this.accountPage.captureStepScreenshot("Home_Page_Confirmation");
});

Then("the user''s name should be displayed in the header", async function () {
  const userNameText = await this.accountPage.getUserName();
  this.expect(userNameText).to.not.be.empty;
});

// Rewards steps
When('clicks on the "Points & Rewards" link', async function () {
  await this.accountPage.clickRewardsLink();
});

Then('the "Rewards" page should be displayed', async function () {
  await this.accountPage.verifyRewardsPageLoaded();
});

Then('the user name, Points balance, and "Shop & Earn" text should be visible', async function () {
  this.expect(await this.accountPage.isUserInfoVisible()).to.be.true;
  this.expect(await this.accountPage.isShopAndEarnVisible()).to.be.true;
});

Then('the "Savings to Date: Lifetime Savings" value should be displayed', async function () {
  this.expect(await this.accountPage.isLifetimeSavingsVisible()).to.be.true;
});

When('the "Convert Points into cash off at checkout" toggle is {string}', async function (state) {
  await this.accountPage.setCashOffToggle(state);
});

Then('Grocery rewards should be displayed', async function () {
  this.expect(await this.accountPage.isGroceryRewardsVisible()).to.be.true;
});

Then('Grocery rewards should not be displayed', async function () {
  this.expect(await this.accountPage.isGroceryRewardsVisible()).to.be.false;
});

// Additional missing step definitions
Given('a registered user is logged in', async function () {
  this.accountPage = new AccountPage(this.page, this.BASE_URL);
  await this.accountPage.gotoSignInPage();
  await this.accountPage.signIn("validuser@test.com", "Password123");
  // Handle OTP if needed
  try {
    const otp = await fetchLatestOTP({
      email: "test.pre.dep@outlook.com",
      password: "Dallas2022@",
      subjectKeyword: "OTP"
    });
    await this.accountPage.enterOTP(otp);
  } catch (error) {
    console.log("OTP not required or failed to fetch:", error.message);
  }
});

When('the user navigates to the Account page', async function () {
  await this.accountPage.navigateToAccount();
});

Given('a registered user is on the Rewards page', async function () {
  this.accountPage = new AccountPage(this.page, this.BASE_URL);
  await this.accountPage.gotoSignInPage();
  await this.accountPage.signIn("validuser@test.com", "Password123");
  try {
    const otp = await fetchLatestOTP({
      email: "test.pre.dep@outlook.com",
      password: "Dallas2022@",
      subjectKeyword: "OTP"
    });
    await this.accountPage.enterOTP(otp);
  } catch (error) {
    console.log("OTP not required or failed to fetch:", error.message);
  }
  await this.accountPage.clickRewardsLink();
});

When('the {string} toggle is OFF', async function (toggleName) {
  await this.accountPage.setCashOffToggle('OFF');
});

When('the user toggles {string} ON', async function (toggleName) {
  await this.accountPage.setCashOffToggle('ON');
});
