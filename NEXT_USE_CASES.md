# Use Cases: Client Management Foundation

## Use Case 3: Search for Specific Clients

**Primary Actor**: Developer/User

**Goal**: Quickly find one or more clients by searching for their company name

**Preconditions**:
- User has access to the CRM system
- Clients exist in the system

**Main Success Scenario**:
1. User navigates to the clients list view
2. System displays all clients with a search interface
3. User types a client's company name (or partial name) into the search field
4. System filters the client list in real-time as user types
5. System displays only clients whose names match the search term
6. User identifies the desired client from the filtered results

**Extensions**:
- 5a. If no clients match the search term:
  - 5a1. System displays a message that no matches were found
  - 5a2. System suggests checking spelling or trying different search terms
- 5b. If user clears the search:
  - 5b1. System restores the full client list

**Success Guarantee**:
- User sees only clients matching their search criteria
- Search results are accurate and current

---

## Use Case 4: View Detailed Information About a Client

**Primary Actor**: Developer/User

**Goal**: Review all available information about a specific client

**Preconditions**:
- User has access to the CRM system
- The client exists in the system
- User knows which client they want to view

**Main Success Scenario**:
1. User locates the desired client in the client list
2. User selects the client to view details
3. System retrieves the complete client information
4. System displays all client details including name, status, notes, and timestamps
5. User reviews the client information

**Extensions**:
- 3a. If the client no longer exists:
  - 3a1. System displays an error message
  - 3a2. System returns user to the client list
- 5a. If user wants to make changes:
  - 5a1. System provides an option to edit the client (see Use Case 5)

**Success Guarantee**:
- User sees complete, current information about the selected client
- All client details are accurately displayed

---

## Use Case 5: Update Client Information

**Primary Actor**: Developer/User

**Goal**: Modify stored information about an existing client to keep records current

**Preconditions**:
- User has access to the CRM system
- The client exists in the system
- User has identified information that needs to be updated

**Main Success Scenario**:
1. User navigates to the client's detail view
2. System displays current client information
3. User chooses to edit the client
4. System displays an editable form with current client information pre-filled
5. User modifies the company name, notes, or other editable fields
6. User submits the updated information
7. System validates the changes
8. System updates the client record
9. System displays confirmation with the updated details
10. System reflects the changes in the client list and detail views

**Extensions**:
- 7a. If validation fails:
  - 7a1. System displays specific error messages
  - 7a2. User corrects the issues and resubmits
- 7b. If user wants to cancel changes:
  - 7b1. User cancels the edit operation
  - 7b2. System discards changes and returns to the detail view

**Success Guarantee**:
- Client information is updated with the new values
- Updated information appears consistently across all views
- Previous information is no longer displayed

---

## Use Case 6: Change Client Status

**Primary Actor**: Developer/User

**Goal**: Update a client's business relationship status to reflect current reality

**Preconditions**:
- User has access to the CRM system
- The client exists in the system
- The client's business relationship status has changed

**Main Success Scenario**:
1. User navigates to the client's detail view
2. System displays current client information including current status
3. User chooses to change the client's status
4. System displays available status options (Active, Inactive, Prospect, Past Client)
5. User selects a new status
6. System prompts for confirmation of the status change
7. User confirms the change
8. System updates the client's status
9. System displays confirmation of the status change
10. System reflects the new status in all views (detail, list, badges)

**Extensions**:
- 7a. If user cancels the confirmation:
  - 7a1. System cancels the status change
  - 7a2. System keeps the original status
- 8a. If the status change represents a significant business event (e.g., Active to Past Client):
  - 8a1. System may record additional context about the change
  - 8a2. System updates the client's timestamp

**Success Guarantee**:
- Client's status is updated to the new value
- New status appears consistently across all views
- Status change is recorded with timestamp

---

## Use Case 7: Filter Client List by Status

**Primary Actor**: Developer/User

**Goal**: View only clients with a specific business relationship status

**Preconditions**:
- User has access to the CRM system
- Clients exist in the system with various statuses

**Main Success Scenario**:
1. User navigates to the clients list view
2. System displays all clients
3. User selects a specific status filter (Active, Inactive, Prospect, or Past Client)
4. System filters the list to show only clients with the selected status
5. System displays the filtered client count
6. User reviews the filtered list

**Extensions**:
- 4a. If no clients match the selected status:
  - 4a1. System displays a message that no clients have this status
- 6a. If user wants to see all clients again:
  - 6a1. User clears or resets the status filter
  - 6a2. System displays the complete client list
- 6b. If user wants to change to a different status filter:
  - 6b1. User selects a different status
  - 6b2. System updates the list to match the new filter

**Success Guarantee**:
- User sees only clients matching the selected status
- Filtered list is accurate and current
- User can clearly identify which filter is active
