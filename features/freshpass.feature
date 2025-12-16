Feature: FreshPass Management

  @freshpass @navigation
  Scenario: Verify FreshPass link is available
    Given registered user is logged in
    When user navigates to Account page
    Then FreshPass link should be available

  @freshpass @guest @subscription
  Scenario: Verify unsubscribed user can subscribe to FreshPass
    Given guest user is on FreshPass page
    Then user should be able to navigate to plans
    When user adds card details
    And completes subscription process
    Then subscription should be successful