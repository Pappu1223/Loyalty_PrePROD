// pages/RewardsPage.js
const { BasePage } = require("./BasePage");

class RewardsPage extends BasePage {
  REWARDS_PAGE_URL = "/foru/rewards";
  REWARDS_PAGE_TITLE = "h1:has-text(\"Points & Rewards\")";
  USER_INFO_CONTAINER = ".rewards-user-info";
  REWARDS_LOGO = ".rewards-star-icon";
  POINT_BALANCE_VALUE = ".point-balance-value";
  EXPIRATION_TEXT = "text=Points expire Month";
  SHOP_AND_EARN_TEXT = "text=Shop & Earn";
  LIFETIME_SAVINGS_TEXT = "text=Lifetime Savings";
  CASH_OFF_TOGGLE = "#cashOffToggle";
  GROCERY_REWARDS_CONTAINER = ".grocery-rewards-list";

  constructor(page, baseUrl) { super(page, baseUrl); }

  async navigateToRewardsPage() { await this.navigateTo(this.REWARDS_PAGE_URL); }
  async verifyRewardsPageLoaded() { await this.page.waitForSelector(this.REWARDS_PAGE_TITLE); }
  async isUserInfoVisible() { return this.isVisible(this.USER_INFO_CONTAINER); }
  async isRewardsLogoVisible() { return this.isVisible(this.REWARDS_LOGO); }
  async isPointsBalanceVisible() { return this.isVisible(this.POINT_BALANCE_VALUE); }
  async getPointBalance() { const text = await this.getText(this.POINT_BALANCE_VALUE); return parseInt((text || "0").replace(/,/g, ""), 10); }
  async isExpirationTextVisible() { return this.isVisible(this.EXPIRATION_TEXT); }
  async isShopAndEarnVisible() { return this.isVisible(this.SHOP_AND_EARN_TEXT); }
  async isLifetimeSavingsVisible() { return this.isVisible(this.LIFETIME_SAVINGS_TEXT); }
  async setCashOffToggle(state) { const isChecked = await this.page.isChecked(this.CASH_OFF_TOGGLE); if (state === "ON" && !isChecked) await this.click(this.CASH_OFF_TOGGLE); else if (state === "OFF" && isChecked) await this.click(this.CASH_OFF_TOGGLE); }
  async isGroceryRewardsVisible() { return this.isVisible(this.GROCERY_REWARDS_CONTAINER); }

  // Extended methods for comprehensive testing
  async isLinkAvailable(linkText) { return await this.isVisible(`text=${linkText}`); }
  async isRewardPointsDisplayed() { return await this.isVisible(this.POINT_BALANCE_VALUE); }
  async isBannerForULogoVisible() { return await this.isVisible('.banner-foru-logo, .logo'); }
  async isTextDisplayed(text) { return await this.isVisible(`text=${text}`); }
  async clickButton(buttonText) { await this.click(`button:has-text("${buttonText}")`); }
  async isRewardsLogoCorrect() { return await this.isVisible(this.REWARDS_LOGO); }
  async isPointBalanceDisplayedCorrectly() { return await this.isVisible(this.POINT_BALANCE_VALUE); }
  async getExpirationText() { const element = this.page.locator(this.EXPIRATION_TEXT); return await element.textContent() || ''; }
  async isFeatureAvailable(featureText) { return await this.isVisible(`text=${featureText}`); }
  async setToggleState(state) { await this.setCashOffToggle(state); }
  async toggleState(state) { await this.setCashOffToggle(state); }
  async isGroceryRewardsDisplayed() { return await this.isGroceryRewardsVisible(); }
  async getCurrentPoints() { return await this.getPointBalance(); }
  async redeemReward() { const rewardItem = this.page.locator('.reward-item').first(); if (await rewardItem.isVisible()) { await rewardItem.locator('button:has-text("Redeem")').click(); } }
  async unredeemReward() { const rewardItem = this.page.locator('.reward-item').first(); if (await rewardItem.isVisible()) { await rewardItem.locator('button:has-text("Remove")').click(); } }
  async redeemSampleReward() { await this.redeemReward(); }
  async openGetYourRewardModal() { await this.click('text=Get your rewards'); }
  async areRedeemedRewardsListed() { return await this.isVisible('.rewards-modal .reward-item'); }
  async clickLink(linkText) { await this.click(`text=${linkText}`); }
  async isRewardDetailsDisplayed() { return await this.isVisible('.reward-details'); }
  async isLinkPresent(linkText) { return await this.isVisible(`text=${linkText}`); }
  async isLinkWorking(linkText) { try { await this.clickLink(linkText); await this.page.waitForTimeout(2000); return true; } catch { return false; } }
  async verifyAllLinksWork() { const links = ['How it works', 'Points history', 'Get your rewards', 'Save at the pump']; for (const link of links) { if (!await this.isLinkWorking(link)) return false; await this.navigateToRewardsPage(); } return true; }
}

module.exports = { RewardsPage };
