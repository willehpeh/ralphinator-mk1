# User Story: Add a New Project to a Client

## Story ID
US-PROJECT-001

## Story Title
As a developer, I want to add a new project to a client so that I can track development work for that client.

## User Story
**As a** software developer or agency owner
**I want to** create a new project record associated with a client
**So that** I can track development projects, their status, timelines, and budget information

## Acceptance Criteria

### Main Success Scenario:
1. User navigates to a client's detail page
2. User clicks "Add Project" button in the Projects section
3. System displays project creation form with the following fields:
   - Project name (required)
   - Description (optional)
   - Status (required, dropdown: Planning, Active, On Hold, Completed, Cancelled)
   - Start date (optional)
   - Expected end date (optional)
   - Actual end date (optional, disabled until status is Completed or Cancelled)
   - Budget/estimated value (optional, numeric)
   - Technical notes (optional, textarea)
4. User enters project information
5. User submits the form
6. System validates the required fields
7. System creates the project and associates it with the client
8. System displays confirmation message
9. System shows the project in the Projects section of the client detail page

### Extensions:
- **5a. Validation fails (missing required fields)**
  - 5a1. System displays validation error messages
  - 5a2. User corrects the errors and resubmits
- **5b. User cancels project creation**
  - 5b1. System discards entered data
  - 5b2. System returns to client detail view

### Success Guarantee:
- The new project is created and persisted via event sourcing
- The project appears in the client's project list
- All entered information is accurately stored and retrievable

## Business Rules
1. Project name is required
2. Project must be associated with exactly one client
3. Status must be one of: Planning, Active, On Hold, Completed, Cancelled
4. Actual end date can only be set when status is Completed or Cancelled
5. Budget/estimated value must be a positive number if provided
6. Start date cannot be after expected end date (if both are provided)
7. Expected end date cannot be after actual end date (if both are provided)

## Technical Implementation Notes

### Domain Layer (`packages/domain/`)
- Create `ProjectAggregate` extending `EventSourcedAggregate`
- Create `ProjectCreatedDomainEvent` with project data
- Create `ProjectStatus` enum (Planning, Active, On Hold, Completed, Cancelled)
- Create value objects if needed (e.g., `Money` for budget)
- Implement `ProjectAggregate.create()` static method
- Implement `apply()` method to rebuild state from events

### Application Layer (`packages/application/`)
- Create `CreateProjectCommand` with required fields (clientId, name, status) and optional fields
- Create `CreateProjectCommandHandler` implementing `ICommandHandler`
  - Generate new project ID
  - Validate client exists (load ClientAggregate)
  - Create ProjectAggregate
  - Append events to event store
  - Publish integration events if needed
- Create `ProjectReadModel` DTO for queries
- Create `GetProjectsByClientIdQuery` to retrieve projects for a client
- Create `GetProjectsByClientIdQueryHandler` implementing `IQueryHandler`
- Create `IProjectReadRepository` port interface
  - `findByClientId(clientId: string): Promise<ProjectReadModel[]>`
  - `findById(projectId: string): Promise<ProjectReadModel | null>`
  - `save(project: ProjectReadModel): Promise<void>`

### Infrastructure Layer (`packages/infrastructure/`)
- Create `ProjectProjection` implementing `IEventHandler`
  - Handle `ProjectCreatedDomainEvent`
  - Build and save `ProjectReadModel`
- Create `InMemoryProjectReadRepository` implementing `IProjectReadRepository`
  - Use Map-based storage for development/testing
  - Implement all interface methods

### API Layer (`apps/api/`)
- Create `ProjectsModule` and register:
  - Command handlers
  - Query handlers
  - Projections
  - Event store provider
  - Read repository provider
- Create `ProjectsController` with endpoints:
  - `POST /api/clients/:id/projects` - Create project for client
  - `GET /api/clients/:id/projects` - Get all projects for client
- Create DTOs in shared-types:
  - `CreateProjectDto` (validation with class-validator)
  - `CreateProjectResponse`
  - `ProjectDto` (read model representation)

### Frontend Layer (`apps/frontend/`)
- Create `ProjectFormComponent` (standalone component)
  - Reactive forms with validation
  - Status dropdown with all options
  - Date pickers for start/expected end/actual end dates
  - Budget input with number validation
  - Conditional logic for actual end date (enabled only for Completed/Cancelled)
  - Emit `projectAdded` and `formCancelled` output events
- Create `ProjectListComponent` (standalone component)
  - Display projects in responsive grid/list
  - Show project name, status, dates, budget
  - Status badge with color coding
  - Empty state message when no projects
  - Click to navigate to project detail (future)
- Update `ClientDetailComponent`:
  - Add Projects section
  - Include "Add Project" button
  - Integrate `ProjectFormComponent` and `ProjectListComponent`
  - Fetch projects on component init via HTTP
  - Reload projects after successful creation
- Create `ProjectsService` for API communication:
  - `createProject(clientId, projectData): Observable<CreateProjectResponse>`
  - `getProjectsByClientId(clientId): Observable<ProjectDto[]>`
- Add TypeScript interfaces in frontend for type safety

### Testing (`packages/testing/`)
- Write tests for `CreateProjectCommandHandler`:
  - Successfully creates project with all fields
  - Successfully creates project with only required fields
  - Validates required fields
  - Checks client exists before creating project
  - Persists `ProjectCreatedDomainEvent` to event store
- Write tests for `GetProjectsByClientIdQueryHandler`:
  - Retrieves projects for a given client
  - Returns empty array when client has no projects
  - Handles non-existent client

## Definition of Done
- [ ] Domain layer: ProjectAggregate and ProjectCreatedDomainEvent implemented
- [ ] Application layer: Command and query handlers implemented with tests
- [ ] Infrastructure layer: Projection and read repository implemented
- [ ] API layer: Endpoints created and tested manually
- [ ] Frontend layer: Forms and components implemented
- [ ] End-to-end flow: User can create project from UI → persisted via event sourcing → displayed in project list
- [ ] Code follows Clean Architecture principles and CQRS pattern
- [ ] All code passes linting
- [ ] Event sourcing verified: Events stored in event store
- [ ] Read model separation verified: Queries use projections, not aggregates

## Story Points
**Estimate:** 13 points (Large)

**Justification:** This is a large story requiring full-stack implementation across all architectural layers, similar in scope to the initial "Add New Client" story. It establishes the foundation for the Projects domain, including new aggregates, events, projections, API endpoints, and UI components.

## Dependencies
- Requires completed Client management functionality (already implemented)
- Blocks future stories:
  - View/Edit/Delete Projects
  - Add Tasks to Projects
  - Associate Communications with Projects
  - Dashboard showing active projects

## Notes
- This story establishes the Projects domain and follows the same CQRS + Event Sourcing patterns as Clients and Contacts
- Future stories will add update, delete, filtering, and detailed views for projects
- The relationship is: Client → (has many) → Projects → (has many) → Tasks
- Consider using Money value object for budget if complex currency handling is needed; otherwise, a simple number is sufficient for MVP
