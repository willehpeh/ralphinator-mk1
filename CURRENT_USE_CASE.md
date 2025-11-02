# Use Case 1: Add a New Client to the System

**Primary Actor**: CRM User (Developer, Sales Rep, Account Manager)

**Goal**: Record a new client in the system so their information can be tracked and associated with future projects.

**Preconditions**:
- User has access to the client management system
- User has necessary permissions to add clients

**Main Success Scenario**:
1. User initiates adding a new client
2. System presents a form requesting client details
3. User enters client name (e.g., "Acme Corporation")
4. User optionally enters client email address
5. User optionally enters client phone number
6. User selects client status from available options (Active, Inactive, Prospect, Past Client) or accepts default (Prospect)
7. User optionally enters notes about the client
8. User submits the client information
9. System validates all entered information
10. System records the new client with a unique identifier and timestamps
11. System confirms successful creation and displays the client details

**Extensions** (alternative flows):
- 3a. User submits without entering a name:
  - 3a1. System displays error message "Client name is required"
  - 3a2. User returns to step 3
- 4a. User enters an invalid email format:
  - 4a1. System displays error message "Please enter a valid email address"
  - 4a2. User returns to step 4
- 9a. System validation fails:
  - 9a1. System displays specific validation error messages
  - 9a2. User corrects the information and returns to step 8
- 10a. System encounters an error while recording the client:
  - 10a1. System displays error message "Unable to create client. Please try again."
  - 10a2. User may retry from step 8 or cancel

**Success Guarantee**:
- New client is permanently recorded in the system with a unique identifier
- Client information can be retrieved for future reference
- System maintains accurate creation and update timestamps
- User receives confirmation of successful creation
