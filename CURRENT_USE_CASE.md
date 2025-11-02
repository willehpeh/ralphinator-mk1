# Use Case 2: View Client Details

**Primary Actor**: CRM User (Developer, Sales Rep, Account Manager)

**Goal**: Retrieve and view comprehensive information about an existing client.

**Preconditions**:
- User has access to the client management system
- At least one client exists in the system
- User has the client identifier or can find the client

**Main Success Scenario**:
1. User requests to view a specific client's details
2. System retrieves the client information
3. System displays complete client details including:
   - Client name
   - Email address (if provided)
   - Phone number (if provided)
   - Current status
   - Notes (if any)
   - When the client was first added to the system
   - When the client information was last updated
4. User reviews the client information

**Extensions** (alternative flows):
- 2a. Client identifier does not exist in system:
  - 2a1. System displays error message "Client not found"
  - 2a2. Use case ends
- 2b. System error retrieving client:
  - 2b1. System displays error message "Unable to retrieve client details"
  - 2b2. User may retry from step 1

**Success Guarantee**:
- User has viewed accurate, current client information
- All client details are displayed correctly
