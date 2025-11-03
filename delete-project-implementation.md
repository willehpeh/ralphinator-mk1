# Use Case 6: Delete Project - Implementation Progress

## Completed Tasks

### Task 1: Add ProjectDeletedDomainEvent for soft delete tracking 
**Status**: Complete
**Date**: 2025-11-03

**Changes**:
- Created `ProjectDeletedDomainEvent` class in `packages/domain/src/lib/events/project-deleted.domain-event.ts`
- Added DELETED constant to `PROJECT_EVENT_TYPES` in `packages/domain/src/lib/constants/project-event-types.ts`
- Exported new event from `packages/domain/src/index.ts`

**Files Modified**:
- `packages/domain/src/lib/events/project-deleted.domain-event.ts` (new)
- `packages/domain/src/lib/constants/project-event-types.ts`
- `packages/domain/src/index.ts`

**Pattern**: Follows established domain event pattern with immutable event stored in event store

---

## Next Tasks (Pending)

- Add `delete()` method to ProjectAggregate
- Create DeleteProjectCommand
- Create DeleteProjectCommandHandler
- Add PATCH endpoint for project deletion
- Add deleteProject method to ProjectsService (frontend)
- Add Delete button to project detail component
- Add confirmation dialog for project deletion
- Add projection handler for ProjectDeletedDomainEvent
- Update ProjectReadModel to include `isDeleted` field
- Filter deleted projects from list views
