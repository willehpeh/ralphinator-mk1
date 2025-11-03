# US-PROJECT-002: Complete Project Management CRUD Operations

**Story**: As a software developer or agency owner, I want to update project details, view individual project information, and search/filter projects so that I can manage the full lifecycle of client projects including status changes, timeline adjustments, and accessing project history.

## User Value
- **Track project evolution**: Update project information as scope, timelines, and budgets change
- **Monitor project details**: View comprehensive project information including timeline, budget, and associated tasks
- **Find projects quickly**: Search and filter projects to quickly locate specific work
- **Project status management**: Update project status as work progresses through lifecycle stages
- **Complete project audit trail**: Access full history of project changes via event sourcing

## Acceptance Criteria

### 1. Update Project Information
- [ ] Users can edit all project fields (name, description, status, dates, budget)
- [ ] Status transitions follow business rules (Planning → Active → Completed/On Hold/Cancelled)
- [ ] Date validations ensure logical timelines (start < expected end < actual end)
- [ ] Budget validation ensures positive values
- [ ] Form pre-populates with current project data
- [ ] Validation feedback provides clear error messages
- [ ] Success confirmation after update
- [ ] Event sourcing captures all updates as ProjectUpdatedDomainEvent

### 2. View Project Detail Page
- [ ] Individual project detail page accessible via URL (/projects/:id)
- [ ] Display all project information (name, description, status, client, dates, budget)
- [ ] Show associated client information with navigation link
- [ ] Display project timeline visualization
- [ ] Show placeholder for associated tasks (future implementation)
- [ ] Include "Edit Project" button to access update form
- [ ] Breadcrumb navigation (Home → Projects → [Project Name])

### 3. View All Projects List
- [ ] Dedicated projects list page accessible from main navigation
- [ ] Display all projects across all clients
- [ ] Show key project information (name, client, status, dates, budget)
- [ ] Color-coded status badges for visual clarity
- [ ] Link to project detail page from each row
- [ ] Responsive table/card layout

### 4. Search and Filter Projects
- [ ] Filter projects by status (all, planning, active, on hold, completed, cancelled)
- [ ] Filter projects by client
- [ ] Search projects by name
- [ ] Combine filters for advanced queries
- [ ] Display count of matching projects
- [ ] Clear filters option

### 5. Change Project Status
- [ ] Dedicated "Change Status" action from project detail
- [ ] Status dropdown with all valid statuses
- [ ] Status change validation (prevent invalid transitions if business rules exist)
- [ ] Automatic actual end date handling when marking as Completed/Cancelled
- [ ] Event sourcing captures status changes as ProjectStatusChangedDomainEvent
- [ ] Confirmation before status change

### 6. Delete Project (Soft Delete)
- [ ] Delete option available on project detail page
- [ ] Confirmation dialog before deletion
- [ ] Soft delete via ProjectDeletedDomainEvent
- [ ] Deleted projects excluded from standard views
- [ ] Cannot delete project with associated tasks (future constraint)

## Technical Implementation Requirements

### Backend (NestJS + CQRS + Event Sourcing)

#### Domain Layer
- [ ] Add ProjectUpdatedDomainEvent
- [ ] Add ProjectStatusChangedDomainEvent
- [ ] Add ProjectDeletedDomainEvent
- [ ] Update ProjectAggregate with:
  - `updateProject()` method
  - `changeStatus()` method
  - `delete()` method
  - Event application logic for new events

#### Application Layer
- [ ] Create UpdateProjectCommand and UpdateProjectHandler
- [ ] Create ChangeProjectStatusCommand and ChangeProjectStatusHandler
- [ ] Create DeleteProjectCommand and DeleteProjectHandler
- [ ] Create GetProjectByIdQuery and GetProjectByIdHandler
- [ ] Create GetAllProjectsQuery and GetAllProjectsHandler
- [ ] Create GetProjectsByStatusQuery and GetProjectsByStatusHandler
- [ ] Update existing queries to exclude deleted projects

#### Infrastructure Layer
- [ ] Update ProjectProjection to handle new events
- [ ] Update InMemoryProjectReadRepository:
  - Add `findById(projectId)` method
  - Add `findAll()` method
  - Add `findByStatus(status)` method
  - Add `update()` method
  - Add `delete()` method (soft delete flag)

