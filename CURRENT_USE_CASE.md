# Use Case 1: Add a New Contact to a Client

**Primary Actor**: Developer/User

**Goal**: Record a new contact person associated with a client company so that the user can maintain relationships with individuals at that organization.

**Preconditions**:
- At least one client exists in the system
- User has access to the CRM system

**Main Success Scenario**:
1. User selects a client company from the list
2. User enters the contact person's name, role/title, email address, and phone number
3. System validates that all required information is provided and correctly formatted
4. System saves the contact and associates it with the selected client
5. System displays confirmation message with the new contact's details
6. System returns user to a view showing the contact information

**Extensions**:
- 2a. If user does not provide required fields (name, client):
  - 2a1. System highlights missing fields
  - 2a2. System prompts user to complete required information
  - 2a3. User provides missing information and continues at step 3
- 3a. If email address format is invalid:
  - 3a1. System displays validation error for email field
  - 3a2. User corrects the email address
  - 3a3. Continue at step 3
- 3b. If selected client does not exist:
  - 3b1. System displays error message
  - 3b2. User selects a different client or creates a new client first
  - 3b3. Continue at step 2

**Success Guarantee**: A new contact is recorded in the system, associated with the specified client, and can be retrieved for future reference.
