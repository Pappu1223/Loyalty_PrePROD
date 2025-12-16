Feature: Home Page Functionality

  @homepage @carousel
  Scenario: Verify Coupons & Deals Carousel is displayed on Home page
    Given user is on the Home page
    Then Coupons & Deals Carousel should be displayed

  @homepage @navbar
  Scenario: Verify Nav bar and navigation links
    Given user is on the Home page
    Then Nav bar should be displayed
    And "Banner for U" link should be present and functional
    And "Weekly Ad" link should be present and functional  
    And "Meals Plan" link should be present and functional

  @homepage @carousel @viewall
  Scenario: Verify View All link navigates to Coupons & Deals page
    Given user is on the Home page
    When user clicks on "View All" link in Coupons & Deals Carousel
    Then user should be navigated to Banner for U Coupons & Deals page

  @homepage @carousel @clip
  Scenario: Clip coupon from Carousel and verify in MyList
    Given registered user is on the Home page
    When user clips a coupon from the Carousel
    Then clipped coupon should be displayed in MyList

  @homepage @carousel @details
  Scenario: Verify Offer Details from Carousel
    Given user is on the Home page
    When user clicks on "Offer Details" link from homepage
    Then offer details should be displayed in right drawer
    And offer terms and conditions should be visible
    And qualifying products should be displayed
    And products should be displayed two in a row when multiple products exist