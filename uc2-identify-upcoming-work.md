# Task Documentation: UC2 - Identify Upcoming Work

**Use Case**: Identify Upcoming Work
**User Story**: US-DASHBOARD-001
**Acceptance Criteria**: AC2 - Upcoming Tasks Section

## Implementation Progress

### Completed Tasks

1.  **Create GetUpcomingTasksQuery**
   - Created query class implementing IQuery interface
   - Query accepts optional limit parameter (defaults to 10)
   - Will retrieve next 10 non-completed tasks sorted by due date (earliest first)
   - Location: `packages/application/src/lib/queries/get-upcoming-tasks.query.ts`
   - Exported from application module
   - Commit: (current)

### Pending Tasks

2. ó Create GetUpcomingTasksQueryHandler
3. ó Register query handler in DashboardModule
4. ó Add GET /api/dashboard/tasks/upcoming endpoint in DashboardController
5. ó Write tests for GetUpcomingTasksQueryHandler
6. ó Create dashboard NGRX actions for upcoming tasks
7. ó Update dashboard effects to load upcoming tasks
8. ó Update dashboard reducer to store upcoming tasks
9. ó Update dashboard selectors to select upcoming tasks
10. ó Create UpcomingTasksComponent
11. ó Add UpcomingTasksComponent to DashboardPageComponent
12. ó Write component tests

## Technical Notes

- Following AC2 requirements: List next 10 incomplete tasks sorted by due date (earliest first)
- Will show: title, priority badge, due date, project/client name
- Visual indicator for overdue tasks (past due date)
- "View All Tasks" link to navigate to full task list
- Will reuse existing TaskReadModel

## Files Created

- `packages/application/src/lib/queries/get-upcoming-tasks.query.ts`

## Files Modified

- `packages/application/src/lib/application.ts` (added query export)

## Next Steps

Next: Create GetUpcomingTasksQueryHandler to implement the query logic.
