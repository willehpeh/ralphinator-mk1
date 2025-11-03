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

---

## Next Tasks

### 3. Create PROJECT_EVENT_TYPES Constants
**Status**: Pending

**Implementation Details**:
- Create `packages/domain/src/lib/constants/project-event-types.ts`
- Define event type constants for project domain events
- Start with CREATED event type

### 4. Create ProjectAggregate
**Status**: Pending

**Implementation Details**:
- Create `packages/domain/src/lib/aggregates/project.aggregate.ts`
- Extend EventSourcedAggregate
- Implement static `create()` method
- Implement event handlers (starting with onProjectCreated)
- Include business rule validation in methods
- Follow ClientAggregate pattern

### 5. Create DOMAIN_ERRORS for Project
**Status**: Pending

**Implementation Details**:
- Update `packages/domain/src/lib/constants/domain-errors.ts`
- Add project-related error constants
- Include: PROJECT_NOT_INITIALIZED, INVALID_PROJECT_DATES, INVALID_BUDGET, etc.

### 6. Create ProjectData Value Object
**Status**: Pending

**Implementation Details**:
- Create `packages/domain/src/lib/value-objects/project-data.value-object.ts`
- Include all project fields with proper validation
- Follow ClientData pattern

### 7. Create CreateProjectCommand
**Status**: Pending

**Implementation Details**:
- Create `packages/application/src/lib/commands/create-project.command.ts`
- Include required fields: clientId, name, status
- Include optional fields: description, dates, budget, technical notes

### 8. Create CreateProjectCommandHandler
**Status**: Pending

**Implementation Details**:
- Create `packages/application/src/lib/commands/handlers/create-project.handler.ts`
- Load ClientAggregate to verify client exists
- Create ProjectAggregate
- Persist events to event store
- Return project ID

### 9. Create IProjectReadRepository Port
**Status**: Pending

**Implementation Details**:
- Create `packages/application/src/lib/ports/project-read-repository.interface.ts`
- Define methods: findByClientId, findById, save, findAll

### 10. Create ProjectReadModel
**Status**: Pending

**Implementation Details**:
- Create `packages/application/src/lib/read-models/project.read-model.ts`
- Include all project fields for query responses
- Match ProjectDto structure

### 11. Create GetProjectsByClientIdQuery
**Status**: Pending

**Implementation Details**:
- Create `packages/application/src/lib/queries/get-projects-by-client-id.query.ts`
- Accept clientId parameter

### 12. Create GetProjectsByClientIdQueryHandler
**Status**: Pending

**Implementation Details**:
- Create `packages/application/src/lib/queries/handlers/get-projects-by-client-id.handler.ts`
- Use IProjectReadRepository to fetch projects
- Return ProjectReadModel[]

### 13. Create ProjectProjection
**Status**: Pending

**Implementation Details**:
- Create `packages/infrastructure/src/lib/projections/project.projection.ts`
- Handle ProjectCreatedDomainEvent
- Build and save ProjectReadModel
- Follow ClientProjection pattern

### 14. Create InMemoryProjectReadRepository
**Status**: Pending

**Implementation Details**:
- Create `packages/infrastructure/src/lib/read-models/in-memory-project-read.repository.ts`
- Implement IProjectReadRepository interface
- Use Map-based storage
- Follow InMemoryClientReadRepository pattern

### 15. Create ProjectsModule
**Status**: Pending

**Implementation Details**:
- Create `apps/api/src/app/projects/projects.module.ts`
- Register command handlers, query handlers, projections
- Provide event store and read repository
- Import CqrsModule

### 16. Create ProjectsController
**Status**: Pending

**Implementation Details**:
- Create `apps/api/src/app/projects/projects.controller.ts`
- Add POST /api/clients/:id/projects endpoint
- Add GET /api/clients/:id/projects endpoint

### 17. Create Project DTOs
**Status**: Pending

**Implementation Details**:
- Create `packages/shared-types/src/lib/dtos/project.dtos.ts`
- Define CreateProjectDto with validation decorators
- Define CreateProjectResponse
- Define ProjectDto (read model representation)
- Export from shared-types package

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
- Completed: 2
- Remaining: 23
- Progress: 8%
