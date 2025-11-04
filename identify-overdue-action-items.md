# Task Documentation: Identify Overdue Action Items

**Use Case**: UC-TASK-001-09 - Identify Overdue Action Items
**Status**: In Progress
**Created**: 2025-11-04

## Overview

Implement functionality to quickly identify and highlight action items that have missed their deadlines and need immediate attention. This includes visual indicators, filtering, and potentially a dedicated view for overdue tasks.

## Tasks

### Completed

1. **Add "days overdue" calculation and display** (2025-11-04)
   - Added `daysOverdue()` method to calculate number of days past due date
   - Updated template to display "overdue by X day(s)" instead of just "OVERDUE"
   - Properly handles singular vs plural ("1 day" vs "X days")
   - File: `apps/frontend/src/app/tasks/task-list.component.ts`

## Implementation Notes

- Check existing overdue filter in TaskListComponent (Use Case 2)
- Verify isOverdue() logic exists and is accurate
- Add prominent visual indicators for overdue status
- Consider adding overdue task count to main navigation
- Sort overdue tasks by urgency (days overdue)

## Acceptance Criteria

- [x] User can view all overdue action items (via existing "Show Overdue Only" filter)
- [x] Overdue status is visually prominent (red badges, icons) (existing red text styling)
- [x] "Days overdue" is calculated and displayed accurately
- [ ] Completed and cancelled tasks are excluded from overdue list
- [x] User can navigate from overdue task to full task detail (existing "View Details" button)
- [ ] Empty state message when no tasks are overdue
- [ ] Overdue tasks sorted by urgency (most overdue first)

## Related Files

- Frontend: apps/frontend/src/app/tasks/task-list/task-list.component.ts
- Frontend: apps/frontend/src/app/tasks/task-detail/task-detail.component.ts
- Frontend: apps/frontend/src/app/tasks/constants/task-display.constants.ts

## Dependencies

- Use Case 2 (View All Tracked Action Items) - completed
- Use Case 3 (Review Details of a Specific Action Item) - completed
