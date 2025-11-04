# US-TASK-001: Complete Task Management CRUD Operations

## User Story

As a software developer or agency owner, I want to create, update, view, and manage task records associated with projects and/or clients so that I can track action items, prioritize work, set due dates, and monitor completion status across my entire portfolio.

## Business Value

Tasks are essential for managing the day-to-day work across projects and client relationships. This feature enables users to:
- Track all action items in one central location
- Prioritize work by urgency and importance
- Monitor deadlines and identify overdue items
- Organize tasks by project, client, status, or priority
- Complete and archive tasks as work progresses
- Maintain visibility into what needs to be done next

## Acceptance Criteria

### Core Task Management
1. Users can create new tasks with all required fields
2. Users can associate tasks with a project (optional)
3. Users can associate tasks with a client (optional)
4. Users can set task status (Todo, In Progress, Completed, Cancelled)
5. Users can set task priority (Low, Medium, High, Urgent)
6. Users can set due dates for tasks
7. Users can add descriptive titles and notes to tasks

### Task Viewing and Filtering
8. Users can view a list of all tasks in the system
9. Users can filter tasks by status (Todo, In Progress, Completed, Cancelled)
10. Users can filter tasks by priority (Low, Medium, High, Urgent)
11. Users can filter tasks by project
12. Users can filter tasks by client
13. Users can search tasks by title
14. Users can identify overdue tasks (due date < today and status != Completed/Cancelled)
15. Users can view tasks associated with a specific project
16. Users can view tasks associated with a specific client

### Task Updates and Lifecycle
17. Users can update task details (title, description, due date, priority)
18. Users can change task status (Todo → In Progress → Completed)
19. Users can mark tasks as complete
20. Users can cancel tasks that are no longer needed
21. Users can delete tasks

### Task Detail View
22. Users can view complete task details including:
    - Title and description
    - Status and priority with visual indicators
    - Due date with overdue warnings
    - Associated project (if any)
    - Associated client (if any)
    - Creation date and last modified date

## Use Cases

### UC-TASK-001-01: Create a New Task
**Actor**: Developer/Agency Owner
**Preconditions**: User has access to the system
**Postconditions**: New task is created and visible in task list

**Main Flow**:
1. User navigates to Tasks section
2. User clicks "Add Task" button
3. System displays task creation form
4. User enters task title (required)
5. User enters task description/notes (optional)
6. User selects task status (default: Todo)
7. User selects task priority (default: Medium)
8. User sets due date (optional)
9. User selects associated project (optional)
10. User selects associated client (optional)
11. User submits form
12. System validates input
13. System creates task via CreateTaskCommand
14. System displays success message
15. System redirects to task detail page or task list

**Business Rules**:
- Title is required (1-200 characters)
- Status must be one of: Todo, In Progress, Completed, Cancelled
- Priority must be one of: Low, Medium, High, Urgent
- If project is selected, client must match the project's client (or be unset)
- Due date must be a valid date (can be in the past or future)

### UC-TASK-001-02: View All Tasks with Filtering
**Actor**: Developer/Agency Owner
**Preconditions**: User has access to the system
**Postconditions**: User sees filtered list of tasks

**Main Flow**:
1. User navigates to Tasks section
2. System displays list of all tasks
3. User can optionally apply filters:
   - Filter by status
   - Filter by priority
   - Filter by project
   - Filter by client
   - Search by title
   - Filter to show only overdue tasks
4. System updates list based on filters
5. User sees tasks with key information:
   - Title
   - Status badge (color-coded)
   - Priority badge (color-coded)
   - Due date (highlighted if overdue)
   - Associated project name (if any)
   - Associated client name (if any)

**Business Rules**:
- Overdue tasks are those with due date < today AND status is Todo or In Progress
- Tasks should be sortable by due date, priority, status
- Default sort: Priority (desc), Due Date (asc)

### UC-TASK-001-03: View Task Detail
**Actor**: Developer/Agency Owner
**Preconditions**: Task exists in the system
**Postconditions**: User sees complete task information

**Main Flow**:
1. User clicks on a task from the task list
2. System retrieves task details via GetTaskByIdQuery
3. System displays complete task information:
   - Title
   - Description/notes
   - Status with badge
   - Priority with badge
   - Due date (with overdue warning if applicable)
   - Associated project (with link to project detail)
   - Associated client (with link to client detail)
   - Created date
   - Last modified date
4. System provides action buttons:
   - Edit Task
   - Complete Task (if status is Todo or In Progress)
   - Change Status
   - Delete Task

### UC-TASK-001-04: Update Task Details
**Actor**: Developer/Agency Owner
**Preconditions**: Task exists in the system
**Postconditions**: Task is updated with new information

