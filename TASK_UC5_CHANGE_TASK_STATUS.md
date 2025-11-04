# Task Tracking: UC5 - Update Action Item Progress (Change Task Status)

**Status**: In Progress
**Started**: 2025-11-04

---

## Overview

Implementation tracking for Use Case 5: Update Action Item Progress
This use case allows users to change the status of a task (To Do, In Progress, Completed, or Cancelled).

---

## Use Case Mapping

From CURRENT_USE_CASE.md:
- **Domain Layer**: `TaskAggregate.changeStatus()` method ✅ (Already exists)
- **Domain Layer**: `TaskStatusChangedDomainEvent` ✅ (Already exists)
- **Application Layer**: `ChangeTaskStatusCommand` ✅ (Already exists)
- **Application Layer**: `ChangeTaskStatusHandler` ✅ (Already exists)
- **API Endpoint**: `PATCH /api/tasks/:id/status` ❌ (Not yet created)
- **Frontend**: Status change UI component ❌ (Not yet created)
- **Frontend**: NGRX actions/effects/reducer ❌ (Not yet created)

---

## Completed Tasks

### ✅ Pre-existing: TaskAggregate.changeStatus() method
**File**: `packages/domain/src/lib/aggregates/task.aggregate.ts`
**Description**: Domain logic for changing task status. Automatically records completedAt timestamp when status becomes 'Completed'.

### ✅ Pre-existing: TaskStatusChangedDomainEvent
**File**: `packages/domain/src/lib/events/task-status-changed.domain-event.ts`
**Description**: Domain event representing a task status change with newStatus and completedAt fields.

### ✅ Pre-existing: ChangeTaskStatusCommand
**File**: `packages/application/src/lib/commands/change-task-status.command.ts`
**Description**: CQRS command with taskId and newStatus parameters.

### ✅ Pre-existing: ChangeTaskStatusHandler
**File**: `packages/application/src/lib/commands/handlers/change-task-status.handler.ts`
**Description**: Command handler that loads aggregate, changes status, and persists events.

---

---

## Implementation Progress

### ✅ Task 1: Add TaskStatusChangedDomainEvent handler to TaskProjection
**Completed**: 2025-11-04
**Commit**: 7565ef1
**File**: `packages/infrastructure/src/lib/projections/task.projection.ts`
**Description**:
- Added TaskStatusChangedDomainEvent to imports
- Registered event in @EventsHandler decorator
- Added TASK_EVENT_TYPES.STATUS_CHANGED to event handler registry
- Implemented onTaskStatusChanged() handler that updates only the status field in the read model
- Handler preserves all other fields (title, priority, notes, deadline, clientId, projectId, createdAt)
- Follows same pattern as ClientProjection status change handler

### ✅ Task 2: Register ChangeTaskStatusHandler in TasksModule
**Completed**: 2025-11-04
**Commit**: 90fffe2
**File**: `apps/api/src/app/tasks/tasks.module.ts`
**Description**:
- Imported ChangeTaskStatusHandler from @angular-nest-starter/application
- Added handler to CommandHandlers array
- Handler is now registered as a provider via spread operator
- Follows same pattern as CreateTaskHandler in the module
- Build verified successfully

---

### ✅ Task 3: Add PATCH /api/tasks/:id/status endpoint
**Completed**: 2025-11-04
**Commit**: 0e7ff3e
**Files**:
- `packages/shared-types/src/lib/dtos/task.dtos.ts` - Created ChangeTaskStatusDto
- `apps/api/src/app/tasks/tasks.controller.ts` - Added PATCH endpoint

**Description**:
- Created `ChangeTaskStatusDto` with single status field
- Imported ChangeTaskStatusCommand from application package
- Added `@Patch(':id/status')` endpoint in TasksController
- Endpoint accepts task ID and ChangeTaskStatusDto
- Executes ChangeTaskStatusCommand via command bus
- Returns updated TaskReadModel using fetchEntityAfterMutation helper
- Follows REST conventions: PATCH for partial updates
- Follows same pattern as ClientsController status change endpoint
- Build verified successfully

