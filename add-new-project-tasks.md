# Use Case: Add a New Project to a Client (UC-PROJECT-001-01)

## Overview
This document tracks the implementation tasks for the "Add a New Project to a Client" use case.

## Completed Tasks

### 1. Create ProjectStatus Type Definition
**Status**:  Completed
**Date**: 2025-11-03

**Implementation Details**:
- Created `packages/shared-types/src/lib/types/project-status.type.ts`
- Defined `PROJECT_STATUS_VALUES` constant with values: 'Planning', 'Active', 'On Hold', 'Completed', 'Cancelled'
- Defined `ProjectStatus` type derived from the values array
- Exported from shared-types package via `packages/shared-types/src/index.ts`
- Pattern follows existing ClientStatus implementation for consistency

**Files Modified**:
- `packages/shared-types/src/lib/types/project-status.type.ts` (new)
- `packages/shared-types/src/index.ts` (updated exports)

**Verification**:
- Linting passed: `nx lint shared-types`

### 2. Create ProjectCreatedDomainEvent
**Status**: Completed
**Date**: 2025-11-03

**Implementation Details**:
- Created `packages/domain/src/lib/events/project-created.domain-event.ts`
- Included all project fields: clientId, name, status (required), description, startDate, expectedEndDate, actualEndDate, budget, technicalNotes (optional)
- Followed pattern from other domain events (ClientStatusChangedDomainEvent)
- Included version field for event versioning (defaults to 1)
- Imported ProjectStatus type from shared-types package
- Exported from domain package via `packages/domain/src/index.ts`

**Files Modified**:
- `packages/domain/src/lib/events/project-created.domain-event.ts` (new)
- `packages/domain/src/index.ts` (updated exports)

**Verification**:
- Linting passed: `nx lint domain`

### 3. Create PROJECT_EVENT_TYPES Constants
**Status**: Completed
**Date**: 2025-11-03

**Implementation Details**:
- Created `packages/domain/src/lib/constants/project-event-types.ts`
- Defined PROJECT_EVENT_TYPES constant object with CREATED event type
- Followed pattern from CLIENT_EVENT_TYPES for consistency
- Event type name matches the class name: 'ProjectCreatedDomainEvent'
- Used `as const` for type safety
- Exported from domain package via `packages/domain/src/index.ts`

**Files Modified**:
- `packages/domain/src/lib/constants/project-event-types.ts` (new)
- `packages/domain/src/index.ts` (updated exports)

**Verification**:
- Linting passed: `nx lint domain`

### 4. Create ProjectAggregate
**Status**: Completed
**Date**: 2025-11-03

**Implementation Details**:
- Created `packages/domain/src/lib/aggregates/project.aggregate.ts`
- Extended EventSourcedAggregate base class
- Implemented static `create()` factory method with all project fields
- Registered event handler for ProjectCreatedDomainEvent in constructor
- Implemented `onProjectCreated()` event handler to initialize aggregate state
- Added `ensureInitialized()` and `getInitializedField()` helper methods following ClientAggregate pattern
- Implemented getter methods for all project fields
- Added PROJECT_NOT_INITIALIZED error constant to DOMAIN_ERRORS
- Exported ProjectAggregate from domain package via `packages/domain/src/index.ts`

**Files Modified**:
- `packages/domain/src/lib/aggregates/project.aggregate.ts` (new)
- `packages/domain/src/lib/constants/domain-errors.ts` (added PROJECT_NOT_INITIALIZED)
- `packages/domain/src/index.ts` (updated exports)

**Verification**:
- Linting passed: `nx lint domain`

---

## Next Tasks

### 5. Create DOMAIN_ERRORS for Project
**Status**: Completed (merged with Task 4)

**Note**: The PROJECT_NOT_INITIALIZED error was added as part of Task 4, which was the only project-specific error needed at this stage. Additional validation errors (INVALID_PROJECT_DATES, INVALID_BUDGET, etc.) will be added as needed when implementing business rules in future aggregate methods.

### 6. Create ProjectData Value Object
**Status**: Completed
**Date**: 2025-11-03