**Main Flow**:
1. User views task detail page
2. User clicks "Edit Task" button
3. System displays task edit form with current values
4. User modifies fields (title, description, priority, due date, project, client)
5. User submits form
6. System validates input
7. System updates task via UpdateTaskDetailsCommand
8. System displays success message
9. System shows updated task detail page

**Business Rules**:
- Same validation rules as task creation
- Cannot change status via edit form (use Change Status button)

### UC-TASK-001-05: Change Task Status
**Actor**: Developer/Agency Owner
**Preconditions**: Task exists in the system
**Postconditions**: Task status is changed

**Main Flow**:
1. User views task detail page
2. User clicks "Change Status" button or "Complete Task" button
3. System displays status change options
4. User selects new status
5. System updates task via ChangeTaskStatusCommand
6. System displays success message
7. If status changed to Completed, system records completion date

**Alternative Flow - Quick Complete**:
1. User clicks "Complete Task" button
2. System immediately changes status to Completed
3. System records completion date
4. System displays success message

**Business Rules**:
- Status transitions should be logical (e.g., Todo → In Progress → Completed)
- Completed tasks should have completion date recorded
- Cancelled tasks retain their due date but are no longer considered for overdue checks

### UC-TASK-001-06: Delete a Task
**Actor**: Developer/Agency Owner
**Preconditions**: Task exists in the system
**Postconditions**: Task is deleted from the system

**Main Flow**:
1. User views task detail page
2. User clicks "Delete Task" button
3. System displays confirmation dialog
4. User confirms deletion
5. System deletes task via DeleteTaskCommand
6. System displays success message
7. System redirects to task list

**Business Rules**:
- Deletion requires confirmation
- Deleted tasks are removed from read model but history is preserved (event sourcing)
- Deleting a task does not affect associated project or client

### UC-TASK-001-07: View Project Tasks
**Actor**: Developer/Agency Owner
**Preconditions**: Project exists in the system
**Postconditions**: User sees all tasks for the project

**Main Flow**:
1. User views project detail page
2. System displays "Tasks" section
3. System retrieves tasks via GetTasksByProjectIdQuery
4. System displays task list with:
   - Title
   - Status badge
   - Priority badge
   - Due date (highlighted if overdue)
5. User can click on task to view details
6. User can click "Add Task" button to create new task for this project

### UC-TASK-001-08: View Client Tasks
**Actor**: Developer/Agency Owner
**Preconditions**: Client exists in the system
**Postconditions**: User sees all tasks for the client

**Main Flow**:
1. User views client detail page
2. System displays "Tasks" section
3. System retrieves tasks via GetTasksByClientIdQuery
4. System displays task list with:
   - Title
   - Status badge
   - Priority badge
   - Due date (highlighted if overdue)
   - Associated project (if any)
5. User can click on task to view details
6. User can click "Add Task" button to create new task for this client

## Technical Implementation Requirements

### Domain Layer (packages/domain/)
- **TaskAggregate** (event-sourced aggregate)
  - Properties: id, title, description, status, priority, dueDate, projectId, clientId, completedAt, createdAt, updatedAt
  - Methods: create(), updateDetails(), changeStatus(), delete()
  - Business rule validations

- **Domain Events**:
  - TaskCreatedDomainEvent
  - TaskDetailsUpdatedDomainEvent
  - TaskStatusChangedDomainEvent
  - TaskDeletedDomainEvent

- **Value Objects**:
  - TaskStatus enum (Todo, InProgress, Completed, Cancelled)
  - TaskPriority enum (Low, Medium, High, Urgent)

### Application Layer (packages/application/)
- **Commands**:
  - CreateTaskCommand
  - UpdateTaskDetailsCommand
  - ChangeTaskStatusCommand
  - DeleteTaskCommand

- **Command Handlers**:
  - CreateTaskHandler
  - UpdateTaskDetailsHandler
  - ChangeTaskStatusHandler
  - DeleteTaskHandler

- **Queries**:
  - GetTaskByIdQuery
  - GetAllTasksQuery
  - GetTasksByProjectIdQuery
  - GetTasksByClientIdQuery
  - GetTasksByStatusQuery
  - GetTasksByPriorityQuery
  - GetOverdueTasksQuery

- **Query Handlers**:
  - GetTaskByIdHandler
  - GetAllTasksHandler
  - GetTasksByProjectIdHandler
  - GetTasksByClientIdHandler
  - GetTasksByStatusHandler
  - GetTasksByPriorityHandler
  - GetOverdueTasksHandler

- **Read Model**:
  - TaskReadModel (DTO with all properties including denormalized project/client names)

- **Ports**:
  - ITaskReadRepository (with all query methods)

### Infrastructure Layer (packages/infrastructure/)
- **TaskProjection** (implements IEventHandler)
  - Subscribes to all Task domain events
  - Updates read model database

