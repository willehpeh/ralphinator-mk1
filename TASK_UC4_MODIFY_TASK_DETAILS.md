# Task Tracking: UC4 - Modify Action Item Details

## Use Case
Use Case 4: Modify Action Item Details (from CURRENT_USE_CASE.md)

## Implementation Order
1. ✅ Domain: TaskDetailsUpdatedDomainEvent (Done - commit 5518b40)
2. ✅ Domain: TaskAggregate.updateDetails() method (Done - commit 3fe0557)
3. ✅ Application: UpdateTaskDetailsCommand (Done - commit 7575abc)
4. ✅ Application: UpdateTaskDetailsHandler (Done - commit 0a7502d)
5. ✅ Infrastructure: TaskProjection handler for TaskDetailsUpdatedDomainEvent (Done - commit d54641b)
6. ✅ Backend: PATCH /api/tasks/:id endpoint (Done - commit 798201e)
7. ⏳ Frontend: EditTaskPageComponent + NGRX state (Next)

## Completed Tasks

### Task 1: TaskDetailsUpdatedDomainEvent
**Commit**: 5518b40 - feat(domain): Add TaskDetailsUpdatedDomainEvent for task updates
**Files**:
- packages/domain/src/lib/events/task-details-updated.domain-event.ts
**Description**: Created domain event for task detail updates. This event stores TaskData value object and is used to rebuild the Task aggregate state. Note: This event is for updating task details (title, notes, priority, deadline, etc.) but NOT for changing the progress state (status).

### Task 2: TaskAggregate.updateDetails() method
**Commit**: 3fe0557 - feat(domain): Add updateDetails method to TaskAggregate
**Files**:
- packages/domain/src/lib/aggregates/task.aggregate.ts
- packages/domain/src/lib/constants/task-event-types.ts
**Description**: Added updateDetails() method to TaskAggregate that applies TaskDetailsUpdatedDomainEvent. Registered event handler (onTaskDetailsUpdated) that uses the helper method updateTaskFields() to update aggregate state from TaskData. Added TASK_EVENT_TYPES.DETAILS_UPDATED constant.

### Task 3: UpdateTaskDetailsCommand
**Commit**: 7575abc - feat(application): Add UpdateTaskDetailsCommand for task updates
**Files**:
- packages/application/src/lib/commands/update-task-details.command.ts
- packages/application/src/lib/application.ts (exports)
**Description**: Created UpdateTaskDetailsCommand following the established pattern from UpdateProjectDetailsCommand. This command accepts a task ID and TaskDataPayload to enable updating task details via CQRS.

### Task 4: UpdateTaskDetailsHandler
**Commit**: 0a7502d - feat(application): Add UpdateTaskDetailsHandler for task updates
**Files**:
- packages/application/src/lib/commands/handlers/update-task-details.handler.ts
- packages/application/src/lib/application.ts (exports)
**Description**: Created UpdateTaskDetailsHandler that extends BaseCommandHandler to load TaskAggregate, execute updateDetails() domain method, and persist events to event store. Follows the established pattern from UpdateProjectDetailsHandler. Handler uses TaskData.fromPayload() to convert command payload to value object.

### Task 5: TaskProjection handler for TaskDetailsUpdatedDomainEvent
**Commit**: d54641b - feat(infrastructure): Add TaskDetailsUpdatedDomainEvent handler to TaskProjection
**Files**:
- packages/infrastructure/src/lib/projections/task.projection.ts
**Description**: Updated TaskProjection to handle TaskDetailsUpdatedDomainEvent. Added event handler registration for TASK_EVENT_TYPES.DETAILS_UPDATED, created transformTaskDataToReadModel() helper method to eliminate duplication between create and update handlers, and implemented onTaskDetailsUpdated() method that uses updateReadModel() to update the read model while preserving the original createdAt timestamp. Follows the established pattern from ProjectProjection.

### Task 6: PATCH /api/tasks/:id endpoint
**Commit**: 798201e - feat(api): Add PATCH endpoint for updating task details
**Files**:
- apps/api/src/app/tasks/tasks.controller.ts
**Description**: Added PATCH /api/tasks/:id endpoint to TasksController that accepts UpdateTaskDto, creates UpdateTaskDetailsCommand, executes it via CommandBus, and returns the updated TaskReadModel using fetchEntityAfterMutation utility. Updated imports to include Patch decorator, UpdateTaskDetailsCommand, and UpdateTaskDto. Updated createTaskDataPayload() helper method to accept both CreateTaskDto and UpdateTaskDto. Follows the established pattern from ProjectsController.

## Next Task
Create frontend EditTaskPageComponent with NGRX state management

## Use Case Status
🔄 In Progress - Backend complete (domain, application, projection, API); need frontend
