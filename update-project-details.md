# Use Case 4: Update Project Details - Task Log

## Completed Tasks

### Task 1: Create ProjectDetailsUpdatedDomainEvent class 
**Date**: 2025-11-03
**Files Created**:
- `packages/domain/src/lib/events/project-details-updated.domain-event.ts`

**Files Modified**:
- `packages/domain/src/index.ts` (added export)

**Description**: Created the domain event that will be stored in the event store when project details are updated. This event contains the updated ProjectData value object and follows the same pattern as ProjectCreatedDomainEvent.

**Commit**: 

### Task 2: Add DETAILS_UPDATED event type constant
**Date**: 2025-11-03
**Files Modified**:
- `packages/domain/src/lib/constants/project-event-types.ts` (added DETAILS_UPDATED constant)

**Description**: Added the DETAILS_UPDATED constant to PROJECT_EVENT_TYPES that maps to 'ProjectDetailsUpdatedDomainEvent'. This constant is used by the aggregate and handlers to identify the event type, following the established pattern for event type constants.

**Commit**: feat: Add DETAILS_UPDATED event type constant for project updates

### Task 3: Add updateDetails method to ProjectAggregate
**Date**: 2025-11-03
**Files Modified**:
- `packages/domain/src/lib/aggregates/project.aggregate.ts` (added updateDetails method, onProjectDetailsUpdated event handler, and registered the event handler)

**Description**: Added the updateDetails method to the ProjectAggregate that accepts a ProjectData value object and applies the ProjectDetailsUpdatedDomainEvent. Also implemented the onProjectDetailsUpdated event handler that updates the aggregate state when replaying events, following the same pattern as the onProjectCreated handler.

**Commit**: feat: Add updateDetails method to ProjectAggregate

### Task 4: Create UpdateProjectDetailsCommand
**Date**: 2025-11-03
**Files Created**:
- `packages/application/src/lib/commands/update-project-details.command.ts`

**Files Modified**:
- `packages/application/src/lib/application.ts` (added export)

**Description**: Created the UpdateProjectDetailsCommand class that accepts a project ID and ProjectDataPayload. This command will be handled by the UpdateProjectDetailsCommandHandler to execute the update operation on the ProjectAggregate. Follows the same pattern as UpdateClientCommand and reuses the ProjectDataPayload that was designed to be shared between create and update operations.

**Commit**: feat: Add UpdateProjectDetailsCommand for project updates

### Task 5: Create UpdateProjectDetailsHandler
**Date**: 2025-11-03
**Files Created**:
- `packages/application/src/lib/commands/handlers/update-project-details.handler.ts`

**Files Modified**:
- `packages/application/src/lib/application.ts` (added export)

**Description**: Created the UpdateProjectDetailsHandler command handler that loads the ProjectAggregate, calls the updateDetails method with the ProjectData value object, and persists the events. Follows the same pattern as UpdateClientHandler using the executeOnAggregate helper method from BaseCommandHandler for the load-execute-save pattern.

**Commit**: feat: Add UpdateProjectDetailsHandler for project updates

### Task 6: Add projection handler for ProjectDetailsUpdatedDomainEvent
**Date**: 2025-11-03
**Files Modified**:
- `packages/infrastructure/src/lib/projections/project.projection.ts` (added ProjectDetailsUpdatedDomainEvent import, added to @EventsHandler decorator, registered handler in constructor, added updateReadModel helper method, added transformProjectDataToReadModel helper method, added onProjectDetailsUpdated event handler, refactored onProjectCreated to use new helper)

**Description**: Added projection handler for the ProjectDetailsUpdatedDomainEvent that updates the read model when project details change. The handler follows the same pattern as ClientProjection, using a fetch-update-save approach with helper methods. The handler preserves the original createdAt timestamp while updating all other fields. Also refactored the existing onProjectCreated handler to use a new shared helper method (transformProjectDataToReadModel) that eliminates duplication between create and update operations.

**Commit**: feat: Add projection handler for ProjectDetailsUpdatedDomainEvent

### Task 7: Create PUT endpoint in ProjectsController for updating project details
**Date**: 2025-11-03
**Files Modified**:
- `apps/api/src/app/projects/projects.controller.ts` (added imports for Put, NotFoundException, UpdateProjectDetailsCommand, GetProjectByIdQuery, UpdateProjectDto; added fetchProjectAfterMutation helper method; updated createProjectDataPayload to accept UpdateProjectDto; added PUT :projectId endpoint)
- `apps/api/src/app/projects/projects.module.ts` (added UpdateProjectDetailsHandler import and registration)

**Description**: Added the PUT endpoint to the ProjectsController for updating project details. The endpoint follows the same pattern as the ClientsController's update endpoint, using the UpdateProjectDetailsCommand to execute the update operation and then fetching the updated project using GetProjectByIdQuery. The endpoint includes:
- Route: PUT /clients/:clientId/projects/:projectId
- Request body: UpdateProjectDto with validation
- Response: ProjectReadModel with updated data
- Helper method: fetchProjectAfterMutation to retrieve updated project and throw NotFoundException if not found
- Updated createProjectDataPayload to accept both CreateProjectDto and UpdateProjectDto
- Registered UpdateProjectDetailsHandler in ProjectsModule

**Commit**:

## Pending Tasks
- Create Angular component for editing project details
- Add form validation
- Add routing
- Add integration tests
