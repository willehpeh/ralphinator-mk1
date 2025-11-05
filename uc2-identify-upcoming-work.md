# Task Documentation: UC2 - Identify Upcoming Work

**Use Case**: Identify Upcoming Work
**User Story**: US-DASHBOARD-001
**Acceptance Criteria**: AC2 - Upcoming Tasks Section

## Implementation Progress

### Completed Tasks

1.  **Create GetUpcomingTasksQuery**
   - Created query class implementing IQuery interface
   - Query accepts optional limit parameter (defaults to 10)
   - Will retrieve next 10 non-completed tasks sorted by due date (earliest first)
   - Location: `packages/application/src/lib/queries/get-upcoming-tasks.query.ts`
   - Exported from application module
   - Commit: 6434ebd

2. **Create GetUpcomingTasksQueryHandler**
   - Created query handler implementing IQueryHandler interface
   - Handler uses TaskQueryHandler base class with ITaskReadRepository
   - Calls `readRepository.findUpcoming(query.limit)` to retrieve tasks
   - Added `findUpcoming` method to ITaskReadRepository interface
   - Implemented `findUpcoming` in InMemoryTaskReadRepository
   - Implementation filters out 'Completed' and 'Cancelled' tasks
   - Only returns tasks with deadlines
   - Sorts by deadline (earliest first)
   - Limits results to requested number
   - Location: `packages/application/src/lib/queries/handlers/get-upcoming-tasks.handler.ts`
   - Exported from application module
   - Commit: (current)

3. **Register GetUpcomingTasksQueryHandler in DashboardModule**
   - Added import for GetUpcomingTasksQueryHandler from application package
   - Added handler to QueryHandlers array in DashboardModule
   - Handler now registered with CQRS and will be available for dependency injection
   - Location: `apps/api/src/app/dashboard/dashboard.module.ts`
   - Commit: 4fd01e4

4. **Add GET /api/dashboard/tasks/upcoming endpoint in DashboardController**
   - Added import for GetUpcomingTasksQuery and TaskReadModel from application package
   - Created `getUpcomingTasks()` method decorated with `@Get('tasks/upcoming')`
   - Method creates GetUpcomingTasksQuery and executes via QueryBus
   - Returns Promise<TaskReadModel[]> with upcoming tasks
   - Endpoint: GET /api/dashboard/tasks/upcoming
   - Location: `apps/api/src/app/dashboard/dashboard.controller.ts`
   - Commit: (current)

### Pending Tasks

5. ⬜ Write tests for GetUpcomingTasksQueryHandler
6. ⬜ Create dashboard NGRX actions for upcoming tasks
7. ⬜ Update dashboard effects to load upcoming tasks
8. ⬜ Update dashboard reducer to store upcoming tasks
9. ⬜ Update dashboard selectors to select upcoming tasks
10. ⬜ Create UpcomingTasksComponent
11. ⬜ Add UpcomingTasksComponent to DashboardPageComponent
12. ⬜ Write component tests

## Technical Notes

- Following AC2 requirements: List next 10 incomplete tasks sorted by due date (earliest first)
- Will show: title, priority badge, due date, project/client name
- Visual indicator for overdue tasks (past due date)
- "View All Tasks" link to navigate to full task list
- Will reuse existing TaskReadModel

## Files Created

- `packages/application/src/lib/queries/get-upcoming-tasks.query.ts`
- `packages/application/src/lib/queries/handlers/get-upcoming-tasks.handler.ts`

## Files Modified

- `packages/application/src/lib/application.ts` (added query and handler exports)
- `packages/application/src/lib/ports/task-read-repository.interface.ts` (added findUpcoming method)
- `packages/infrastructure/src/lib/read-models/in-memory-task-read-repository.ts` (implemented findUpcoming)
- `apps/api/src/app/dashboard/dashboard.module.ts` (registered GetUpcomingTasksQueryHandler)
- `apps/api/src/app/dashboard/dashboard.controller.ts` (added GET /api/dashboard/tasks/upcoming endpoint)

## Next Steps

Next: Write tests for GetUpcomingTasksQueryHandler
