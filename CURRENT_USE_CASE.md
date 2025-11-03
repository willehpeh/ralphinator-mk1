# Use Case 5: Change Project Status Through Lifecycle

**Primary Actor**: Developer or Agency Owner

**Goal**: Update project status as work progresses through different lifecycle stages

**Preconditions**:
- User is viewing a project detail page
- Project is not deleted

**Main Success Scenario**:
1. User clicks "Change Status" action
2. System displays status options (Planning, Active, On Hold, Completed, Cancelled)
3. User selects new status
4. System validates the status change
5. User confirms the status change
6. System updates project status and records the change in history
7. System displays confirmation message with updated status badge

**Extensions**:
- 3a. User changes status to Completed: System prompts for actual end date if not already set
- 3b. User changes status to Cancelled: System prompts for actual end date and reason (optional)
- 4a. Status transition violates business rules: System displays validation message (if rules exist)
- 6a. Status change triggers workflow: System executes related business processes (future)

**Success Guarantee**: Project status accurately reflects current state and status change is recorded in history
