# Use Case 1: Record a New Action Item

**Primary Actor**: Developer or Agency Owner

**Goal**: Capture a new action item that needs to be tracked and completed

**Preconditions**: User has access to the task management system

**Main Success Scenario**:
1. User decides to record a new action item
2. User provides a title describing the action to be taken
3. User optionally adds detailed notes about what needs to be done
4. User indicates how urgent this action is (Low, Medium, High, or Urgent priority)
5. User indicates the current state (To Do, In Progress, Completed, or Cancelled)
6. User optionally sets a deadline by which the action should be completed
7. User optionally associates the action with a client or project for context
8. System validates the information is complete and consistent
9. System records the action item
10. System confirms the action item has been recorded
11. User sees the newly recorded action item

**Extensions**:
- 7a. If user associates action with a project that belongs to a specific client:
  - 7a1. System ensures consistency between project and client associations
- 8a. If required information is missing:
  - 8a1. System indicates what information is needed
  - 8a2. User provides missing information
  - 8a3. Continue at step 8
- 8b. If deadline is invalid:
  - 8b1. System indicates the deadline format is incorrect
  - 8b2. User provides valid deadline
  - 8b3. Continue at step 8

**Success Guarantee**: Action item is recorded in the system and available for tracking

---

## Implementation Mapping to US-TASK-001

This use case directly maps to:
- **UC-TASK-001-01: Create a New Task** from the current user story
- Acceptance Criteria #1-7 (Core Task Management)

## Technical Components Required

### Domain Layer
- TaskAggregate.create() method
- TaskCreatedDomainEvent
- TaskStatus enum (Todo, InProgress, Completed, Cancelled)
- TaskPriority enum (Low, Medium, High, Urgent)

### Application Layer
- CreateTaskCommand
- CreateTaskHandler

### Infrastructure Layer
- TaskProjection to handle TaskCreatedDomainEvent
- InMemoryTaskReadRepository (read model update)

### Backend API
- POST /api/tasks endpoint in TasksController

### Frontend
- AddTaskPageComponent
- TaskFormComponent (create mode)
- NGRX actions: createTask, createTaskSuccess, createTaskFailure
- NGRX effects: createTask$

## Implementation Order
1. Domain: TaskAggregate.create() + TaskCreatedDomainEvent (TDD)
2. Application: CreateTaskCommand + CreateTaskHandler (TDD)
3. Infrastructure: TaskProjection for TaskCreatedDomainEvent
4. Backend: POST /api/tasks endpoint
5. Frontend: TaskFormComponent + AddTaskPageComponent + NGRX state
