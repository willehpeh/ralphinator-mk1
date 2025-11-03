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

### Task 3: Create ChangeProjectStatusCommand
**Date**: 2025-11-03

**What was implemented**:
- Created `ChangeProjectStatusCommand` at `packages/application/src/lib/commands/change-project-status.command.ts`
- Follows the same pattern as `ChangeClientStatusCommand` for consistency
- Takes two parameters: `id` (string) and `newStatus` (ProjectStatus)
- Added export to `packages/application/src/lib/application.ts` for proper module resolution
- Command is immutable (all fields are readonly) following CQRS best practices

**Files created**:
- `packages/application/src/lib/commands/change-project-status.command.ts`

**Files modified**:
- `packages/application/src/lib/application.ts`

**Rationale**:
Commands in CQRS represent the intent to perform an action. The `ChangeProjectStatusCommand`:
1. **Immutable**: Uses readonly fields to ensure command cannot be modified after creation
2. **Simple data structure**: Just carries data with no behavior (following command pattern)
3. **Type-safe**: Uses `ProjectStatus` enum from shared-types for compile-time validation
4. **Focused**: Single responsibility - changing project status only

---

### Task 4: Create ChangeProjectStatusCommandHandler
**Date**: 2025-11-03

**What was implemented**:
- Created `ChangeProjectStatusCommandHandler` at `packages/application/src/lib/commands/handlers/change-project-status.handler.ts`
- Extends `BaseCommandHandler<ChangeProjectStatusCommand, ProjectAggregate>` for consistent aggregate handling
- Implements `ICommandHandler<ChangeProjectStatusCommand>` from `@nestjs/cqrs`
- Uses `executeOnAggregate()` helper method to:
  - Load the ProjectAggregate from event store by ID
  - Execute the `changeStatus()` domain logic on the aggregate
  - Persist the resulting `ProjectStatusChangedDomainEvent` to event store
  - Publish the event to event bus for projections
- Returns the project ID on successful execution
- Registered handler in `ProjectsModule` providers array
- Added export to `packages/application/src/lib/application.ts`

**Files created**:
- `packages/application/src/lib/commands/handlers/change-project-status.handler.ts`

**Files modified**:
- `packages/application/src/lib/application.ts` (added export)
- `apps/api/src/app/projects/projects.module.ts` (imported and registered handler)

**Rationale**:
The `ChangeProjectStatusCommandHandler` follows the CQRS pattern and event sourcing principles:
1. **Separation of concerns**: Handler orchestrates the flow, aggregate contains business logic
2. **Event sourcing**: All state changes persist as events via the event store
3. **Consistency**: Uses the same `BaseCommandHandler` pattern as other command handlers
4. **Type safety**: TypeScript ensures compile-time validation of command and aggregate types
5. **Testability**: Handler can be unit tested by mocking the event store and aggregate repository

---

## Next Tasks

- Update ProjectProjection to handle ProjectStatusChangedDomainEvent
- Add PATCH /api/projects/:id/status endpoint
- Add frontend change status functionality
