# Use Cases for Client Management System

## Use Case 2: View All Clients

**Primary Actor**: Developer/Business User

**Goal**: See a list of all client companies to review business relationships

**Preconditions**:
- User has access to the client management system

**Main Success Scenario**:
1. User navigates to client list
2. System retrieves all clients
3. System displays list showing client names and key information
4. User browses the list

**Extensions**:
- 2a. If no clients exist:
  - System displays message indicating no clients found
  - System provides option to add first client
- 2b. If system takes time to load:
  - System displays loading indicator
  - System shows results when ready

**Success Guarantee**: User can see all clients currently in the system

---

## Use Case 3: View Client Details

**Primary Actor**: Developer/Business User

**Goal**: See complete information about a specific client company

**Preconditions**:
- User has access to the client management system
- Client exists in the system

**Main Success Scenario**:
1. User selects a client from the list
2. System retrieves complete client information
3. System displays all client details (name, email, phone, address, status, notes)
4. User reviews the information

**Extensions**:
- 2a. If client no longer exists:
  - System displays error message
  - System returns user to client list
- 2b. If system takes time to load:
  - System displays loading indicator
  - System shows details when ready

**Success Guarantee**: User can see all recorded information about the client

---

## Use Case 4: Update Client Information

**Primary Actor**: Developer/Business User

**Goal**: Modify existing client information when details change

**Preconditions**:
- User has access to the client management system
- Client exists in the system
- User is viewing or has selected the client

**Main Success Scenario**:
1. User initiates edit on client
2. System displays client form populated with current information
3. User modifies client details (name, email, phone, address, notes)
4. User submits the changes
5. System validates the updated information
6. System saves the changes
7. System displays confirmation message
8. System shows updated client information

**Extensions**:
- 5a. If required information is removed:
  - System displays validation errors
  - System highlights missing fields
  - User corrects information and resubmits
- 5b. If email format becomes invalid:
  - System displays email validation error
  - User corrects email and resubmits
- 3a. If user cancels before submitting:
  - System discards changes
  - System returns to viewing client details

**Success Guarantee**: Client information is updated in the system with new values

---

## Use Case 5: Change Client Status

**Primary Actor**: Developer/Business User

**Goal**: Update a client's status to reflect current business relationship

**Preconditions**:
- User has access to the client management system
- Client exists in the system

**Main Success Scenario**:
1. User selects a client
2. User initiates status change
3. System presents available statuses (Active, Inactive, Prospect, Past Client)
4. User selects new status
5. User confirms the change
6. System saves the new status
7. System displays confirmation message
8. System shows client with updated status

**Extensions**:
- 5a. If user cancels before confirming:
  - System discards status change
  - Client retains original status

**Success Guarantee**: Client's status is updated to reflect new business relationship state

---

## Use Case 6: Filter Clients by Status

**Primary Actor**: Developer/Business User

**Goal**: View only clients with a specific status to focus on particular business relationships

**Preconditions**:
- User has access to the client management system
- Clients exist in the system

**Main Success Scenario**:
1. User is viewing client list
2. User selects status filter (Active, Inactive, Prospect, or Past Client)
3. System retrieves clients matching selected status
4. System displays filtered list
5. User reviews clients with that status

**Extensions**:
- 3a. If no clients match the selected status:
  - System displays message indicating no clients found with that status
  - System provides option to clear filter or try different status
- 2a. If user clears filter:
  - System displays all clients again

**Success Guarantee**: User sees only clients matching the selected status criteria

---

## Notes on Use Case Ordering

The use cases are ordered to reflect the typical business flow and dependencies:

1. **Add a New Client** - The foundational action; must be able to create clients
2. **View All Clients** - Once clients exist, need to see them
3. **View Client Details** - Natural progression from list to details
4. **Update Client Information** - Modify existing client data
5. **Change Client Status** - Special case of updating that reflects business relationship changes
6. **Filter Clients by Status** - More advanced querying once multiple clients exist

Each use case delivers independent business value and describes user goals in business terms without technical implementation details.

## Completed Use Cases

- **Use Case 1: Add a New Client** - Completed 2025-11-01 (See IMPLEMENTED_CASES.md)
- **Use Case 7: Start Development Environment** - Completed 2025-11-01 (See IMPLEMENTED_CASES.md)
