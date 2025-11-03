# Use Case 4: Update Client Information

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
