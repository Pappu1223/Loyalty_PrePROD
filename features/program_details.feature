Feature: Program Details and Additional Features

  @program @details
  Scenario: Verify Program Details page is displayed
    Given registered user is on Banner for U page
    When user clicks on "Program Details" page
    Then Program Details page should be displayed

  @program @links
  Scenario: Verify all links on program details work correctly
    Given registered user is on Program Details page
    Then all links on the program details should work correctly
    And navigation should work without any error

  @program @faqs
  Scenario: Verify New Safeway for U™ FAQs are displayed
    Given registered user is on Program Details page
    Then New Safeway for U™ FAQs should be displayed in Program Details page

  @games
  Scenario: Verify game page functionality
    Given registered user is on Banner for U page
    When user clicks on "Games"
    Then game page should be loaded
    And any active games should be displayed

  @bonuspath
  Scenario: Verify bonus path page functionality
    Given registered user is on Banner for U page
    When user clicks on "Bonus Path"
    Then bonus path page should be loaded
    And offers should be displayed
    When user clips/activates an offer
    Then activated/clipped offers should be displayed on MyList