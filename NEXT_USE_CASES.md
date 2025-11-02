# Use Cases: Client Management

## Use Case 1: Add a New Client to the System

**Primary Actor**: Developer/User

**Goal**: Record a new client in the CRM system so that their information can be tracked and managed

**Preconditions**:
- User has access to the CRM system
- User has information about a client to record

**Main Success Scenario**:
1. User navigates to the client creation interface
2. System displays a form for client information
3. User enters client's company/individual name
4. User optionally enters contact details (email, phone)
5. User optionally enters client's address
6. User selects client status (Active, Inactive, Prospect, or Past Client)
7. User optionally adds notes about the client
8. User submits the client information
9. System validates the provided information
10. System saves the client information
11. System displays confirmation with the new client's details
12. System provides option to view the newly created client

**Extensions**:
- 3a. If user does not provide a name:
  - 3a1. System displays error message indicating name is required
  - 3a2. System highlights the name field
  - 3a3. User provides name and continues
- 4a. If user provides email in invalid format:
  - 4a1. System displays error message indicating valid email format required
  - 4a2. User corrects email format or removes it
  - 4a3. User continues
- 6a. If user does not select a status:
  - 6a1. System defaults to "Prospect" status
- 9a. If validation fails:
  - 9a1. System displays specific validation errors
  - 9a2. User corrects the errors
  - 9a3. User resubmits
- 10a. If system fails to save:
  - 10a1. System displays error notification
  - 10a2. System retains the form data
  - 10a3. User can retry submission

**Success Guarantee**:
- Client record is created in the system
- Client information is stored and can be retrieved
- User is informed of successful creation
- System is ready to accept additional client operations

---

## Use Case 2: Set Initial Client Status

**Primary Actor**: Developer/User

**Goal**: Categorize a new client according to their relationship stage with the business

**Preconditions**:
- User is in the process of adding a new client

**Main Success Scenario**:
1. User reviews available client statuses (Active, Inactive, Prospect, Past Client)
2. User selects the status that best represents the client's current relationship
3. System records the selected status with the client information

**Extensions**:
- 2a. If user is unsure which status to select:
  - 2a1. System provides default "Prospect" status
  - 2a2. Status can be changed later if needed

**Success Guarantee**:
- Client has an appropriate status assigned
- Status accurately reflects the client's relationship stage

---

## Use Case 3: Provide Client Contact Information

**Primary Actor**: Developer/User

**Goal**: Record how to reach the client for future communication

**Preconditions**:
- User is adding a new client
- User has contact information available

**Main Success Scenario**:
1. User enters client's email address
2. System validates email format
3. User enters client's phone number
4. User enters client's physical address
5. System saves all contact information with the client record

**Extensions**:
- 1a. If user does not have email:
  - 1a1. User leaves email field empty
  - 1a2. System accepts client without email
- 2a. If email format is invalid:
  - 2a1. System alerts user to format error
  - 2a2. User corrects email or removes it
- 3a. If user does not have phone number:
  - 3a1. User leaves phone field empty
  - 3a2. System accepts client without phone
- 4a. If user does not have address:
  - 4a1. User leaves address field empty
  - 4a2. System accepts client without address

**Success Guarantee**:
- Valid contact information is stored with client record
- User can retrieve contact information for future use

---

## Use Case 4: Add Notes About a Client

**Primary Actor**: Developer/User

**Goal**: Record contextual information, preferences, or special considerations about the client

**Preconditions**:
- User is adding a new client
- User has additional information to record that doesn't fit standard fields

**Main Success Scenario**:
1. User enters notes in free-text field
2. User includes relevant details about the client relationship, preferences, or history
3. System saves notes with the client record

**Extensions**:
- 1a. If user has no additional notes:
  - 1a1. User leaves notes field empty
  - 1a2. System accepts client without notes

**Success Guarantee**:
- Notes are stored with client record
- Notes are available for future reference when working with the client

---

## Use Case 5: Receive Confirmation of Client Creation

**Primary Actor**: Developer/User

**Goal**: Verify that the client was successfully added to the system

**Preconditions**:
- User has submitted client information
- System has successfully saved the client

**Main Success Scenario**:
1. System completes saving client information
2. System displays success notification to user
3. System shows the newly created client's details
4. System provides option to view full client record
5. System clears the creation form for adding another client if needed

**Extensions**:
- 1a. If save operation fails:
  - 1a1. System displays error notification with reason
  - 1a2. System preserves user's entered data
  - 1a3. User can correct issues and retry

**Success Guarantee**:
- User knows the operation completed successfully
- User can immediately access the new client record
- User can continue with next task (view client, add another client, etc.)
