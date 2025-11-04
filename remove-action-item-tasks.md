# Use Case 6: Remove Action Item from Tracking - Implementation Tasks

This file tracks the implementation of Use Case 6: Remove Action Item from Tracking.

## Overview
Implement the ability to delete action items from the system using CQRS + Event Sourcing with soft delete pattern. The action item will be removed from active tracking views while preserving the complete audit trail in the event store.

## Implementation Tasks

### Domain Layer
- [x] Create TaskDeletedDomainEvent domain event (Commit: 521a186)
- [x] Add delete() method to TaskAggregate (Commit: bb26d63)
- [x] Add isDeleted getter to TaskAggregate (Commit: bb26d63)
- [x] Add TASK_EVENT_TYPES.DELETED constant (Commit: bb26d63)
- [ ] Write tests for TaskAggregate.delete()

### Application Layer
- [x] Create DeleteTaskCommand (Commit: c66eece)
- [x] Create DeleteTaskCommandHandler (Commit: TBD)
- [ ] Add delete() method to ITaskReadRepository port
- [ ] Write tests for DeleteTaskCommandHandler

### Infrastructure Layer
- [ ] Add delete() method to InMemoryTaskReadRepository
- [ ] Update TaskProjection to handle TaskDeletedDomainEvent
- [ ] Write tests for TaskProjection.onTaskDeleted()

### Backend API
- [ ] Add DELETE /api/tasks/:id endpoint to TasksController
- [ ] Test endpoint with HTTP client (curl/Postman)

### Frontend - NGRX State Management
- [ ] Add deleteTask action to tasks.actions.ts
- [ ] Add deleteTaskSuccess action to tasks.actions.ts
- [ ] Add deleteTaskFailure action to tasks.actions.ts
- [ ] Add deleteTask$ effect to tasks.effects.ts
- [ ] Update tasksReducer to handle deleteTask actions
- [ ] Add deleteTask() method to TasksService

### Frontend - UI Components
- [ ] Add "Delete Task" button to TaskDetailComponent
- [ ] Implement confirmation dialog (reuse ConfirmationDialogComponent)
- [ ] Add signal for showDeleteDialog state
- [ ] Implement handleDelete() method with NGRX dispatch
- [ ] Add loading state during deletion
- [ ] Add error handling with user-friendly messages
- [ ] Implement navigation to task list after successful deletion
- [ ] Style delete button with btn-danger class (red)

### Testing & Verification
- [ ] Verify task deletion via UI (complete user flow)
- [ ] Verify event is persisted in event store
- [ ] Verify task removed from read model
- [ ] Verify navigation works correctly
- [ ] Verify confirmation dialog displays properly
- [ ] Verify cancel functionality works
- [ ] Verify error handling displays appropriately
- [ ] Test edge case: deleting already deleted task

### Documentation
- [ ] Update IMPLEMENTED_CASES.md with Use Case 6 completion
- [ ] Archive CURRENT_USE_CASE.md
- [ ] Commit changes with descriptive message

## Acceptance Criteria

### Main Success Scenario
- [x] Step 1: User is reviewing an action item (Use Case 3 already implemented)
- [ ] Step 2: User requests to remove the action item (Delete button)
- [ ] Step 3: System asks user to confirm the removal (Confirmation dialog)
- [ ] Step 4: User confirms the removal (Confirm button in dialog)
- [ ] Step 5: System removes the action item from active tracking (Event sourced deletion)
- [ ] Step 6: System confirms the action item has been removed (Success message/navigation)
- [ ] Step 7: User is returned to the list of action items without the removed item

### Extensions
- [ ] 4a: User cancels deletion - dialog closes, no changes made
- [ ] 4a1: System cancels the removal
- [ ] 4a2: Return to Use Case 3 (task detail view)

### Success Guarantee
- [ ] Action item is no longer visible in task list
- [ ] Action item is no longer accessible via /tasks/:id route
- [ ] Historical record is preserved in event store (audit trail)
- [ ] Event sourcing integrity maintained

## Technical Notes

### Event Sourcing Pattern
```typescript
// Domain Event
export class TaskDeletedDomainEvent extends DomainEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly eventVersion: number
  ) {
    super(aggregateId, eventVersion);
  }
}

// Aggregate Method
public delete(): void {
  this.applyEvent(
    new TaskDeletedDomainEvent(this.id, this.getNextVersion())
  );
}

// Apply Method
private onTaskDeleted(event: TaskDeletedDomainEvent): void {
  this._isDeleted = true;
}
```

### Soft Delete Pattern
- Set `isDeleted` flag on aggregate
- Remove from read model (InMemoryTaskReadRepository)
- Preserve all events in event store
- Cannot restore via UI (future enhancement)

### NGRX Actions
```typescript
export const deleteTask = createAction(
  '[Tasks] Delete Task',
  props<{ id: string }>()
);

export const deleteTaskSuccess = createAction(
  '[Tasks] Delete Task Success',
  props<{ id: string }>()
);

export const deleteTaskFailure = createAction(
  '[Tasks] Delete Task Failure',
  props<{ error: string }>()
);
```

### Similar Implementations to Reference
- Use Case 7 (Client Management): Remove a Client from the System
- Use Case 6 (Contact Management): Remove a Contact from the System
- Use Case 6 (Project Management): Remove Project from Active Portfolio

## Definition of Done
- [ ] All acceptance criteria met
- [ ] All tasks completed and tested
- [ ] Code follows Clean Architecture + CQRS + Event Sourcing patterns
- [ ] ESLint module boundary rules satisfied
- [ ] Manual testing completed for all scenarios
- [ ] Documentation updated
- [ ] Git commit created with descriptive message
