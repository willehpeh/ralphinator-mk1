# Use Cases: Client Management Foundation

## Use Case 1: Add a New Client to the System

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

---

## Use Case 2: View List of All Clients

**Primary Actor**: Developer/User

**Goal**: See an overview of all clients in the system to understand their current client base and select clients for further action.

**Preconditions**:
- User has access to the CRM system
- At least one client exists in the system (or none, showing empty state)

**Main Success Scenario**:
1. User navigates to the clients section
2. System retrieves all client records
3. System displays a list showing each client's name, status, and key contact information
4. User can see at a glance all clients in the system

**Extensions**:
- 2a. If no clients exist:
  - System displays empty state message
  - System offers option to create first client
- 3a. If user wants to filter by status:
  - User selects status filter (Active, Inactive, Prospect, Past Client)
  - System displays only clients matching selected status
- 4a. If user wants to view a specific client:
  - Continue to Use Case 3: View Client Details

**Success Guarantee**: User has visibility into all clients (or filtered subset) currently in the system.

---

## Use Case 3: View Client Details

**Primary Actor**: Developer/User

**Goal**: See complete information about a specific client to understand their details, status, and history.

**Preconditions**:
- User has access to the CRM system
- The client record exists in the system
- User knows which client they want to view (from list or search)

**Main Success Scenario**:
1. User selects a client from the client list
2. System retrieves the client's complete information
3. System displays all client details including:
   - Company/person name
   - Current status
   - Contact information (email, phone, website)
   - Address
   - Notes
   - When the client was added
   - When the client was last updated
4. User reviews the client information

**Extensions**:
- 2a. If client no longer exists:
  - System displays error message
  - User is returned to client list
- 4a. If user wants to edit client information:
  - Continue to Use Case 4: Update Client Information
- 4b. If user wants to change client status:
  - Continue to Use Case 5: Change Client Status

**Success Guarantee**: User has viewed complete, current information about the selected client.

---

## Use Case 4: Update Client Information

**Primary Actor**: Developer/User

**Goal**: Modify existing client information to keep records accurate and up-to-date as business relationships evolve.

**Preconditions**:
- User has access to the CRM system
- The client record exists in the system
- User is viewing the client details or has selected a client to edit

**Main Success Scenario**:
1. User chooses to edit a client's information
2. System displays current client information in an editable form
3. User modifies any combination of:
   - Company/person name
   - Contact information (email, phone, website)
   - Address
   - Notes
4. User submits the updated information
5. System validates the changes meet business rules
6. System records the changes
7. System displays confirmation message
8. System shows updated client information
9. User can see the client list and detail views now reflect the changes

**Extensions**:
- 5a. If client name is missing or too short/long:
  - System displays validation error
  - User corrects the information
  - Continue from step 4
- 5b. If email format is invalid:
  - System displays validation error
  - User corrects the email
  - Continue from step 4
- 5c. If phone format is invalid:
  - System displays validation error
  - User corrects the phone number
  - Continue from step 4
- 6a. If another user has modified the client simultaneously:
  - System detects conflict
  - System notifies user of concurrent modification
  - User reviews current state and decides to retry or cancel

**Success Guarantee**: The client record contains the updated information, and all previous information is preserved in the system's history.

---

## Use Case 5: Change Client Status

**Primary Actor**: Developer/User

**Goal**: Update a client's status to reflect the current state of the business relationship (e.g., from Prospect to Active, or from Active to Past Client).

**Preconditions**:
- User has access to the CRM system
- The client record exists in the system
- User is viewing the client details or has selected a client

**Main Success Scenario**:
1. User chooses to change a client's status
2. System displays current status and available status options:
   - Active (current paying client)
   - Inactive (temporarily not working together)
   - Prospect (potential client, not yet engaged)
   - Past Client (no longer working together)
3. User selects new status
4. User optionally adds a reason or note for the status change
5. User confirms the status change
6. System validates the new status is different from current status
7. System records the status change
8. System displays confirmation message
9. System shows updated client information with new status
10. User can see the new status reflected in client list and detail views

**Extensions**:
- 6a. If user selects the same status as current:
  - System displays error message
  - User either selects a different status or cancels
  - Continue from step 3
- 9a. If user is viewing filtered client list by status:
  - System refreshes the list
  - Client may move out of current view if filter no longer matches

**Success Guarantee**: The client's status has been updated to the new value, and the system maintains a history of when and why the status changed.

---

## Use Case 6: Filter Clients by Status

**Primary Actor**: Developer/User

**Goal**: View only clients in a specific status category to focus on a particular segment of their client base (e.g., only active clients or only prospects).

**Preconditions**:
- User has access to the CRM system
- User is viewing the client list
- Clients with various statuses exist in the system

**Main Success Scenario**:
1. User is viewing the complete client list
2. User selects a status filter option:
   - Active
   - Inactive
   - Prospect
   - Past Client
3. System retrieves only clients matching the selected status
4. System displays filtered list of clients
5. User sees only clients in the selected status category
6. User can work with this focused subset of clients

**Extensions**:
- 3a. If no clients match the selected status:
  - System displays empty state message for that status
- 6a. If user wants to see all clients again:
  - User clears or removes the status filter
  - System displays complete client list
  - Continue to Use Case 2: View List of All Clients
- 6b. If user wants to select a different status filter:
  - User selects different status
  - System updates the filtered list
  - Continue from step 3

**Success Guarantee**: User is viewing only clients that match their selected status filter, enabling focused work on specific client segments.
