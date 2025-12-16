Feature: Sign-in Management

  @signin @registered
  Scenario: Verify registered user sign in successfully
    Given a registered user is on the Sign-in page
    When the user signs in with valid credentials
    Then the user should be successfully redirected to the Home page
    And the user's name should be displayed in the header

  @signin @guest
  Scenario: Verify sign up/registration for guest user is successful
    Given a guest user is on the Sign-in page
    When the user completes the registration process
    Then the registration should be successful
    And welcome offer should be displayed in Coupons and Deals page

  @signin @email
  Scenario: Verify Welcome Email is received
    Given a user has completed registration
    When the registration is processed
    Then welcome email should be received in the registered email

  @signin @email @clip
  Scenario: Verify Welcome Offer can be clipped from email
    Given user has received welcome email with offer
    When the user clicks on the offer button in email
    And copies the link and opens in new tab
    Then the welcome offer should be clipped successfully
