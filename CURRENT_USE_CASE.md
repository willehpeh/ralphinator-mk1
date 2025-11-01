# Current Use Case: Add a New Client

**Primary Actor**: Developer/Business User

**Goal**: Record a new client company in the system to begin tracking their information

**Preconditions**:
- User has access to the client management system
- Client does not already exist in the system

**Main Success Scenario**:
1. User navigates to add new client
2. System presents empty client form
3. User enters client company name
4. User enters client contact information (email, phone)
5. User enters client address
6. User selects client status (Active, Inactive, Prospect, Past Client)
7. User enters any notes about the client
8. User submits the client information
9. System validates all required information
10. System saves the client
11. System displays confirmation message with client details
12. System shows the new client in the client list

**Extensions**:
- 9a. If required information is missing:
  - System displays validation errors
  - System highlights missing fields
  - User corrects information and resubmits
- 9b. If email format is invalid:
  - System displays email validation error
  - User corrects email and resubmits
- 9c. If client with same name already exists:
  - System displays warning
  - User decides whether to proceed or cancel

**Success Guarantee**: Client is recorded in the system and can be retrieved and viewed

---

## Implementation Status

**Selected**: 2025-11-01
**Status**: Not Started
**Documentation**: UC1_ADD_NEW_CLIENT.md
