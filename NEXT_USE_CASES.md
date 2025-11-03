# Use Cases for US-CLIENT-001: Complete Client Management CRUD Operations

## Use Case 2: Update Client Information

**Primary Actor**: Software Developer or Agency Owner

**Goal**: Modify existing client information to keep records accurate and current as business relationships evolve

**Preconditions**:
- User has access to the application
- User is authenticated
- The client record exists in the system

**Main Success Scenario**:
1. User views a specific client's details
2. User initiates the action to edit the client
3. System presents a form with the current client information
4. User modifies one or more fields (company name, contact details, notes, or status)
5. User submits the updated information
6. System validates the changes
7. System records the changes to the client
8. System confirms the update was successful
9. User sees the updated information in the client detail view

**Extensions**:
- 6a. If new company name already exists for a different client:
  - System shows error that company name must be unique
  - User modifies the company name or cancels
  - Resume at step 5
- 6b. If contact information format is invalid:
  - System shows validation error for specific fields
  - User corrects the information
  - Resume at step 5
- 4a. User changes status from Prospect to Active:
  - System records the status change
  - Continue with step 5
- 4b. User changes status to "Past Client":
  - System records the status change
  - All associated projects and data remain intact
  - Continue with step 5

**Success Guarantee**: The client record reflects the updated information. All changes are preserved with a complete history of what changed and when.

---

## Use Case 3: Find Clients by Status or Type

**Primary Actor**: Software Developer or Agency Owner

**Goal**: Locate specific clients based on their current status or type to focus on relevant business relationships

**Preconditions**:
- User has access to the application
- User is authenticated

**Main Success Scenario**:
1. User navigates to the clients list
2. System displays all clients
3. User selects a status filter (Active, Inactive, Prospect, or Past Client)
4. System updates the list to show only clients matching that status
5. User sees filtered results with relevant clients

**Extensions**:
- 3a. User selects a client type filter (Company or Individual) instead:
  - System updates the list to show only that type
  - Continue with step 5
- 3b. User selects both status and type filters:
  - System shows only clients matching both criteria
  - Continue with step 5
- 3c. User clears filters:
  - System displays all clients again
  - Continue with step 5
- 4a. If no clients match the filter criteria:
  - System displays message indicating no matching clients
  - User can adjust filters or add new clients

**Success Guarantee**: User sees only the clients that match their selected criteria, allowing them to focus on the relevant subset of their client base.

---

## Use Case 4: Search for a Client by Name

**Primary Actor**: Software Developer or Agency Owner

**Goal**: Quickly locate a specific client by searching for their company name

**Preconditions**:
- User has access to the application
- User is authenticated
- Clients exist in the system

**Main Success Scenario**:
1. User navigates to the clients list
2. User enters part of a client's company name in the search field
3. System filters the list to show clients whose names contain the search text
4. User sees matching clients
5. User selects the desired client from the filtered list

**Extensions**:
- 3a. If no clients match the search text:
  - System displays message indicating no matching clients
  - User can modify search or clear it to see all clients
- 2a. User enters search text while filters are also active:
  - System shows clients matching both the search and filters
  - Continue with step 4

**Success Guarantee**: User finds the client they're looking for and can view or edit that client's information.

---

## Use Case 6: Track Client Lifecycle with Status Changes

**Primary Actor**: Software Developer or Agency Owner

**Goal**: Mark a client's current stage in the business relationship lifecycle to organize and prioritize client interactions

**Preconditions**:
- User has access to the application
- User is authenticated
- The client exists in the system

**Main Success Scenario**:
1. User views a client's details
2. User initiates editing the client
3. User changes the client status (e.g., from "Prospect" to "Active", or from "Active" to "Past Client")
4. User submits the changes
5. System records the status change with timestamp
6. System confirms the update
7. User sees the updated status with appropriate visual indicator

**Extensions**:
- 3a. User marks active client as "Past Client" after project completion:
  - System updates status
  - All historical data and projects remain accessible
  - Continue with step 4
- 3b. User changes "Inactive" client back to "Active" when relationship resumes:
  - System updates status
  - Continue with step 4
- 7a. User filters client list by new status:
  - Client appears in the correct filtered view

**Success Guarantee**: The client's status accurately reflects the current business relationship stage. Complete history of status changes is preserved for future reference.

---

## Use Case 7: Maintain Client Notes for Context

**Primary Actor**: Software Developer or Agency Owner

**Goal**: Add or update notes about a client to maintain context about the business relationship, preferences, or important details

**Preconditions**:
- User has access to the application
- User is authenticated
- The client exists in the system

**Main Success Scenario**:
1. User views a client's details
2. User initiates editing the client
3. User adds or modifies notes in the notes field (e.g., "Prefers email communication", "Budget-conscious", "Annual contract renewal in July")
4. User submits the changes
5. System saves the notes
6. System confirms the update
7. User sees the updated notes in the client detail view

**Extensions**:
- 3a. User enters notes exceeding character limit:
  - System shows validation error with character count
  - User shortens the notes
  - Resume at step 4
- 7a. User later reviews notes before contacting client:
  - Notes provide helpful context for interaction

**Success Guarantee**: Notes are saved and available whenever the user views the client, providing valuable context for managing the business relationship.

---

## Business Rules

**BR-CLIENT-001**: Company name is required and must be unique across all clients
**BR-CLIENT-002**: Client type must be either "Company" or "Individual"
**BR-CLIENT-003**: New clients automatically start with "Prospect" status
**BR-CLIENT-004**: All contact fields (email, phone, address, website) are optional but recommended
**BR-CLIENT-005**: Email must be valid email format when provided
**BR-CLIENT-006**: Phone must be valid phone format when provided
**BR-CLIENT-007**: Website must be valid URL format when provided
**BR-CLIENT-008**: Notes can contain up to 5000 characters
**BR-CLIENT-009**: Status can be changed to any valid status (Active, Inactive, Prospect, Past Client)
**BR-CLIENT-010**: Changing status to "Past Client" does not delete or hide associated data
**BR-CLIENT-011**: Company name can be changed if the new name is unique
**BR-CLIENT-012**: All changes to client information are tracked with complete history

---

## Use Case Dependencies

```
Use Case 1 (Add Client) → Foundation for all other use cases
  ↓
Use Case 5 (View Client) → Enables viewing what was created
  ↓
Use Case 2 (Update Client) → Requires existing client
  ↓
Use Case 6 (Status Changes) → Special case of updating client
Use Case 7 (Maintain Notes) → Special case of updating client
  ↓
Use Case 3 (Filter by Status/Type) → More useful with multiple clients
Use Case 4 (Search by Name) → More useful with multiple clients
```

---

## Notes

These use cases focus on the **business goals** and **user interactions** without specifying technical implementation details. They describe:

- **What** users want to accomplish (business goals)
- **How** users interact with the system (business actions)
- **What** the system does in response (business outcomes)
- **Why** these capabilities matter (business value)

They deliberately avoid technical terms like:
- API endpoints
- Database schemas
- Event sourcing mechanics
- CQRS handlers
- Component architecture

These technical details belong in the implementation phase and will follow the patterns defined in CLAUDE.md.
