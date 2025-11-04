# Task Documentation: Identify Overdue Action Items

**Use Case**: UC-TASK-001-09 - Identify Overdue Action Items
**Status**: Complete
**Created**: 2025-11-04
**Completed**: 2025-11-04

## Overview

Implement functionality to quickly identify and highlight action items that have missed their deadlines and need immediate attention. This includes visual indicators, filtering, and potentially a dedicated view for overdue tasks.

## Tasks

### Completed

1. **Add "days overdue" calculation and display** (2025-11-04)
   - Added `daysOverdue()` method to calculate number of days past due date
   - Updated template to display "overdue by X day(s)" instead of just "OVERDUE"
   - Properly handles singular vs plural ("1 day" vs "X days")
   - File: `apps/frontend/src/app/tasks/task-list.component.ts`

2. **Exclude completed and cancelled tasks from overdue filter** (2025-11-04)
   - Updated overdueOnly filter logic to exclude tasks with status 'Completed' or 'Cancelled'
   - Ensures only actionable tasks (Todo, InProgress) appear when "Show Overdue Only" is checked
   - File: `apps/frontend/src/app/tasks/task-list.component.ts` (lines 644-650)

3. **Add context-aware empty state message for overdue filter** (2025-11-04)
   - Added NO_OVERDUE_TASKS and NO_OVERDUE_TASKS_DESCRIPTION constants to TASK_UI_TEXT
   - Updated empty state template to show positive message when overdue filter is active but no tasks match
   - Shows "All tasks are on track!" and "There are no overdue action items. Keep up the great work!" when no overdue tasks
   - Generic empty state with "Add Task" button still shown when no overdue filter is active
   - Files: `apps/frontend/src/app/tasks/task-display.constants.ts`, `apps/frontend/src/app/tasks/task-list.component.ts` (lines 188-201)

4. **Sort overdue tasks by urgency (days overdue)** (2025-11-04)
   - Added sorting logic to filteredTasks computed property
   - When overdue filter is active, tasks are sorted by daysOverdue() in descending order
   - Most urgent (most overdue) tasks appear first in the list
   - File: `apps/frontend/src/app/tasks/task-list.component.ts` (lines 664-671)

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
- [x] Completed and cancelled tasks are excluded from overdue list
- [x] User can navigate from overdue task to full task detail (existing "View Details" button)
- [x] Empty state message when no tasks are overdue (positive confirmation message)
- [x] Overdue tasks sorted by urgency (most overdue first)

## Related Files

- Frontend: apps/frontend/src/app/tasks/task-list/task-list.component.ts
- Frontend: apps/frontend/src/app/tasks/task-detail/task-detail.component.ts
- Frontend: apps/frontend/src/app/tasks/constants/task-display.constants.ts

## Dependencies

- Use Case 2 (View All Tracked Action Items) - completed
- Use Case 3 (Review Details of a Specific Action Item) - completed
