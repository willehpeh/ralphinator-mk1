# Task Tracking: UC1 - Record a New Action Item

## Use Case
Use Case 1: Record a New Action Item (from CURRENT_USE_CASE.md)

## Implementation Order
1. ✅ Domain: TaskAggregate.create() + TaskCreatedDomainEvent (Done)
2. ✅ Application: CreateTaskCommand + CreateTaskHandler (Done)
   - ✅ CreateTaskCommand + TaskDataPayload (Completed)
   - ✅ CreateTaskHandler (Completed)
3. ✅ Infrastructure: TaskProjection for TaskCreatedDomainEvent (Done)
4. ✅ Backend: InMemoryTaskReadRepository implementation (Done)
5. ✅ Backend: POST /api/tasks endpoint (Done)
6. ⏳ Frontend: TaskFormComponent + AddTaskPageComponent + NGRX state (Next)

## Completed Tasks

### Task 1: TaskStatus and TaskPriority enums
**Commit**: d0dd903 - feat(shared-types): Add TaskStatus and TaskPriority types
**Files**:
- shared-types package
**Description**: Added shared type enums for task status and priority

### Task 2: TaskCreatedDomainEvent and TaskData value object
**Commit**: 9ed65ca - feat(domain): Add TaskCreatedDomainEvent and TaskData value object
**Files**:
- packages/domain/src/lib/events/task-created.domain-event.ts
- packages/domain/src/lib/value-objects/task-data.value-object.ts
- packages/domain/src/lib/constants/task-event-types.ts
**Description**: Created domain event and value object to encapsulate task data

### Task 3: TaskAggregate with create() factory method
**Commit**: 3afa6f5 - feat(domain): Add TaskAggregate with create() factory method
**Files**:
- packages/domain/src/lib/aggregates/task.aggregate.ts
**Description**: Implemented event-sourced aggregate with create method

### Task 4: CreateTaskCommand and TaskDataPayload
**Commit**: 2772200 - feat(application): Add CreateTaskCommand and TaskDataPayload
**Files**:
- packages/application/src/lib/commands/task-data.payload.ts
- packages/application/src/lib/commands/create-task.command.ts
- packages/application/src/lib/application.ts (exports)
**Description**: Created command and payload DTOs following DRY principle

### Task 5: CreateTaskHandler
**Commit**: 7af5d57 - feat(application): Add CreateTaskHandler with tests
**Files**:
- packages/application/src/lib/commands/handlers/create-task.handler.ts
- packages/testing/src/tests/create-task.handler.spec.ts
- packages/application/src/lib/application.ts (exports)
**Description**: Implemented command handler to execute task creation following CQRS pattern with TDD

### Task 6: TaskReadModel
**Commit**: 6382ee5 - feat(application): Add TaskReadModel for task queries
**Files**:
- packages/application/src/lib/read-models/task.read-model.ts
- packages/application/src/lib/application.ts (exports)
**Description**: Created read model DTO for task queries with all task fields

### Task 7: ITaskReadRepository interface
**Commit**: 87e0271 - feat(application): Add ITaskReadRepository port interface
**Files**:
- packages/application/src/lib/ports/task-read-repository.interface.ts
- packages/application/src/lib/ports/injection-tokens.ts
- packages/application/src/lib/application.ts (exports)
**Description**: Created repository port interface for task read model operations with CRUD methods and injection token

### Task 8: TaskProjection
**Commit**: da41312 - feat(infrastructure): Add TaskProjection to handle TaskCreatedDomainEvent
**Files**:
- packages/infrastructure/src/lib/projections/task.projection.ts
- packages/infrastructure/src/lib/infrastructure.ts (exports)
**Description**: Created projection event handler to build task read models from TaskCreatedDomainEvent, enabling CQRS separation between write (event store) and read (read model) data stores

### Task 9: InMemoryTaskReadRepository
**Commit**: 02fcec7 - feat(infrastructure): Add InMemoryTaskReadRepository implementation
**Files**:
- packages/infrastructure/src/lib/read-models/in-memory-task-read-repository.ts
- packages/infrastructure/src/lib/infrastructure.ts (exports)
**Description**: Implemented in-memory repository for task read models, extending BaseInMemoryReadRepository and implementing ITaskReadRepository interface for CRUD operations on task queries

### Task 10: Task DTOs
**Commit**: b8814da - feat(shared-types): Add task DTOs for API validation
**Files**:
- packages/shared-types/src/lib/dtos/task.dtos.ts
- packages/shared-types/src/index.ts (exports)
**Description**: Created DTOs for task API operations including CreateTaskDto, UpdateTaskDto, CreateTaskResponse, and TaskDto following the established pattern from project DTOs with class-validator decorators

### Task 11: TasksController and TasksModule
**Commit**: 8519a24 - feat(api): Add TasksController and TasksModule with POST /api/tasks endpoint
**Files**:
- apps/api/src/app/tasks/tasks.controller.ts
- apps/api/src/app/tasks/tasks.module.ts
- apps/api/src/app/app.module.ts (import TasksModule)
**Description**: Created TasksController with POST /api/tasks endpoint that uses CommandBus to execute CreateTaskCommand. Set up TasksModule with CQRS handlers, event handlers, and infrastructure providers. Registered TasksModule in AppModule.

### Task 12: Task frontend types
**Commit**: 19121e0 - feat(frontend): Add Task type interfaces for frontend
**Files**:
- apps/frontend/src/app/tasks/task.types.ts
**Description**: Created frontend Task, CreateTaskInput, and UpdateTaskInput interfaces that match the backend DTOs. These types provide type safety for the frontend NGRX state, actions, and components.

### Task 13: Tasks NGRX actions
**Commit**: 43ba889 - feat(frontend): Add NGRX actions for task creation
**Files**:
- apps/frontend/src/app/tasks/store/tasks.actions.ts
**Description**: Created NGRX actions for task creation including createTask (to initiate task creation), createTaskSuccess (on successful creation), and createTaskFailure (on error). These actions follow the established pattern from clients.actions.ts and provide type-safe action creators for the tasks feature.

### Task 14: TasksService for API calls
**Commit**: dae6253 - feat(frontend): Add TasksService for task API calls
**Files**:
- apps/frontend/src/app/tasks/tasks.service.ts
**Description**: Created TasksService to handle HTTP API calls for task operations. Implemented createTask(), getAllTasks(), and getTaskById() methods following the established pattern from ClientsService. Uses inject() for dependency injection and returns typed Observables.

### Task 15: TasksEffects with createTask$ effect
**Commit**: 4956fa5 - feat(frontend): Add TasksEffects with createTask$ effect
**Files**:
- apps/frontend/src/app/tasks/store/tasks.effects.ts
**Description**: Created TasksEffects with createTask$ effect to handle API calls for task creation. Follows the established pattern from ClientsEffects with reusable error handler. Uses inject() for dependency injection and handles success/failure actions.

### Task 16: TasksReducer to manage task state
**Commit**: (next) - feat(frontend): Add tasks.reducer.ts to manage task state
**Files**:
- apps/frontend/src/app/tasks/store/tasks.reducer.ts
**Description**: Created tasksReducer with TasksState interface following the established pattern from clients.reducer.ts. Implements state management for task creation actions (createTask, createTaskSuccess, createTaskFailure) with helper functions for common state transitions.

## Next Task
Frontend NGRX: Create tasks.selectors.ts for selecting task state

## Use Case Status
❌ Not Complete - Still need frontend implementation
