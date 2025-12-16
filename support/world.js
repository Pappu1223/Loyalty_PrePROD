// support/world.js
const { setWorldConstructor, World, setDefaultTimeout } = require("@cucumber/cucumber");
const chai = require("chai");

// Set default timeout to 30 seconds
setDefaultTimeout(30000);

// Extend the default World
class CustomWorld extends World {
  constructor(options) {
    super(options);
    this.browser = null;
    this.page = null;
    this.expect = chai.expect; // Inject Chai for assertions
    this.BASE_URL = "https://www.safeway.com"; // **UPDATE THIS**
  }
}

setWorldConstructor(CustomWorld);
