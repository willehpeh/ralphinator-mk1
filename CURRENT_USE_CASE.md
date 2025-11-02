# Current Use Case: UC5 - Change Client Status

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

## Status: IN PROGRESS

**Started**: 2025-11-02
