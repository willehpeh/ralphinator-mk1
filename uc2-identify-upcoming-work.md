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
   - Commit: 16cd1ae

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
   - Commit: bf2dbfe

5. **Write tests for GetUpcomingTasksQueryHandler**
   - Created comprehensive test suite with 10 test cases
   - Tests verify: sorting by due date, default limit, custom limit, empty results
   - Tests verify: only tasks with deadlines, excluding completed/cancelled tasks
   - Tests verify: including overdue tasks, error handling, edge cases
   - All tests pass successfully
   - Location: `packages/testing/src/tests/get-upcoming-tasks.handler.spec.ts`
   - Commit: 19c68d0

6. **Create dashboard NGRX actions for upcoming tasks**
   - Added three actions following existing pattern: loadUpcomingTasks, loadUpcomingTasksSuccess, loadUpcomingTasksFailure
   - Added import for TaskReadModel from application package
   - loadUpcomingTasks: Triggers loading of upcoming tasks from backend
   - loadUpcomingTasksSuccess: Receives array of TaskReadModel on successful load
   - loadUpcomingTasksFailure: Receives error string on failure
   - Location: `apps/frontend/src/app/dashboard/store/dashboard.actions.ts`
   - Commit: 8ea0820

7. ✅ **Update dashboard effects to load upcoming tasks**
   - Added `getUpcomingTasks()` method to DashboardService
   - Method calls `GET /api/dashboard/tasks/upcoming` endpoint
   - Added `loadUpcomingTasks$` effect to DashboardEffects
   - Effect listens for `loadUpcomingTasks` action
   - Effect calls `dashboardService.getUpcomingTasks()` via switchMap
   - On success: dispatches `loadUpcomingTasksSuccess` with tasks array
   - On error: dispatches `loadUpcomingTasksFailure` with error message
   - Uses shared `createEffectErrorHandler` utility for error handling
   - Updated imports in actions to use `@angular-nest-starter/shared-types` (scope-compliant)
   - Locations:
     - `apps/frontend/src/app/dashboard/dashboard.service.ts`
     - `apps/frontend/src/app/dashboard/store/dashboard.effects.ts`
     - `apps/frontend/src/app/dashboard/store/dashboard.actions.ts`
   - Commit: 5105664

8. ✅ **Update dashboard reducer to store upcoming tasks**
   - Added `upcomingTasks: TaskReadModel[]` to DashboardState interface
   - Imported TaskReadModel from `@angular-nest-starter/shared-types`
   - Updated initialState to include `upcomingTasks: []`
   - Added reducer handlers for loadUpcomingTasks, loadUpcomingTasksSuccess, loadUpcomingTasksFailure
   - loadUpcomingTasks: Sets loading state using shared setLoading helper
   - loadUpcomingTasksSuccess: Clears loading/error, stores tasks array
   - loadUpcomingTasksFailure: Sets error state using shared setError helper
   - Location: `apps/frontend/src/app/dashboard/store/dashboard.reducer.ts`
   - Commit: [PENDING]

### Pending Tasks
9.  ⬜ Update dashboard selectors to select upcoming tasks
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
- `packages/testing/src/tests/get-upcoming-tasks.handler.spec.ts`

## Files Modified

- `packages/application/src/lib/application.ts` (added query and handler exports)
- `packages/application/src/lib/ports/task-read-repository.interface.ts` (added findUpcoming method)
- `packages/infrastructure/src/lib/read-models/in-memory-task-read-repository.ts` (implemented findUpcoming)
- `apps/api/src/app/dashboard/dashboard.module.ts` (registered GetUpcomingTasksQueryHandler)
- `apps/api/src/app/dashboard/dashboard.controller.ts` (added GET /api/dashboard/tasks/upcoming endpoint)
- `apps/frontend/src/app/dashboard/dashboard.service.ts` (added getUpcomingTasks method)
- `apps/frontend/src/app/dashboard/store/dashboard.effects.ts` (added loadUpcomingTasks$ effect)
- `apps/frontend/src/app/dashboard/store/dashboard.actions.ts` (updated imports to use shared-types)
- `apps/frontend/src/app/dashboard/store/dashboard.reducer.ts` (added upcomingTasks state and handlers)

## Next Steps

Next: Update dashboard selectors to select upcoming tasks
