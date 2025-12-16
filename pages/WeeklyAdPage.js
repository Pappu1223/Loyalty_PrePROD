// pages/WeeklyAdPage.js
const { BasePage } = require("./BasePage");

class WeeklyAdPage extends BasePage {
  WEEKLY_AD_LINK = 'text=Weekly Ad';
  FLYER_CONTAINER = ".weekly-ad-flyer";
  FLYER_IFRAME = "iframe[src*=\"flyer\"]";
  PREVIOUS_WEEK_BUTTON = ".flyer-nav .prev";
  NEXT_WEEK_BUTTON = ".flyer-nav .next";
  STORE_SELECTOR = "#store-selector";
  DATE_RANGE_DISPLAY = ".date-range";

  async clickWeeklyAdLink() {
    const weeklyAdLink = this.page.locator(this.WEEKLY_AD_LINK).first();
    await weeklyAdLink.waitFor({ state: 'visible', timeout: 10000 });
    await weeklyAdLink.click();
    console.log('Clicked Weekly Ad link');
  }
  FLYER_CONTAINER = ".weekly-ad-flyer";
  FIRST_AD_ITEM = ".ad-item:nth-child(1)";
  DETAILS_DRAWER = ".weekly-ad-details-drawer";
  ADD_TO_LIST_BUTTON = `${this.DETAILS_DRAWER} button:has-text("Add to List")`;
  REMOVE_FROM_LIST_BUTTON = `${this.DETAILS_DRAWER} button:has-text("Remove from list")`;
  MY_LIST_BADGE = "#myListBadgeCount";

  async clickWeeklyAdLink() {
    await this.click(this.WEEKLY_AD_LINK);
    await this.page.waitForLoadState("networkidle");
  }

  async isFlyerVisible() {
    return this.isVisible(this.FLYER_CONTAINER);
  }

  async clickFirstAdItem() {
    await this.click(this.FIRST_AD_ITEM);
  }

  async isAdDetailsDrawerVisible() {
    return this.isVisible(this.DETAILS_DRAWER);
  }

  async isAddToListButtonVisible() {
    return this.isVisible(this.ADD_TO_LIST_BUTTON);
  }

  async clickAddToListButton() {
    await this.click(this.ADD_TO_LIST_BUTTON);
  }

  async clickRemoveFromListButton() {
    await this.click(this.REMOVE_FROM_LIST_BUTTON);
  }

  async getMyListBadgeCount() {
    const text = await this.getText(this.MY_LIST_BADGE);
    return parseInt(text.trim() || "0", 10);
  }
}

module.exports = { WeeklyAdPage };
