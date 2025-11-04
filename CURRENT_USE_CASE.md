# Use Case 6: Remove Action Item from Tracking

**Primary Actor**: Developer or Agency Owner

**Goal**: Stop tracking an action item that is no longer relevant

**Preconditions**:
- User has access to the task management system
- The action item exists in the system

**Main Success Scenario**:
1. User is reviewing an action item (Use Case 3)
2. User requests to remove the action item from tracking
3. System asks user to confirm the removal
4. User confirms the removal
5. System removes the action item from active tracking
6. System confirms the action item has been removed
7. User is returned to the list of action items (without the removed item)

**Extensions**:
- 4a. If user decides not to remove the action item:
  - 4a1. System cancels the removal
  - 4a2. Return to Use Case 3

**Success Guarantee**: Action item is no longer visible in active tracking (though historical record may be preserved for audit purposes)

---

## Implementation Context

This use case implements the DELETE operation for task management, completing the basic CRUD functionality. It follows the same event-sourced soft delete pattern used for clients, contacts, and projects.

### Technical Approach

**Domain Layer**:
- TaskDeletedDomainEvent to capture deletion
- TaskAggregate.delete() method to apply the event
- Soft delete pattern (isDeleted flag)

**Application Layer**:
- DeleteTaskCommand with task ID
- DeleteTaskCommandHandler to process deletion

**Infrastructure Layer**:
- TaskProjection handles TaskDeletedDomainEvent
- Remove from read model while preserving event history

**Frontend**:
- "Delete Task" button in TaskDetailComponent
- ConfirmationDialogComponent for user confirmation
- Navigation to task list after successful deletion
- NGRX actions for state management

### Related Use Cases
- Builds on Use Case 3 (Review Details of a Specific Action Item)
- Complements Use Case 1 (Record a New Action Item)
- Follows same pattern as:
  - Use Case 7 (Client Management): Remove a Client from the System
  - Use Case 6 (Contact Management): Remove a Contact from the System
  - Use Case 6 (Project Management): Remove Project from Active Portfolio
