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

### Task 7: Add NGRX actions for updating task
**Commit**: fb611d5 - feat(frontend): Add NGRX actions for updating task details
**Files**:
- apps/frontend/src/app/tasks/store/tasks.actions.ts
**Description**: Added three NGRX actions for task update flow: updateTask (triggers update with id and UpdateTaskInput), updateTaskSuccess (handles successful update with updated Task), and updateTaskFailure (handles errors with error message). Updated imports to include UpdateTaskInput type. Follows the established pattern from createTask actions.

### Task 8: Add updateTask method to TasksService
**Commit**: 009f218 - feat(frontend): Add updateTask method to TasksService
**Files**:
- apps/frontend/src/app/tasks/tasks.service.ts
**Description**: Added updateTask() method to TasksService that accepts task id and UpdateTaskInput, makes a PATCH request to /api/tasks/:id endpoint, and returns Observable<Task>. Updated imports to include UpdateTaskInput type. Follows the established pattern from createTask method.

### Task 9: Add updateTask effect to TasksEffects
**Commit**: 3dec419 - feat(frontend): Add updateTask effect to TasksEffects
**Files**:
- apps/frontend/src/app/tasks/store/tasks.effects.ts
**Description**: Added updateTask$ effect to TasksEffects that listens for updateTask action, calls tasksService.updateTask(), and dispatches updateTaskSuccess or updateTaskFailure. Updated imports to include updateTask, updateTaskSuccess, and updateTaskFailure actions. Follows the established pattern from createTask effect.

### Task 10: Add reducer cases for updateTask actions
**Commit**: [To be added]
**Files**:
- apps/frontend/src/app/tasks/store/tasks.reducer.ts
**Description**: Added three reducer cases for task update flow: updateTask (sets loading state), updateTaskSuccess (updates task in array by id using map), and updateTaskFailure (sets error state). Updated imports to include updateTask, updateTaskSuccess, and updateTaskFailure actions. The updateTaskSuccess case uses Array.map() to replace the updated task while preserving all other tasks unchanged. Follows the established pattern from createTask reducers.

## Next Task
Create EditTaskPageComponent for editing task details

## Use Case Status
🔄 In Progress - Backend complete; Frontend NGRX reducer added
