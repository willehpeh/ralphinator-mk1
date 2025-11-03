# Use Case 5: Change Project Status Through Lifecycle - Task Documentation

## Completed Tasks

### Task 1: Create ProjectStatusChangedDomainEvent 
**Date**: 2025-11-03

**What was implemented**:
- Created `ProjectStatusChangedDomainEvent` domain event at `packages/domain/src/lib/events/project-status-changed.domain-event.ts`
- Follows the same pattern as `ClientStatusChangedDomainEvent` for consistency
- Captures both previous and new status for audit trail purposes
- Extends `DomainEvent` base class with proper event versioning
- Includes aggregateId, previousStatus, and newStatus fields
- TypeScript type safety using `ProjectStatus` from shared-types package

**Files created**:
- `packages/domain/src/lib/events/project-status-changed.domain-event.ts`

**Rationale**:
Creating a separate domain event for status changes (rather than using the general `ProjectDetailsUpdatedDomainEvent`) provides:
1. **Granular event tracking**: Status changes are tracked separately from other project updates
2. **Efficient projections**: Read models can handle status changes with partial updates
3. **Clear audit trail**: Easy to track when and how status changed (previous � new)
4. **Business logic clarity**: Status changes may have different business rules than general updates

---

### Task 2: Add changeStatus() method to ProjectAggregate
**Date**: 2025-11-03

**What was implemented**:
- Added `PROJECT_EVENT_TYPES.STATUS_CHANGED` constant to `packages/domain/src/lib/constants/project-event-types.ts`
- Added `PROJECT_STATUS_UNCHANGED` error constant to `packages/domain/src/lib/constants/domain-errors.ts`
- Imported `ProjectStatusChangedDomainEvent` in ProjectAggregate
- Registered `onProjectStatusChanged` event handler in ProjectAggregate constructor
- Implemented `changeStatus(newStatus: ProjectStatus)` method in ProjectAggregate
  - Validates that new status is different from current status
  - Applies `ProjectStatusChangedDomainEvent` with previous and new status
- Implemented `onProjectStatusChanged` event handler to update aggregate state

**Files modified**:
- `packages/domain/src/lib/constants/project-event-types.ts`
- `packages/domain/src/lib/constants/domain-errors.ts`
- `packages/domain/src/lib/aggregates/project.aggregate.ts`

**Rationale**:
The `changeStatus()` method follows the same pattern as `ClientAggregate.changeStatus()` for consistency:
1. **Business rule enforcement**: Prevents setting status to the same value (no-op changes)
2. **Event sourcing**: State changes only through events that can be replayed
3. **Focused responsibility**: Separate method for status changes vs general updates
4. **Domain-driven**: Business logic lives in the aggregate, not in handlers

---

## Next Tasks

- Create ChangeProjectStatusCommand
- Create ChangeProjectStatusCommandHandler
- Update ProjectProjection to handle status changed event
- Add PATCH /api/projects/:id/status endpoint
- Add frontend change status functionality