#### API Layer
- [ ] PUT /api/projects/:id - Update project
- [ ] PATCH /api/projects/:id/status - Change project status
- [ ] GET /api/projects/:id - Get single project
- [ ] GET /api/projects - Get all projects with filtering
  - Query params: ?status=active&clientId=123&search=website
- [ ] DELETE /api/projects/:id - Delete project

### Frontend (Angular + NGRX + Signals)

#### Components
- [ ] Create ProjectDetailComponent
  - Display all project information
  - Show associated client with link
  - Timeline visualization
  - Edit and Delete buttons
  - Modern card-based layout

- [ ] Create ProjectListComponent
  - Display all projects across clients
  - Status filter dropdown
  - Client filter dropdown
  - Name search input
  - Responsive table/grid
  - Navigation to detail page

- [ ] Create EditProjectPageComponent
  - Reuse ProjectFormComponent in edit mode
  - Pre-populate form with current data
  - Handle update submission

- [ ] Update ProjectFormComponent
  - Support both create and edit modes
  - Accept initial values for edit mode
  - Emit update events separately from create events

#### State Management (NGRX)
- [ ] Add actions:
  - loadProject, loadProjectSuccess, loadProjectFailure
  - loadAllProjects, loadAllProjectsSuccess, loadAllProjectsFailure
  - updateProject, updateProjectSuccess, updateProjectFailure
  - deleteProject, deleteProjectSuccess, deleteProjectFailure
  - changeProjectStatus, changeProjectStatusSuccess, changeProjectStatusFailure

- [ ] Add effects:
  - loadProject$ - fetch single project
  - loadAllProjects$ - fetch all projects
  - updateProject$ - update project
  - deleteProject$ - delete project
  - changeProjectStatus$ - change status

- [ ] Update reducers:
  - Store projects by ID (entity adapter)
  - Track loading states
  - Handle errors

- [ ] Add selectors:
  - selectProjectById
  - selectAllProjects
  - selectProjectsByStatus
  - selectProjectsByClientId (existing)
  - selectProjectsLoading
  - selectProjectsError

#### Routing
- [ ] Add route: /projects → ProjectListComponent
- [ ] Add route: /projects/:id → ProjectDetailComponent
- [ ] Add route: /projects/:id/edit → EditProjectPageComponent
- [ ] Update navigation menu to include Projects link

#### Services
- [ ] Update ProjectService:
  - getProjectById(id: string): Observable<ProjectReadModel>
  - getAllProjects(filters?: ProjectFilters): Observable<ProjectReadModel[]>
  - updateProject(id: string, data: UpdateProjectDto): Observable<void>
  - deleteProject(id: string): Observable<void>
  - changeProjectStatus(id: string, status: ProjectStatus): Observable<void>

## Business Rules
1. **Status Lifecycle**: Projects progress logically through statuses (though any transition is allowed for flexibility)
2. **Date Validation**: startDate < expectedEndDate, actualEndDate only when Completed/Cancelled
3. **Budget Validation**: Budget must be positive number
4. **Required Fields**: name, clientId, status, startDate, expectedEndDate are required
5. **Audit Trail**: All changes captured via event sourcing
6. **Soft Delete**: Projects are marked deleted, not removed from event store

## Testing Requirements
- [ ] Unit tests for new command handlers
- [ ] Unit tests for new query handlers
- [ ] Unit tests for domain aggregate methods
- [ ] Unit tests for projection event handlers
- [ ] Integration tests for API endpoints
- [ ] Frontend component tests
- [ ] E2E tests for update/view/search workflows

## Dependencies
- Depends on: US-PROJECT-001 (Add New Project) ✅ Completed
- Blocks: US-TASK-001 (Task Management) - tasks will associate with projects

## Definition of Done
- [ ] All acceptance criteria met
- [ ] Backend API endpoints functional and tested
- [ ] Frontend components implemented with modern Angular patterns
- [ ] NGRX state management complete
- [ ] Event sourcing captures all project changes
- [ ] All tests passing
- [ ] Code follows project architecture (Clean + CQRS + Event Sourcing)
- [ ] ESLint passes with no boundary violations
- [ ] Documentation updated (IMPLEMENTED_STORIES.md)

## Estimated Scope
**Medium-Large** - Completes the full CRUD cycle for projects including detail views, list views, filtering, and search capabilities. Builds on existing foundation.
