# Use Case 8: View Action Items for a Specific Client (UC-TASK-001-08)

**Status:** In Progress

**Current Phase:** Frontend Integration

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

### Frontend Implementation (In Progress) 🔨

#### Task 5: Add getTasksByClientId() Method to TasksService
**Commit:** 91ef80b
- Added service method to fetch tasks from backend API
- HTTP GET to `/api/clients/${clientId}/tasks`
- Returns Observable<Task[]>

---

## Next Tasks

### Task 6: Display Client Tasks in ClientDetailComponent
Add a new section to the ClientDetailComponent template to display action items for the client:
- Use similar pattern to contacts/projects sections
- Load tasks using toSignal with combineLatest pattern
- Display task cards with title, priority, status, and due date
- Show visual indicators for priority and overdue status
- Allow navigation to task details

**Implementation Notes:**
- Follow existing pattern from contacts and projects sections
- Use reload trigger signal for refreshing task list
- Reuse task card styling from TaskListComponent
- Include empty state message if no tasks exist
- Add link to create new task for this client

---

## Use Case Completion Criteria

- [x] Backend query handler implemented
- [x] Backend repository method implemented
- [x] Backend API endpoint created
- [x] Frontend service method created
- [ ] Frontend UI displays client tasks
- [ ] Tasks show priority indicators
- [ ] Tasks show status badges
- [ ] Overdue tasks visually highlighted
- [ ] Navigation to task details works
- [ ] Empty state handled gracefully
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
