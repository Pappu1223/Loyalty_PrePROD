// pages/FreshPassPage.js
const { BasePage } = require("./BasePage");

class FreshPassPage extends BasePage {
  FRESHPASS_LINK = "a[href*=\"/freshpass\"]";
  FRESHPASS_PLANS_PAGE_TITLE = "h1:has-text(\"Choose Your Plan\")";
  FIRST_PLAN_SELECT_BUTTON = ".plan-card:nth-child(1) .select-button";
  CHECKOUT_BUTTON = "#checkoutButton";
  SIGN_IN_PROMPT = "#signInOrRegisterPrompt";
  REGISTRATION_EMAIL_FIELD = "#regEmail";
  REGISTRATION_PASSWORD_FIELD = "#regPassword";
  REGISTRATION_BUTTON = "#registerButton";
  CARD_NUMBER_FIELD = "#cardNumber";
  COMPLETE_SUB_BUTTON = "#completeSubscriptionButton";
  SUCCESS_MESSAGE = ".subscription-success-message";

  async isFreshPassLinkVisible() { return this.isVisible(this.FRESHPASS_LINK); }
  async navigateToFreshPassPlans() { await this.navigateTo("/freshpass/plans"); await this.page.waitForSelector(this.FRESHPASS_PLANS_PAGE_TITLE); }
  async selectSubscriptionPlan() { await this.click(this.FIRST_PLAN_SELECT_BUTTON); }
  async clickCheckout() { await this.click(this.CHECKOUT_BUTTON); }
  async isSignInPromptVisible() { return this.isVisible(this.SIGN_IN_PROMPT); }
  async signUpDuringCheckout(email, password) { await this.fill(this.REGISTRATION_EMAIL_FIELD, email); await this.fill(this.REGISTRATION_PASSWORD_FIELD, password); await this.click(this.REGISTRATION_BUTTON); await this.page.waitForLoadState("networkidle"); }
  async enterCardDetails(cardNumber) { await this.fill(this.CARD_NUMBER_FIELD, cardNumber); }
  async completeSubscription() { await this.click(this.COMPLETE_SUB_BUTTON); }
  async isSubscriptionSuccessMessageVisible() { return this.isVisible(this.SUCCESS_MESSAGE); }
}

module.exports = { FreshPassPage };