- **InMemoryTaskReadRepository** (implements ITaskReadRepository)
  - In-memory storage for read models
  - Implements all query methods with filtering

### Backend API (apps/api/)
- **TasksModule**
  - Registers all commands, queries, handlers, projections
  - Provides ITaskReadRepository

- **TasksController**:
  - POST /api/tasks - Create task
  - GET /api/tasks - Get all tasks with optional filters (status, priority, projectId, clientId, overdue, search)
  - GET /api/tasks/:id - Get task by ID
  - PUT /api/tasks/:id - Update task details
  - PATCH /api/tasks/:id/status - Change task status
  - DELETE /api/tasks/:id - Delete task
  - GET /api/projects/:id/tasks - Get tasks for project
  - GET /api/clients/:id/tasks - Get tasks for client

### Frontend (apps/frontend/)
- **NGRX State Management**:
  - Task actions (load, create, update, delete, changeStatus, etc.)
  - Task effects (API calls)
  - Task reducer (state management)
  - Task selectors (including computed selectors for overdue tasks, filtered views)

- **Components**:
  - **TasksListComponent** - Display all tasks with filtering
    - Filter dropdowns (status, priority, project, client)
    - Search input (title)
    - "Show Overdue Only" checkbox
    - Task cards/rows with status/priority badges
    - Due date display with overdue styling
    - "Add Task" button

  - **TaskDetailComponent** - Display complete task information
    - All task properties
    - Action buttons (Edit, Complete, Change Status, Delete)
    - Links to associated project and client
    - Overdue warning banner (if applicable)

  - **TaskFormComponent** - Shared create/edit form
    - Reactive forms with validation
    - Title input (required)
    - Description textarea
    - Status dropdown
    - Priority dropdown
    - Due date picker
    - Project dropdown (with client auto-selection if project selected)
    - Client dropdown
    - Submit/cancel buttons

  - **AddTaskPageComponent** - Wrapper for task creation

  - **EditTaskPageComponent** - Wrapper for task editing

  - **StatusChangeDialogComponent** - Quick status change (reusable)

  - **ConfirmationDialogComponent** - Deletion confirmation (reusable)

- **Routes**:
  - /tasks - Task list
  - /tasks/new - Add task
  - /tasks/:id - Task detail
  - /tasks/:id/edit - Edit task

- **UI/UX Requirements**:
  - Status badges with colors (Todo: blue, In Progress: yellow, Completed: green, Cancelled: gray)
  - Priority badges with colors (Low: gray, Medium: blue, High: orange, Urgent: red)
  - Overdue tasks highlighted in red with warning icon
  - Due dates formatted as "due in 2 days", "due tomorrow", "overdue by 3 days"
  - Responsive grid layout
  - Loading states and error handling
  - Success/error toast notifications
  - Confirmation dialogs for destructive actions
  - Empty states with "Add Task" call-to-action

## Implementation Notes

### Event Sourcing Considerations
- All task state changes are captured as domain events
- TaskAggregate rebuilds state by replaying events
- Projections build optimized read models for queries
- Soft delete pattern: deleted tasks removed from read model but events preserved

### Business Rules to Enforce
1. Title is required and has max length
2. Status and priority must be valid enum values
3. If task has a project, the project must exist
4. If task has a client, the client must exist
5. If task has both project and client, they must be related (or client can be null)
6. Due date must be a valid date
7. Completion date is automatically set when status changes to Completed

### Testing Strategy
- Unit tests for TaskAggregate business logic (TDD approach)
- Integration tests for command/query handlers
- Tests for projection updates
- Frontend component tests with mocked store
- E2E tests for critical user flows

## Dependencies
- Requires existing Client entities (US-CLIENT-001)
- Requires existing Project entities (US-PROJECT-001, US-PROJECT-002)

## Definition of Done
- [ ] All domain events defined and tested
- [ ] TaskAggregate with business logic implemented and tested
- [ ] All command handlers implemented and tested
- [ ] All query handlers implemented and tested
- [ ] TaskProjection implemented and tested
- [ ] InMemoryTaskReadRepository implemented
- [ ] TasksController with all endpoints implemented
- [ ] NGRX state management (actions, effects, reducers, selectors)
- [ ] All Angular components implemented with proper styling
- [ ] Reactive forms with validation
- [ ] Filtering and search functionality working
- [ ] Overdue task detection working
- [ ] Integration with project detail page (task list section)
- [ ] Integration with client detail page (task list section)
- [ ] All acceptance criteria met
- [ ] Code follows Clean Architecture + CQRS + Event Sourcing patterns
- [ ] ESLint module boundary rules satisfied
- [ ] Manual testing completed for all use cases
- [ ] Responsive design works on mobile and desktop
