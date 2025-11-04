# Task Tracking: UC4 - Modify Action Item Details

## Use Case
Use Case 4: Modify Action Item Details (from CURRENT_USE_CASE.md)

## Implementation Order
1. ✅ Domain: TaskDetailsUpdatedDomainEvent (Done - prior commit)
2. ✅ Domain: TaskAggregate.updateDetails() method (Done - prior commit)
3. ✅ Application: UpdateTaskDetailsCommand (Done - this iteration)
4. ⏳ Application: UpdateTaskDetailsHandler (Next)
5. ⏳ Infrastructure: TaskProjection handler for TaskDetailsUpdatedDomainEvent
6. ⏳ Backend: PATCH /api/tasks/:id endpoint
7. ⏳ Frontend: EditTaskPageComponent + NGRX state

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

## Next Task
Create UpdateTaskDetailsHandler to load aggregate, execute updateDetails(), and persist events

## Use Case Status
🔄 In Progress - Domain and command layers complete; need handler, projection, API endpoint, and frontend
