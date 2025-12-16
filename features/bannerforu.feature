Feature: Banner for U - Coupons & Deals Functionality

  @b4u @navigation
  Scenario: Verify Banner for U Link on Nav bar
    Given user is on the Home page
    Then "Banner for U" link should be present on Nav bar

  @b4u @guest
  Scenario: Guest User redirection to Sign-in
    Given a guest user is on the Home page
    When the user clicks the "Banner for U" link on the Nav bar
    Then the user should be redirected to the Sign-in page

  @b4u @registered
  Scenario: Registered User access and default view
    Given a registered user is logged in
    When the user clicks the "Banner for U" link on the Nav bar
    Then the user should be redirected to the Coupons & Deals page
    And all available coupons should be displayed

  @b4u @navigation @links
  Scenario: Verify Banner for U displays five navigation links
    Given registered user is on Banner for U page
    Then five links should be displayed on left grid:
      | Coupons & Deals |
      | Rewards         |
      | Program Details |
      | Games           |
      | Bonus Path      |

  @b4u @coupons @filters
  Scenario: Verify Coupons & Deals page filters
    Given registered user is on Coupons & Deals page
    Then category list with checkboxes should be displayed
    And events list with checkboxes should be displayed
    And offer type list should be displayed

  @b4u @coupons @display
  Scenario: Verify all coupons displayed when no filter selected
    Given registered user is on Coupons & Deals page
    When no filter is selected
    Then all available coupons should be displayed
    And "Load more" link should be displayed when offers exceed one page

  @b4u @coupons @filter @single
  Scenario: Verify single category filter
    Given registered user is on Coupons & Deals page
    When user selects a single category
    Then only offers related to selected category should be displayed

  @b4u @coupons @filter @multiple
  Scenario: Verify multiple category filter
    Given registered user is on Coupons & Deals page
    When user selects multiple categories
    Then only offers related to selected categories should be displayed

  @b4u @coupons @sort
  Scenario: Verify Sort functionality
    Given registered user is on Coupons & Deals page
    Then sort dropdown should contain Purchase History, New offers, About to Expire
    When user selects a sort option
    Then coupons should be sorted accordingly

  @b4u @coupons @clip
  Scenario: Verify clipping different offer types
    Given registered user is on Coupons & Deals page
    When user clips offers of type PD, SC, MF
    Then offers should be clipped successfully

  @b4u @coupons @details
  Scenario: Verify Offer Details page
    Given registered user is on Coupons & Deals page
    When user clicks "Offer Details" link
    Then offer should be displayed
    And coupon clipped status should be shown
    And qualifying products should be displayed