**Implementation Details**:
- Created `packages/domain/src/lib/value-objects/project-data.value-object.ts`
- Included all project fields: clientId, name, status (required), description, startDate, expectedEndDate, actualEndDate, budget, technicalNotes (optional)
- Followed ClientData pattern with constructor and static `fromPayload()` factory method
- Imported ProjectStatus type from shared-types package
- Exported from domain package via `packages/domain/src/index.ts`
- Pattern matches ClientData implementation for consistency

**Files Modified**:
- `packages/domain/src/lib/value-objects/project-data.value-object.ts` (new)
- `packages/domain/src/index.ts` (updated exports)

**Verification**:
- Linting passed: `nx lint domain`

### 7. Create CreateProjectCommand
**Status**: Completed
**Date**: 2025-11-03

**Implementation Details**:
- Created `packages/application/src/lib/commands/project-data.payload.ts` following ClientDataPayload pattern
- Included all project fields: clientId, name, status (required), description, startDate, expectedEndDate, actualEndDate, budget, technicalNotes (optional)
- Created `packages/application/src/lib/commands/create-project.command.ts` following CreateClientCommand pattern
- Command accepts id and ProjectDataPayload
- Exported both from application package via `packages/application/src/lib/application.ts`
- Followed DRY principle by creating shared payload for reuse in update commands

**Files Modified**:
- `packages/application/src/lib/commands/project-data.payload.ts` (new)
- `packages/application/src/lib/commands/create-project.command.ts` (new)
- `packages/application/src/lib/application.ts` (updated exports)

**Verification**:
- Linting passed: `nx lint application`

### 8. Create CreateProjectCommandHandler
**Status**: Completed
**Date**: 2025-11-03

