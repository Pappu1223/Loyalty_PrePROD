// pages/EmailPage.js
const { BasePage } = require("./BasePage");

class EmailPage extends BasePage {
  WELCOME_COUPON_CARD = (id) => `.coupon-card[data-offer-id="${id}"]`;
  COUPON_STATUS_TEXT = (id) => `${this.WELCOME_COUPON_CARD(id)} .clip-button:has-text("Clipped")`;

  async isWelcomeOfferClipped(offerId) {
    return this.isVisible(this.COUPON_STATUS_TEXT(offerId));
  }

  async waitForWelcomeEmail(emailAddress, timeout = 300000) {
    return null;
  }
}

module.exports = { EmailPage };
