# Use Cases: Client Management

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

