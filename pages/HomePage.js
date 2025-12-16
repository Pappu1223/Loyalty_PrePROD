// pages/HomePage.js
const { BasePage } = require("./BasePage");

class HomePage extends BasePage {
  // Selectors - Updated to match actual Safeway website
  NAV_BAR = "nav, header, .navigation";
  COUPONS_DEALS_CAROUSEL = ".carousel, .deals-carousel, .promo-carousel, [data-testid*='carousel'], .slider";
  BANNER_FOR_U_LINK = 'text=Safeway for U';
  WEEKLY_AD_LINK = 'text=Weekly Ad';
  MEALS_PLAN_LINK = 'text=Meal Plans';
  VIEW_ALL_LINK = 'text=View All';
  CLIP_COUPON_BUTTON = '.clip-button';
  OFFER_DETAILS_LINK = 'text=Offer Details';
  OFFER_DETAILS_DRAWER = '.offer-details-drawer';
  TERMS_CONDITIONS = '.terms-and-conditions';
  QUALIFYING_PRODUCTS = '.qualifying-products';
  PRODUCT_ROW = '.product-row';

  async navigateToHomePage() {
    await this.navigateTo("/");
    await this.handleCookies();
  }

  async isCouponsDealsCarouselVisible() {
    // Check for multiple possible carousel selectors
    const carouselSelectors = [
      '.carousel',
      '.deals-carousel', 
      '.promo-carousel',
      '[data-testid*="carousel"]',
      '.slider',
      '.offers-section',
      '.deals-section'
    ];
    
    console.log('[DEBUG] Checking for carousel with selectors:', carouselSelectors);
    
    for (const selector of carouselSelectors) {
      const isVisible = await this.isVisible(selector);
      console.log(`[DEBUG] Selector '${selector}': ${isVisible ? 'FOUND' : 'NOT FOUND'}`);
      if (isVisible) {
        console.log(`[SUCCESS] Carousel found with selector: ${selector}`);
        return true;
      }
    }
    
    // Log what elements ARE available on the page
    try {
      const allElements = await this.page.locator('*[class*="carousel"], *[class*="deal"], *[class*="offer"], *[class*="promo"]').all();
      console.log(`[DEBUG] Found ${allElements.length} potential carousel-related elements`);
      
      for (let i = 0; i < Math.min(5, allElements.length); i++) {
        const className = await allElements[i].getAttribute('class');
        console.log(`[DEBUG] Element ${i + 1} class: ${className}`);
      }
    } catch (error) {
      console.log('[DEBUG] Error inspecting elements:', error.message);
    }
    
    console.log('[RESULT] No carousel found');
    return false;
  }

  async isNavBarVisible() {
    const navSelectors = [
      'nav',
      'header',
      '.navigation',
      '.navbar',
      '.nav-bar',
      '.header-nav'
    ];
    
    for (const selector of navSelectors) {
      if (await this.isVisible(selector)) {
        return true;
      }
    }
    return false;
  }

  async isLinkPresentAndFunctional(linkText) {
    const linkSelector = `text=${linkText}`;
    const isPresent = await this.isVisible(linkSelector);
    
    if (isPresent) {
      // Try clicking to verify functionality
      try {
        await this.click(linkSelector);
        await this.page.waitForTimeout(2000);
        return true;
      } catch (error) {
        console.log(`Link ${linkText} present but not functional:`, error.message);
        return false;
      }
    }
    return false;
  }

  async clickCarouselLink(linkText) {
    // First try to find the carousel
    const carouselSelectors = [
      '.carousel',
      '.deals-carousel', 
      '.promo-carousel',
      '[data-testid*="carousel"]',
      '.slider'
    ];
    
    for (const carouselSelector of carouselSelectors) {
      if (await this.isVisible(carouselSelector)) {
        const linkInCarousel = this.page.locator(carouselSelector).locator(`text=${linkText}`);
        if (await linkInCarousel.isVisible({ timeout: 3000 })) {
          await linkInCarousel.click();
          return;
        }
      }
    }
    
    // Fallback: click the link anywhere on the page
    await this.click(`text=${linkText}`);
  }

  async clipCouponFromCarousel() {
    // Look for clip buttons in various carousel formats
    const clipSelectors = [
      '.carousel .clip-button',
      '.deals-carousel .clip-button',
      '.promo-carousel .clip-button',
      '[data-testid*="carousel"] .clip-button',
      '.slider .clip-button',
      'button:has-text("Clip")',
      'button:has-text("Add")',
      '.clip-coupon'
    ];
    
    for (const selector of clipSelectors) {
      if (await this.isVisible(selector)) {
        await this.click(selector);
        return;
      }
    }
    
    throw new Error('No clip button found in carousel');
  }

  async navigateToMyList() {
    await this.navigateTo("/account/mylist");
  }

  async isClippedCouponInMyList() {
    const couponCards = ".mylist-coupon-card, .coupon-item";
    const couponCount = await this.page.locator(couponCards).count();
    return couponCount > 0;
  }

  async clickLink(linkText) {
    const linkSelector = `text=${linkText}`;
    await this.click(linkSelector);
  }

  async isOfferDetailsDrawerVisible() {
    return await this.isVisible(this.OFFER_DETAILS_DRAWER);
  }

  async isTermsAndConditionsVisible() {
    return await this.isVisible(this.TERMS_CONDITIONS);
  }

  async isQualifyingProductsVisible() {
    return await this.isVisible(this.QUALIFYING_PRODUCTS);
  }

  async verifyProductsDisplayedInRows() {
    const productRows = await this.page.locator(this.PRODUCT_ROW).count();
    const products = await this.page.locator(`${this.QUALIFYING_PRODUCTS} .product-item`).count();
    
    // Verify products are displayed in rows (2 per row typically)
    if (products > 2) {
      return productRows >= Math.ceil(products / 2);
    }
    return products > 0;
  }
}

module.exports = { HomePage };