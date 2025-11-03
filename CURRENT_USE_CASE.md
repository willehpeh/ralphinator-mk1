# Use Case 1: Add a New Client to the System

**Primary Actor**: Developer/User

**Goal**: Record a new client in the system so they can track business relationships and manage future interactions with this client.

**Preconditions**:
- User has access to the CRM system
- User has the necessary information about the client

**Main Success Scenario**:
1. User enters client company or person name
2. User enters contact details (email, phone, website)
3. User enters address information
4. User selects initial client status (Active, Inactive, Prospect, or Past Client)
5. User adds any notes about the client
6. User submits the client information
7. System validates the information meets business rules
8. System records the client in the system
9. System displays confirmation message with client details
10. User can now see the new client in their client list

**Extensions**:
- 7a. If client name is missing or too short/long:
  - System displays validation error
  - User corrects the information
  - Continue from step 6
- 7b. If email format is invalid:
  - System displays validation error
  - User corrects the email
  - Continue from step 6
- 7c. If phone format is invalid:
  - System displays validation error
  - User corrects the phone number
  - Continue from step 6

**Success Guarantee**: A new client record exists in the system with all provided information, and the user can retrieve and view this client.
