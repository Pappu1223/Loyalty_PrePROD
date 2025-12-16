Feature: Rewards Management

  @rewards @navigation
  Scenario: Verify Rewards link is available
    Given registered user is logged in
    When user navigates to Account page
    Then "Points & Rewards" link should be available

  @rewards @display
  Scenario: Verify Reward points and main elements
    Given registered user is on Points & Rewards page
    Then reward points should be displayed
    And Banner for U logo should be visible
    And "Savings to Date: Lifetime Savings" should be displayed

  @rewards @navigation @buttons
  Scenario: Verify Use my Points and View Points History buttons
    Given registered user is on Points & Rewards page
    When user clicks "Use my Points" button
    Then user should be navigated to foru/rewards page
    When user clicks "View Points History" button
    Then user should be navigated to foru/rewards/reward-history page

  @rewards @display @logo
  Scenario: Verify Rewards logo and point balance
    Given registered user is on Points & Rewards page
    Then rewards logo should be displayed as golden star-shaped circle
    And point balance should be displayed to the right
    And expiration text should read "x Points expire Month xx"

  @rewards @toggle
  Scenario: Verify Convert Points toggle functionality
    Given registered user is on Rewards page
    Then "Convert Points into cash off at checkout" should be available
    When toggle is OFF
    Then Grocery rewards should be displayed
    When user toggles it ON
    Then Grocery rewards should not be displayed

  @rewards @redemption
  Scenario: Verify rewards redemption and points deduction
    Given registered user is on Rewards page
    When user redeems/clips a reward
    Then reward points should be deducted accordingly
    When reward is reclaimed/unclipped
    Then balance should be updated accordingly

  @rewards @modal
  Scenario: Verify redeemed rewards in Get your reward modal
    Given registered user has redeemed rewards
    When user accesses Get your reward modal
    Then redeemed/clipped rewards should be listed

  @rewards @details
  Scenario: Verify Reward Details functionality
    Given registered user is on Rewards page
    When user clicks on "Reward Details" link
    Then reward details should be displayed

  @rewards @freshpass
  Scenario: Verify FreshPass integration
    Given registered user is on Rewards page
    Then "Points don't expire with FreshPass" should be displayed
    And "Join today" link should be present
    When user clicks "Join today" link
    Then user should navigate to FreshPass page

  @rewards @links
  Scenario: Verify all navigation links work correctly
    Given registered user is on Rewards page
    Then "How it works" link should navigate to program-details page
    And "Points history" link should work correctly
    And "Get your rewards" link should work correctly
    And "Save at the pump" link should work correctly
    And all other links should work without errors