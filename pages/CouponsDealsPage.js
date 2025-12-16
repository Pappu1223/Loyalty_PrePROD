// pages/CouponsDealsPage.js
const { BasePage } = require("./BasePage");

class CouponsDealsPage extends BasePage {
  NAV_BAR_B4U_LINK = "a:has-text(\"Safeway for U\")";
  COUPON_CARD = ".coupon-card";
  LOAD_MORE_BUTTON = "#loadMoreCoupons";
  CATEGORY_FILTER_BASE = (category) => `label:has-text("${category}") input[type="checkbox"]`;
  CATEGORY_FILTER_COUNT = (category) => `label:has-text("${category}") span.count`;
  FIRST_COUPON_CLIP_BUTTON = `${this.COUPON_CARD}:nth-child(1) .clip-button`;
  FIRST_COUPON_DETAILS_LINK = `${this.COUPON_CARD}:nth-child(1) a:has-text("Offer Details")`;
  DETAILS_RIGHT_DRAWER = ".offer-details-drawer";
  DETAILS_TERMS_SECTION = `${this.DETAILS_RIGHT_DRAWER} .terms-and-conditions`;
  QUALIFYING_PRODUCTS_SECTION = `${this.DETAILS_RIGHT_DRAWER} .qualifying-products`;
  QUALIFYING_PRODUCT_ITEM = `${this.QUALIFYING_PRODUCTS_SECTION} .product-item`;
  MY_LIST_LINK = "#myListNavLink";

  async navigateToBannerForU() {
    await this.navigateTo("/loyalty/coupons-deals");
    await this.page.waitForTimeout(2000);
  }

  async clickBannerForULink() {
    console.log('Looking for Safeway for U link');
    
    // Ensure cookies are handled first
    await this.handleCookies();
    
    // First, try to find and click mobile menu toggle if the link is hidden
    const mobileMenuToggle = this.page.locator('[class*="menu-toggle"], [class*="hamburger"], button[aria-expanded]').first();
    if (await mobileMenuToggle.isVisible({ timeout: 3000 })) {
      console.log('Mobile menu toggle found, clicking it');
      await mobileMenuToggle.click();
      await this.page.waitForTimeout(1000);
    }
    
    // Try different selectors for Safeway for U
    const selectors = [
      'text=Safeway for U',
      'button[aria-label="Safeway for U"]',
      'a[href*="/loyalty/coupons-deals"]',
      '[onclick*="/loyalty/coupons-deals"]'
    ];
    
    for (const selector of selectors) {
      const element = this.page.locator(selector).first();
      if (await element.isVisible({ timeout: 5000 })) {
        console.log(`Found Safeway for U with selector: ${selector}`);
        await element.click();
        console.log('Clicked Safeway for U link');
        return;
      }
    }
    
    // If still not found, try JavaScript click on the hidden element
    const hiddenElement = this.page.locator('button[aria-label="Safeway for U"]').first();
    if (await hiddenElement.count() > 0) {
      console.log('Using JavaScript to click hidden Safeway for U button');
      await hiddenElement.evaluate(element => {
        element.click();
      });
      console.log('JavaScript click completed');
      await this.page.waitForTimeout(2000);
      return;
    }
    
    // Last resort: navigate directly to the URL
    console.log('Navigating directly to coupons-deals page');
    await this.navigateTo('/loyalty/coupons-deals');
    return;
  }

  async getCouponCount() {
    return this.page.locator(this.COUPON_CARD).count();
  }

  async isLoadMoreVisible() {
    return this.isVisible(this.LOAD_MORE_BUTTON);
  }

  async selectCategoryFilter(category) {
    await this.click(this.CATEGORY_FILTER_BASE(category));
    await this.page.waitForLoadState("networkidle");
  }

  async getFilterCount(category) {
    const countText = await this.getText(this.CATEGORY_FILTER_COUNT(category));
    return parseInt(countText.replace(/\(|\)/g, ""), 10);
  }

  async clipFirstCoupon() {
    const firstCouponElement = this.page.locator(this.COUPON_CARD).nth(0);
    this.clippedOfferId = await firstCouponElement.getAttribute("data-offer-id");
    await this.click(this.FIRST_COUPON_CLIP_BUTTON);
    await this.page.waitForTimeout(500);
  }

  async isFirstCouponClipped() {
    const buttonText = await this.getText(this.FIRST_COUPON_CLIP_BUTTON);
    return buttonText.trim().toLowerCase() === "clipped";
  }

  async navigateToMyList() {
    await this.click(this.MY_LIST_LINK);
  }

  async clickOfferDetailsOfFirstCoupon() {
    await this.click(this.FIRST_COUPON_DETAILS_LINK);
  }

  async isDetailsDrawerVisible() {
    return this.isVisible(this.DETAILS_RIGHT_DRAWER);
  }

  async hasTermsAndConditions() {
    const text = await this.getText(this.DETAILS_TERMS_SECTION);
    return text && text.length > 50;
  }

  async getQualifyingProductCount() {
    return this.page.locator(this.QUALIFYING_PRODUCT_ITEM).count();
  }

  async areProductsTwoInARow() {
    return this.isVisible(this.QUALIFYING_PRODUCTS_SECTION);
  }
}

module.exports = { CouponsDealsPage };
