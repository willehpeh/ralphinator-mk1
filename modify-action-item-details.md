# Use Case 4: Modify Action Item Details - Implementation Tasks

## Completed Tasks

### Task 1: Create TaskDetailsUpdatedDomainEvent
**Date:** 2025-11-04
**Description:** Created the domain event that represents when task details are updated.

**Files Changed:**
- Created: `packages/domain/src/lib/events/task-details-updated.domain-event.ts`
- Modified: `packages/domain/src/lib/constants/task-event-types.ts` (added DETAILS_UPDATED constant)
- Modified: `packages/domain/src/index.ts` (exported new event)

**Details:**
- Created `TaskDetailsUpdatedDomainEvent` class extending `DomainEvent`
- Uses `TaskData` value object to encapsulate all task details (title, notes, priority, deadline, clientId, projectId)
- Added corresponding constant `DETAILS_UPDATED: 'TaskDetailsUpdatedDomainEvent'` to `TASK_EVENT_TYPES`
- Follows the same pattern as `TaskCreatedDomainEvent`
- Includes JSDoc comment noting this event is for detail updates, NOT status changes

**Location:** packages/domain/src/lib/events/task-details-updated.domain-event.ts:1

### Task 2: Add updateDetails method to TaskAggregate
**Date:** 2025-11-04
**Description:** Added the updateDetails command method and event handler to TaskAggregate.

**Files Changed:**
- Modified: `packages/domain/src/lib/aggregates/task.aggregate.ts`

**Details:**
- Imported `TaskDetailsUpdatedDomainEvent`
- Registered `onTaskDetailsUpdated` event handler in constructor
- Added `onTaskDetailsUpdated()` private event handler method that calls `updateTaskFields()`
- Added public `updateDetails(taskData: TaskData)` command method that:
  - Ensures aggregate is initialized
  - Applies `TaskDetailsUpdatedDomainEvent` with the new task data
- Reuses existing `updateTaskFields()` helper method for consistent state updates
- Follows same pattern as `create()` method

**Location:** packages/domain/src/lib/aggregates/task.aggregate.ts:97

## Pending Tasks

- Create UpdateTaskDetailsCommand
- Create UpdateTaskDetailsHandler
- Update TaskProjection to handle TaskDetailsUpdatedDomainEvent
- Create API endpoint for updating task details
- Create frontend form for editing task details
- Add navigation from task detail view to edit form
- Add form validation
- Integrate with NGRX store
