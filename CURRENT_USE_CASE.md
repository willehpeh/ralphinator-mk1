# Current Use Case: UC2 - View All Tracked Action Items

## Use Case 2: View All Tracked Action Items

**Primary Actor**: Developer or Agency Owner

**Goal**: See all action items that need attention across all work

**Preconditions**: User has access to the task management system

**Main Success Scenario**:
1. User requests to see all action items
2. System displays all recorded action items with:
   - What needs to be done (title)
   - How urgent it is (priority with visual indicator)
   - Current state (status with visual indicator)
   - When it's due (deadline with alert if overdue)
   - Which client or project it relates to (if any)
3. User reviews the list of action items

**Extensions**:
- 3a. If user wants to focus on specific types of action items:
  - 3a1. User narrows the view by urgency level (priority)
  - 3a2. User narrows the view by current state (status)
  - 3a3. User narrows the view by client
  - 3a4. User narrows the view by project
  - 3a5. User narrows the view to show only overdue items
  - 3a6. User searches by keywords in the title
  - 3a7. System updates the display to show only matching action items
- 3b. If no action items exist:
  - 3b1. System displays message indicating no action items are tracked yet
  - 3b2. System offers option to record a new action item

**Success Guarantee**: User sees current status of all relevant action items

---

## Implementation Status
- **Selected**: 2025-11-04
- **Status**: Ready to implement
- **Documentation File**: view-all-action-items.md

## Dependencies
- Use Case 1 (Record a New Action Item) - COMPLETED

## Notes
This is the foundational "list view" use case. The filtering and search functionality mentioned in extensions 3a will be implemented as part of this use case since they are core to the viewing experience, not separate workflows.
