# Use Case 8: View Action Items for a Specific Client (UC-TASK-001-08)

**Status:** Complete (pending manual testing)

**Current Phase:** Implementation Complete

---

## Completed Tasks

### Backend Implementation ✅

#### Task 1: Add GetTasksByClientIdQuery and Handler
**Commit:** 818eca8
- Created `GetTasksByClientIdQuery` with clientId parameter
- Implemented `GetTasksByClientIdHandler` to query tasks repository
- Returns array of `TaskReadModel` objects

#### Task 2: Add findByClientId to ITaskReadRepository Interface
**Commit:** ab29567
- Added `findByClientId(clientId: string): Promise<TaskReadModel[]>` method signature
- Interface ensures all read repositories implement this query capability

#### Task 3: Implement findByClientId in InMemoryTaskReadRepository
**Commit:** 2f741fb
- Implemented repository method to filter tasks by clientId
- Returns matching tasks from in-memory collection

#### Task 4: Add GET /api/clients/:id/tasks Endpoint
**Commit:** 94472ca
- Added `getClientTasks()` controller method to ClientsController
- Endpoint: `GET /api/clients/:id/tasks`
- Executes `GetTasksByClientIdQuery` via QueryBus
- Returns array of `TaskReadModel` objects

### Frontend Implementation ✅

#### Task 5: Add getTasksByClientId() Method to TasksService
**Commit:** 91ef80b
- Added service method to fetch tasks from backend API
- HTTP GET to `/api/clients/${clientId}/tasks`
- Returns Observable<Task[]>

#### Task 6: Display Client Tasks in ClientDetailComponent
**Commit:** [pending]
- Added TasksService and Router injections to component
- Created tasksReloadTrigger signal for reactive updates
- Implemented tasks signal using toSignal with combineLatest pattern
- Added "Action Items" section in template after Projects section
- Display task cards with title, priority, status, and due date
- Added visual indicators for priority (color-coded badges)
- Added status badges with appropriate styling
- Highlighted overdue tasks with red text and OVERDUE badge
- Included navigation to task details via "View Details" button
- Added empty state message when no tasks exist
- Implemented helper methods: formatTaskStatus(), isTaskOverdue(), formatTaskDate(), viewTaskDetails()
- Added comprehensive SCSS styling matching project cards pattern
- Tasks section follows same visual design as contacts and projects sections

---

## Optional Enhancement (Not Implemented)

The use case extension 2a2 suggests offering an option to add a new task for the client when no tasks exist. This could be implemented as a future enhancement by:
- Adding an "Add Task" button in the Action Items section header (similar to Add Contact/Add Project)
- Navigating to the task creation form with clientId pre-selected
- This is a nice-to-have feature but not required for the core use case

---

## Use Case Completion Criteria

- [x] Backend query handler implemented
- [x] Backend repository method implemented
- [x] Backend API endpoint created
- [x] Frontend service method created
- [x] Frontend UI displays client tasks
- [x] Tasks show priority indicators
- [x] Tasks show status badges
- [x] Overdue tasks visually highlighted
- [x] Navigation to task details works
- [x] Empty state handled gracefully
- [ ] Manual testing completed

---

## Architecture Notes

**CQRS Pattern:**
- Query: `GetTasksByClientIdQuery` (read operation)
- Handler: Uses `ITaskReadRepository` port
- Read Model: `TaskReadModel` DTO

**Clean Architecture Layers:**
- Domain: No changes needed (tasks already modeled)
- Application: Query and handler in `packages/application/`
- Infrastructure: Repository implementation in `packages/infrastructure/`
- API: Controller endpoint in `apps/api/`
- Frontend: Service and component in `apps/frontend/`

**Design Pattern:**
- Follows existing pattern from "View Project Tasks" (Use Case 7)
- Reuses task display components where possible
- Maintains consistency with contacts and projects sections
