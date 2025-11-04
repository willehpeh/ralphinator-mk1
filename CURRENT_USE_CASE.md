# Current Use Case: Identify Overdue Action Items

**Use Case Number**: UC-TASK-001-09

**Primary Actor**: Developer or Agency Owner

**Goal**: Quickly identify all action items that have missed their deadlines and need immediate attention

**Preconditions**: User has access to the task management system

## Main Success Scenario

1. User requests to see overdue action items
2. System identifies all action items where:
   - Deadline has passed
   - Current state is To Do or In Progress (not Completed or Cancelled)
3. System displays overdue action items with:
   - What needs to be done (title)
   - How urgent it is (priority with visual indicator)
   - Current state (status with visual indicator)
   - How long overdue (e.g., "overdue by 3 days")
   - Which client or project it relates to (if any)
4. User reviews overdue items to prioritize immediate work
5. User can navigate to any action item for full details (Use Case 3)

## Extensions

**2a. If no action items are overdue:**
- 2a1. System displays message confirming all action items are on track

**3a. If user is viewing all action items (Use Case 2):**
- 3a1. System visually highlights overdue items in the list
- 3a2. System displays overdue alert with each overdue item

## Success Guarantee

User can identify and prioritize overdue work requiring immediate attention

## Notes

- This use case may be partially implemented via the existing "overdue" filter in Use Case 2
- The focus should be on making overdue items prominent and easy to identify
- Consider adding a dedicated "Overdue Tasks" route/view for quick access
- Overdue indicators should be visually distinct (red badges, warning icons)
- Date calculations should exclude completed and cancelled tasks

## Implementation Considerations

### Frontend Enhancements Needed
1. Dedicated "Overdue Tasks" page/route (optional)
2. Overdue task count badge/indicator in main navigation
3. Prominent overdue visual indicators in task list
4. "Days overdue" calculation and display
5. Sort overdue tasks by days overdue (most urgent first)

### Backend Query (if needed)
- GetOverdueTasksQuery (if not using client-side filtering)
- Query should filter: dueDate < today AND status IN ['Todo', 'InProgress']

### Verification
- Manually test with tasks having various due dates (past, today, future)
- Verify completed/cancelled tasks are excluded
- Verify overdue calculation accuracy
- Verify visual indicators are prominent
