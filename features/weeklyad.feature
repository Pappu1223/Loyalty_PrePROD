Feature: WeeklyAd Management

  @weeklyad @guest @navigation
  Scenario: Guest User - Click on WeeklyAd link and verify page loading
    Given a guest user is on the Home page
    When the user clicks the "Weekly Ad" link from the header
    Then the Weekly Ad publication flyer should load

  @weeklyad @guest @signin
  Scenario: Guest User - Add to List redirects to Sign-in
    Given a guest user is on Weekly Ad page
    When user selects an ad and clicks on "Add to List"
    Then user should be navigated to Sign-in page

  @weeklyad @registered @navigation
  Scenario: Registered user - Click on WeeklyAd link and verify page loading
    Given a registered user is logged in
    When the user clicks the "Weekly Ad" link from the header
    Then the Weekly Ad publication flyer should load

  @weeklyad @registered @details
  Scenario: Click on an ad and verify details displayed
    Given registered user is on Weekly Ad page
    When user clicks on an ad
    Then details should be displayed on right drawer
    And "Add to list" button should be present

  @weeklyad @registered @addtolist
  Scenario: Add to List and verify MyList batch count increase
    Given registered user is on Weekly Ad page
    When user clicks "Add to List" for an ad
    Then MyList batch count should be increasing

  @weeklyad @registered @removefromlist
  Scenario: Remove from list and verify MyList batch count decrease
    Given registered user has added item to list from Weekly Ad
    When user clicks "Remove from list" for the added coupon
    Then MyList batch count should be decreasing

  @weeklyad @registered @mylistnavigation
  Scenario: Click on MyList batch and verify navigation
    Given registered user is on Weekly Ad page with items in MyList
    When user clicks on MyList batch
    Then user should navigate to MyList page

  @weeklyad @comprehensive
  Scenario: Comprehensive Weekly Ad functionality verification
    Given user is on Weekly Ad page
    Then Sign In/Up should be displayed for Anonymous user
    And fulfillment options should be available (change store, In Store, Delivery, Pick up)
    And search Bar should be hidden
    And sponsored ads should be displayed in top, bottom and non-endemic ad
    And Weekly Ad publication flyer should load per the division
    And Print and Share button should be available and working
    And My List item count should be available for logged in user
    And Add to list functionality should work
    And Add to cart functionality should work
    And Print coupon button should work
    And Clip Coupon functionality should work
    And products should be displayed two in a row on the right drawer
    And Sign in to add button should be displayed for anonymous user
    When anonymous user clicks "Sign in to add" button
    Then user should navigate to login and back to weekly ad page in main domain