### ✅ Task 4: Add changeTaskStatus actions to NGRX store
**Completed**: 2025-11-04
**Commit**: 58e0fc9
**File**: `apps/frontend/src/app/tasks/store/tasks.actions.ts`
**Description**:
- Imported TaskStatus type from @angular-nest-starter/shared-types
- Created `changeTaskStatus` action with id and status parameters
- Created `changeTaskStatusSuccess` action with task parameter
- Created `changeTaskStatusFailure` action with error parameter
- Actions follow NGRX naming convention: `[Tasks] {Action Name}`
- Follows same pattern as updateTask actions
- Build verified successfully

### ✅ Task 5: Add changeTaskStatus method to TasksService
**Completed**: 2025-11-04
**Commit**: d510345
**File**: `apps/frontend/src/app/tasks/tasks.service.ts`
**Description**:
- Imported ChangeTaskStatusDto from @angular-nest-starter/shared-types
- Added changeTaskStatus method that accepts id and dto parameters
- Method uses HTTP PATCH to `/api/tasks/:id/status` endpoint
- Returns Observable<Task> with updated task data
- Follows same pattern as updateTask method
- Build verified successfully

---

### ✅ Task 6: Add changeTaskStatus effect to TasksEffects
**Completed**: 2025-11-04
**Commit**: 4e68615
**File**: `apps/frontend/src/app/tasks/store/tasks.effects.ts`
**Description**:
- Imported changeTaskStatus, changeTaskStatusSuccess, changeTaskStatusFailure actions
- Created changeTaskStatus$ effect
- Listens for changeTaskStatus action
- Calls TasksService.changeTaskStatus() method with id and status
- Maps successful response to changeTaskStatusSuccess action
- Catches errors and dispatches changeTaskStatusFailure action
- Follows NGRX effects pattern with switchMap operator
- Uses handleError helper for consistent error handling
- Build verified successfully

---

### ✅ Task 7: Add changeTaskStatus reducer handlers
**Completed**: 2025-11-04
**Commit**: 21bc3ec
**File**: `apps/frontend/src/app/tasks/store/tasks.reducer.ts`
**Description**:
- Imported changeTaskStatus, changeTaskStatusSuccess, changeTaskStatusFailure actions
- Added handler for changeTaskStatus action (sets loading state)
- Added handler for changeTaskStatusSuccess action (updates task in array)
- Added handler for changeTaskStatusFailure action (sets error state)
- Follows same pattern as updateTask reducer handlers
- Uses helper functions: setLoading, clearLoadingAndError, setError
- Build verified successfully

---

### ✅ Task 8: Create status change UI component
**Completed**: 2025-11-04
**Commit**: 156196e
**File**: `apps/frontend/src/app/tasks/components/task-status-change.component.ts`
**Description**:
- Created TaskStatusChangeComponent with modern Angular patterns (standalone, signals, OnPush)
- Status dropdown populated from TASK_STATUSES constant (Todo, InProgress, Completed, Cancelled)
- Two-way binding using FormsModule and [(ngModel)]
- Warning message displays when selected status equals current status
- Submit button disabled when selected status equals current status
- Output events: statusChanged emits TaskStatus, cancelled emits void
- Input: currentStatus as required signal
- Effect used to initialize selectedStatus from currentStatus signal
- Professional styling with form controls, buttons, and warning message
- Button group with Cancel (gray) and Change Status (blue) buttons
- Follows design system from existing components (colors, spacing, transitions)
- Build verified successfully

---

## Next Tasks (Remaining)

### Task 9: Integrate status change UI into task detail view
**Status**: Pending
**Description**: Add "Change Status" button and wire up the status change component.

### Task 10: (Optional) Add success notification
**Status**: Optional
**Description**: Display toast/snackbar notification on successful status change.

---

## Implementation Notes

### Business Rules
- Status transitions should be logical (Todo → In Progress → Completed)
- When status changes to Completed, system automatically records completion date
- Cancelled tasks retain their due date but are no longer considered for overdue checks
- Quick complete action immediately sets status to Completed without showing status dialog

### Frontend Requirements
- Status badge with color coding (matching existing design system)
- Quick complete button for one-click Todo/InProgress → Completed transition
- Status change dialog for full status selection
- Professional, modern UI consistent with existing components

---

## Use Case Status

**Status**: In Progress

Core backend functionality exists:
- ✅ Domain layer complete
- ✅ Application layer complete
- ⏳ Infrastructure layer: Projection needs update
- ❌ API layer: Endpoint not created
- ❌ Frontend: Not started
