# Use Cases: Client Management

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

