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
3. **Clear audit trail**: Easy to track when and how status changed (previous ’ new)
4. **Business logic clarity**: Status changes may have different business rules than general updates

---

## Next Tasks

- Add `changeStatus()` method to ProjectAggregate
- Register event handler in ProjectAggregate constructor
- Add PROJECT_EVENT_TYPES.STATUS_CHANGED constant
- Create ChangeProjectStatusCommand
- Create ChangeProjectStatusCommandHandler
- Update ProjectProjection to handle status changed event
- Add PATCH /api/projects/:id/status endpoint
- Add frontend change status functionality
