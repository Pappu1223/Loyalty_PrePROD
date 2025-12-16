// pages/AccountPage.js
const { BasePage } = require("./BasePage");

class AccountPage extends BasePage {
  ACCOUNT_MENU_BUTTON = 'button:has-text("Account menu")';
  SIGN_IN_BUTTON_HEADER = 'button:has-text("Sign in")';
  EMAIL_FIELD = 'input[name="email"], [role="textbox"]:has-text("Email or mobile number")';
  PASSWORD_FIELD = 'input[name="password"], [role="textbox"]:has-text("Password")';
  SIGN_IN_WITH_PASSWORD_BUTTON = 'button:has-text("Sign in with password")';
  FINAL_SIGN_IN_BUTTON = 'button:has-text("Sign in"):not(:has-text("Sign in with password"))';
  HEADER_USER_NAME = ".header-user-name";
  REWARDS_LINK = "a[href*=\"/rewards\"]";
  REWARDS_PAGE_TITLE = "h1:has-text(\"Points & Rewards\")";
  SHOP_AND_EARN_TEXT = "text=Shop & Earn";
  LIFETIME_SAVINGS_TEXT = "text=Lifetime Savings";
  CASH_OFF_TOGGLE = "#cashOffToggle";
  GROCERY_REWARDS_CONTAINER = ".grocery-rewards-list";

  async gotoSignInPage() {
    await this.navigateTo("/");
    console.log('Page loaded, handling cookies...');
    await this.handleCookies();
    console.log('Cookies handled, proceeding with sign in...');
    await this.page.waitForTimeout(1000);
    await this.click(this.ACCOUNT_MENU_BUTTON);
    await this.click(this.SIGN_IN_BUTTON_HEADER);
  }

  async signIn(email, password) {
    // Fill email
    await this.fill(this.EMAIL_FIELD, email);
    
    // Click "Sign in with password" button
    await this.click(this.SIGN_IN_WITH_PASSWORD_BUTTON);
    
    // Fill password
    await this.fill(this.PASSWORD_FIELD, password);
    
    // Click final sign in button
    await this.click(this.FINAL_SIGN_IN_BUTTON);
  }

  async getUserName() {
    return this.getText(this.HEADER_USER_NAME);
  }

  async clickRewardsLink() {
    await this.click(this.REWARDS_LINK);
  }

  async verifyRewardsPageLoaded() {
    await this.page.waitForSelector(this.REWARDS_PAGE_TITLE);
  }

  async isUserInfoVisible() {
    return this.isVisible(this.HEADER_USER_NAME);
  }

  async isShopAndEarnVisible() {
    return this.isVisible(this.SHOP_AND_EARN_TEXT);
  }

  async isLifetimeSavingsVisible() {
    return this.isVisible(this.LIFETIME_SAVINGS_TEXT);
  }

  async setCashOffToggle(state) {
    const isChecked = await this.page.isChecked(this.CASH_OFF_TOGGLE);
    if (state === "ON" && !isChecked) {
      await this.click(this.CASH_OFF_TOGGLE);
    } else if (state === "OFF" && isChecked) {
      await this.click(this.CASH_OFF_TOGGLE);
    }
  }

  async isGroceryRewardsVisible() {
    return this.isVisible(this.GROCERY_REWARDS_CONTAINER);
  }

  async enterOTP(otp) {
    const otpField = "#otpInput"; // Update selector as needed
    await this.fill(otpField, otp);
    const submitButton = "#submitOTP"; // Update selector as needed
    await this.click(submitButton);
  }

  async navigateToAccount() {
    await this.navigateTo("/account"); // Update path as needed
  }
}

module.exports = { AccountPage };