**Implementation Details**:
- Created `packages/application/src/lib/commands/handlers/create-project.handler.ts`
- Extended BaseCommandHandler following CreateClientHandler pattern
- Verifies client exists by loading ClientAggregate before creating project (throws if client doesn't exist)
- Creates ProjectData value object from payload using ProjectData.fromPayload()
- Converts Date objects to ISO strings for the aggregate (ProjectAggregate expects string dates)
- Creates ProjectAggregate using domain logic
- Persists events to event store via saveAggregate()
- Returns project ID
- Exported from application package via `packages/application/src/lib/application.ts`

**Files Modified**:
- `packages/application/src/lib/commands/handlers/create-project.handler.ts` (new)
- `packages/application/src/lib/application.ts` (updated exports)

**Verification**:
- Linting passed: `nx lint application`

### 9. Create IProjectReadRepository Port
**Status**: Completed
**Date**: 2025-11-03

**Implementation Details**:
- Created `packages/application/src/lib/ports/project-read-repository.interface.ts`
- Defined interface methods: findById, findByClientId, findAll, save
- Followed IClientReadRepository pattern for consistency
- findByClientId returns Promise<ProjectReadModel[]> for retrieving all projects for a client
- Exported from application package via `packages/application/src/lib/application.ts`

**Files Modified**:
- `packages/application/src/lib/ports/project-read-repository.interface.ts` (new)
- `packages/application/src/lib/application.ts` (updated exports)

**Verification**:
- Linting passed: `nx lint application`

### 10. Create ProjectReadModel
**Status**: Completed
**Date**: 2025-11-03

**Implementation Details**:
- Created `packages/application/src/lib/read-models/project.read-model.ts`
- Included all project fields: id, clientId, name, status (required), description, startDate, expectedEndDate, actualEndDate, budget, technicalNotes (optional), createdAt
- Followed ClientReadModel pattern with constructor and readonly fields
- Imported ProjectStatus type from shared-types package
- Exported from application package via `packages/application/src/lib/application.ts`
- Pattern matches ClientReadModel implementation for consistency

**Files Modified**:
- `packages/application/src/lib/read-models/project.read-model.ts` (new)
- `packages/application/src/lib/application.ts` (updated exports)

**Verification**:
- Linting passed: `nx lint application`

### 11. Create GetProjectsByClientIdQuery
**Status**: Completed
**Date**: 2025-11-03

**Implementation Details**:
- Created `packages/application/src/lib/queries/get-projects-by-client-id.query.ts`
- Accepts clientId parameter as readonly property
- Followed GetClientContactsQuery pattern for consistency
- Exported from application package via `packages/application/src/lib/application.ts`

**Files Modified**:
- `packages/application/src/lib/queries/get-projects-by-client-id.query.ts` (new)
- `packages/application/src/lib/application.ts` (updated exports)

**Verification**:
- Linting passed: `nx lint application`

### 12. Create GetProjectsByClientIdQueryHandler
**Status**: Completed
**Date**: 2025-11-03

**Implementation Details**:
- Created `packages/application/src/lib/queries/handlers/get-projects-by-client-id.handler.ts`
- Uses IProjectReadRepository to fetch projects via findByClientId method
- Returns ProjectReadModel[]
- Followed GetClientContactsQueryHandler pattern for consistency
- Added PROJECT_READ_REPOSITORY injection token to `packages/application/src/lib/ports/injection-tokens.ts`
- Exported from application package via `packages/application/src/lib/application.ts`
- Includes proper error handling with descriptive messages

**Files Modified**:
- `packages/application/src/lib/queries/handlers/get-projects-by-client-id.handler.ts` (new)
- `packages/application/src/lib/ports/injection-tokens.ts` (added PROJECT_READ_REPOSITORY token)
- `packages/application/src/lib/application.ts` (updated exports)

**Verification**:
- Linting passed: `nx lint application`

### 13. Create ProjectProjection
**Status**: Completed
**Date**: 2025-11-03

**Implementation Details**:
- Created `packages/infrastructure/src/lib/projections/project.projection.ts`
- Extended BaseProjectionHandler following ClientProjection pattern
- Registered event handler for ProjectCreatedDomainEvent using event handler registry pattern
- Implemented transformToReadModel() helper method to convert event to ProjectReadModel
- Converts string dates from domain event to Date objects for read model
- Implemented onProjectCreated() event handler to persist read model
- Exported from infrastructure package via `packages/infrastructure/src/lib/infrastructure.ts`

**Files Modified**:
- `packages/infrastructure/src/lib/projections/project.projection.ts` (new)
- `packages/infrastructure/src/lib/infrastructure.ts` (updated exports)

**Verification**:
- Linting passed: `nx lint infrastructure`

### 14. Create InMemoryProjectReadRepository
**Status**: Completed
**Date**: 2025-11-03

**Implementation Details**:
- Created `packages/infrastructure/src/lib/read-models/in-memory-project-read-repository.ts`
- Implemented IProjectReadRepository interface with all required methods: findById, findByClientId, findAll, save
- Used Map-based storage following InMemoryClientReadRepository pattern
- Included JSDoc comments for all methods
- Added utility clear() method for testing purposes
- Exported from infrastructure package via `packages/infrastructure/src/lib/infrastructure.ts`

**Files Modified**:
- `packages/infrastructure/src/lib/read-models/in-memory-project-read-repository.ts` (new)
- `packages/infrastructure/src/lib/infrastructure.ts` (updated exports)

**Verification**:
- Linting passed: `nx lint infrastructure`

### 15. Create ProjectsModule
**Status**: Completed
**Date**: 2025-11-03

**Implementation Details**:
- Created `apps/api/src/app/projects/projects.module.ts`
- Imported CqrsModule
- Registered CreateProjectHandler command handler
- Registered GetProjectsByClientIdQueryHandler query handler
- Registered ProjectProjection event handler
- Provided EVENT_STORE, PROJECT_READ_REPOSITORY, and AGGREGATE_REPOSITORY using injection tokens
- Used InMemoryEventStore, InMemoryProjectReadRepository, and AggregateRepository implementations
- Registered ProjectsController (to be created in next task)
- Followed ClientsModule pattern for consistency

**Files Modified**:
- `apps/api/src/app/projects/projects.module.ts` (new)

**Verification**:
- Linting passed: `nx lint api`

### 16. Create ProjectsController
**Status**: Completed
**Date**: 2025-11-03

**Implementation Details**:
- Created `apps/api/src/app/projects/projects.controller.ts`
- Implemented POST /api/clients/:clientId/projects endpoint:
  - Accepts CreateProjectDto in request body
  - Generates UUID for project ID
  - Maps DTO to ProjectDataPayload using helper method
  - Executes CreateProjectCommand via CommandBus
  - Returns CreateProjectResponse with project ID and client ID
- Implemented GET /api/clients/:clientId/projects endpoint:
  - Accepts clientId as route parameter
  - Executes GetProjectsByClientIdQuery via QueryBus
  - Returns array of ProjectReadModel
- Followed ClientsController pattern with helper method for payload mapping
- Used nested route pattern: `/clients/:clientId/projects` to properly represent the resource relationship

**Files Modified**:
- `apps/api/src/app/projects/projects.controller.ts` (new)

**Verification**:
- Linting passed: `nx lint api`

### 17. Create Project DTOs
**Status**: Completed
**Date**: 2025-11-03

**Implementation Details**:
- Created `packages/shared-types/src/lib/dtos/project.dtos.ts`
- Defined ProjectDataDto base class with all project fields and validation decorators:
  - clientId (required, string)
  - name (required, string)
  - status (required, enum validation using PROJECT_STATUS_VALUES)
  - description, startDate, expectedEndDate, actualEndDate, technicalNotes (optional, string)
  - budget (optional, number with @Min(0) validation)
  - Date fields use @IsDateString() validation
- Defined CreateProjectDto extending ProjectDataDto
- Defined UpdateProjectDto extending ProjectDataDto
- Defined CreateProjectResponse interface
- Defined ProjectDto interface matching ProjectReadModel structure
- Exported from shared-types package via `packages/shared-types/src/index.ts`
- Followed ClientDataDto pattern for consistency

**Files Modified**:
- `packages/shared-types/src/lib/dtos/project.dtos.ts` (new)
- `packages/shared-types/src/index.ts` (updated exports)

**Verification**:
- Linting passed: `nx lint shared-types`

### 18. Wire ProjectsModule into AppModule
**Status**: Pending

**Implementation Details**:
- Update `apps/api/src/app/app.module.ts`
- Import ProjectsModule

### 19. Create ProjectFormComponent (Frontend)
**Status**: Pending

**Implementation Details**:
- Create `apps/frontend/src/app/components/project-form/project-form.component.ts`
- Standalone component with OnPush change detection
- Reactive forms with validation
- Status dropdown, date pickers, budget input
- Conditional logic for actual end date
- Output events: projectAdded, formCancelled

### 20. Create ProjectListComponent (Frontend)
**Status**: Pending

**Implementation Details**:
- Create `apps/frontend/src/app/components/project-list/project-list.component.ts`
- Standalone component with OnPush change detection
- Display projects in responsive grid/list
- Status badges with color coding
- Empty state message

### 21. Create ProjectsService (Frontend)
**Status**: Pending

**Implementation Details**:
- Create `apps/frontend/src/app/services/projects.service.ts`
- Methods: createProject, getProjectsByClientId
- Use HttpClient for API communication

### 22. Update ClientDetailComponent (Frontend)
**Status**: Pending

**Implementation Details**:
- Update `apps/frontend/src/app/pages/client-detail/client-detail.component.ts`
- Add Projects section
- Integrate ProjectFormComponent and ProjectListComponent
- Fetch projects on init
- Reload after creation

### 23. Write Tests for CreateProjectCommandHandler
**Status**: Pending

**Implementation Details**:
- Create `packages/testing/src/tests/create-project.handler.spec.ts`
- Test successful creation with all fields
- Test successful creation with only required fields
- Test validation failures
- Test client existence check
- Test event persistence

### 24. Write Tests for GetProjectsByClientIdQueryHandler
**Status**: Pending

**Implementation Details**:
- Create `packages/testing/src/tests/get-projects-by-client-id.handler.spec.ts`
- Test retrieving projects for a client
- Test empty array for client with no projects
- Test non-existent client handling

### 25. Manual End-to-End Testing
**Status**: Pending

**Implementation Details**:
- Start API and frontend servers
- Navigate to client detail page
- Create new project with various field combinations
- Verify project appears in list
- Verify validation messages
- Test cancel functionality

---

## Implementation Status
- Total Tasks: 25
- Completed: 17 (Tasks 1-17, with Task 5 merged into Task 4)
- Remaining: 8
- Progress: 68%
