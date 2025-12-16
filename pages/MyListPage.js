// pages/MyListPage.js
const { BasePage } = require("./BasePage");

class MyListPage extends BasePage {
  MY_LIST_URL = "/account/mylist";
  MY_LIST_PAGE_TITLE = "h1:has-text(\"My List\")";
  CLIPPED_COUPON_CARD = ".mylist-coupon-card";
  CATEGORY_FILTER_CHECKBOX = (category) => `label:has-text("${category}") input[type="checkbox"]`;
  VIEW_DETAILS_LINK = `${this.CLIPPED_COUPON_CARD} a:has-text("View details")`;
  OFFER_DETAILS_DRAWER = ".offer-details-drawer";
  REMOVE_BUTTON = `${this.CLIPPED_COUPON_CARD} button:has-text("Remove")`;
  EMPTY_LIST_MESSAGE = ".empty-list-message";
  EMPTY_STATE_B4U_LINK = `${this.EMPTY_LIST_MESSAGE} a:has-text("Banner forU")`;

  async navigateToMyList() { await this.navigateTo(this.MY_LIST_URL); await this.page.waitForSelector(this.MY_LIST_PAGE_TITLE); }
  async isMyListPageLoaded() { return this.isVisible(this.MY_LIST_PAGE_TITLE); }
  async getClippedCouponCount() { return this.page.locator(this.CLIPPED_COUPON_CARD).count(); }
  async selectCategoryFilter(category) { await this.click(this.CATEGORY_FILTER_CHECKBOX(category)); await this.page.waitForLoadState("networkidle"); }
  async clickViewDetailsOfFirstCoupon() { await this.click(this.VIEW_DETAILS_LINK); }
  async isOfferDetailsDrawerVisible() { return this.isVisible(this.OFFER_DETAILS_DRAWER); }
  async getFirstCouponId() { const firstCouponElement = this.page.locator(this.CLIPPED_COUPON_CARD).nth(0); return firstCouponElement.getAttribute("data-offer-id"); }
  async removeFirstClippedOffer() { await this.click(this.REMOVE_BUTTON); await this.page.waitForTimeout(1000); }
  async isCouponDisplayed(couponId) { return this.isVisible(`.mylist-coupon-card[data-offer-id="${couponId}"]`); }
  async removeAllCoupons() { let count = await this.getClippedCouponCount(); while (count > 0) { await this.removeFirstClippedOffer(); count = await this.getClippedCouponCount(); } await this.page.waitForLoadState("networkidle"); }
  async isEmptyListMessageVisible(expectedText) { const message = await this.getText(this.EMPTY_LIST_MESSAGE); return message.includes(expectedText); }
  async clickEmptyStateBannerForULink() { await this.click(this.EMPTY_STATE_B4U_LINK); }

  async clipMultipleCoupons(count) {
    // Navigate to coupons page and clip specified number of coupons
    await this.navigateTo("/coupons-deals");
    const couponClipButtons = ".coupon-card .clip-button";
    await this.page.waitForSelector(couponClipButtons, { timeout: 10000 });
    
    const clipButtons = await this.page.locator(couponClipButtons).all();
    const clipsNeeded = Math.min(count, clipButtons.length);
    
    for (let i = 0; i < clipsNeeded; i++) {
      try {
        await clipButtons[i].click();
        await this.page.waitForTimeout(500); // Brief pause between clips
      } catch (error) {
        console.log(`Failed to clip coupon ${i + 1}:`, error.message);
      }
    }
  }
}

module.exports = { MyListPage };
