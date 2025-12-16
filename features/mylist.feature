Feature: MyList Management

  @mylist @display
  Scenario: Go to MyList and verify clipped coupons are displayed
    Given a registered user is logged in
    And the user has clipped at least three different coupons
    When the user navigates to "MyList"
    Then the MyList page should be displayed
    And the three previously clipped coupons should be displayed

  @mylist @categories
  Scenario: Verify Category list is displayed in MyList
    Given registered user is on MyList page with clipped coupons
    Then category list should be displayed on the left side
    And categories should match clipped coupons categories

  @mylist @filter
  Scenario: Select a Category and verify filtered display
    Given registered user is on MyList page with multiple category coupons
    When user selects a specific category
    Then only that category coupons should be displayed in MyList

  @mylist @details
  Scenario: MyList - Click on View details link for a coupon
    Given registered user is on MyList page
    When user clicks on "View details" link for a coupon
    Then offer details page should be displayed

  @mylist @remove
  Scenario: MyList - Remove a clipped offer and verify unclipped status
    Given registered user is on MyList page with clipped offers
    When user removes a clipped offer
    And navigates to Coupons and Deals page
    Then offer should be unclipped
    And "Clip Coupon" button should be displayed

  @mylist @empty
  Scenario: Verify empty MyList message after removing all offers
    Given registered user has clipped offers in MyList
    When user removes all clipped offers from MyList
    Then the text "To build a list, add offers from Banner forU" should be displayed
    When user clicks on "Banner for U" link
    Then user should navigate to Coupons & Deals page
