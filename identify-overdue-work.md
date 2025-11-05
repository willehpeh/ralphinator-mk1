# UC3: Identify Overdue Work - Implementation Tasks

**Status**: In Progress
**Use Case**: Dashboard Overview - UC3: Identify Overdue Work
**Story**: US-DASHBOARD-001

## Overview

Implement the "Overdue Tasks" section of the dashboard that displays tasks past their due date requiring urgent attention.

## Completed Tasks

1. **Create GetOverdueTasksQuery**
   - Created query class implementing IQuery interface
   - Query retrieves all overdue tasks (due date in past, not completed)
   - Will return tasks sorted by due date (oldest first)
   - Location: `packages/application/src/lib/queries/get-overdue-tasks.query.ts`
   - Exported from application module
   - Commit: a90f09b

2. **Create GetOverdueTasksQueryHandler**
   - Implemented query handler extending TaskQueryHandler
   - Calls readRepository.findOverdue() method
   - Returns array of TaskReadModel sorted by due date (oldest first)
   - Follows CQRS pattern with proper error handling
   - Location: `packages/application/src/lib/queries/handlers/get-overdue-tasks.handler.ts`
   - Exported from application module
   - Commit: 1898ddf

3. **Add getOverdueTasks method to DashboardService**
   - Added service method to fetch overdue tasks from backend
   - HTTP GET to `/api/dashboard/tasks/overdue` endpoint
   - Returns Observable<TaskReadModel[]>
   - Location: `apps/frontend/src/app/dashboard/dashboard.service.ts`
   - Commit: 709a701

4. **Add NGRX actions for loading overdue tasks**
   - Created loadOverdueTasks action to trigger loading
   - Created loadOverdueTasksSuccess action with tasks payload
   - Created loadOverdueTasksFailure action with error payload
   - Follows same pattern as upcoming tasks actions
   - Location: `apps/frontend/src/app/dashboard/store/dashboard.actions.ts`
   - Commit: [pending]
