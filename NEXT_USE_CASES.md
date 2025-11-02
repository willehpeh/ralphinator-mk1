# Use Cases: Client Management

## Use Case 1: Add a New Client to the System

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

---

## Use Case 2: View Client Details

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

---

## Use Case 3: Track Client Status Throughout Relationship Lifecycle

**Primary Actor**: CRM User (Sales Rep, Account Manager)

**Goal**: Understand where a client is in their relationship with the company by viewing their status.

**Preconditions**:
- Client exists in the system
- Client has a status assigned

**Main Success Scenario**:
1. User views client information
2. System displays current client status (Prospect, Active, Inactive, or Past Client)
3. User understands the current stage of the client relationship
4. User can make informed decisions about next actions with this client

**Extensions** (alternative flows):
- 2a. Client is marked as "Prospect":
  - 2a1. User understands this is a potential client not yet under contract
- 2b. Client is marked as "Active":
  - 2b1. User understands this client has ongoing projects or relationships
- 2c. Client is marked as "Inactive":
  - 2c1. User understands this client has no current active engagement
- 2d. Client is marked as "Past Client":
  - 2d1. User understands this client has completed their relationship

**Success Guarantee**:
- User understands the current state of the client relationship
- User can take appropriate next steps based on client status

---

## Use Case 4: Record Additional Context About a Client

**Primary Actor**: CRM User (any role)

**Goal**: Capture important contextual information or observations about a client for future reference.

**Preconditions**:
- User is adding or viewing a client

**Main Success Scenario**:
1. User navigates to the client notes field
2. User enters relevant observations, preferences, or contextual information about the client
3. System accepts and stores the notes with the client record
4. User confirms the notes are saved
5. Notes are available for future reference by any user viewing the client

**Extensions** (alternative flows):
- 2a. User leaves notes field empty:
  - 2a1. System accepts the client without notes (notes are optional)
- 3a. Notes exceed reasonable length:
  - 3a1. System stores complete notes without truncation

**Success Guarantee**:
- Client notes are permanently associated with the client record
- Notes are available for retrieval whenever client details are viewed
- Team members can access shared context about the client

---

## Use Case 5: Maintain Client Contact Information

**Primary Actor**: CRM User

**Goal**: Ensure the system has current contact methods for reaching the client when needed.

**Preconditions**:
- User is adding a new client or viewing an existing client

**Main Success Scenario**:
1. User has client contact information available
2. User enters client email address in the appropriate field
3. User enters client phone number in the appropriate field
4. System validates the email format is correct
5. System stores the contact information with the client record
6. Contact information is available for future communication needs

**Extensions** (alternative flows):
- 1a. User does not have contact information available:
  - 1a1. User proceeds without entering contact details (both are optional)
  - 1a2. Client is created without contact information
  - 1a3. Contact information can be added later when available
- 4a. Email format is invalid:
  - 4a1. System notifies user of format error
  - 4a2. User corrects the email format
  - 4a3. Returns to step 4
- 2a-3a. User has only email OR only phone:
  - 2a-3a1. User enters available contact method
  - 2a-3a2. System accepts partial contact information

**Success Guarantee**:
- Valid contact information is stored with the client record
- Contact information is available for future communication
- System maintains data quality by validating email formats
