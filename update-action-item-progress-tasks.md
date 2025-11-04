# Use Case 5: Update Action Item Progress - Task Tracking

**Use Case**: UC5 - Update Action Item Progress
**Story**: US-TASK-001 (Basic Task Management)

---

## Tasks Completed

###  Task 1: Create TaskStatusChangedDomainEvent
**Status**: Completed
**Commit**: 811527c
**Files Created**:
- `packages/domain/src/lib/events/task-status-changed.domain-event.ts`

**Files Modified**:
- `packages/domain/src/lib/constants/task-event-types.ts` - Added STATUS_CHANGED constant
- `packages/domain/src/index.ts` - Exported new event

**Description**: Created domain event to represent task status changes. Event includes:
- `newStatus`: The updated task status (Todo, InProgress, Completed, or Cancelled)
- `completedAt`: Timestamp when task was completed (null for non-completed statuses)

###  Task 2: Add changeStatus() method to TaskAggregate
**Status**: Completed
**Commit**: (pending)
**Files Modified**:
- `packages/domain/src/lib/aggregates/task.aggregate.ts`

**Description**: Implemented status change business logic in the aggregate:
- Added `completedAt: Date | null` field to aggregate state
- Added `changeStatus(newStatus: TaskStatus)` command method
- Automatically sets `completedAt` timestamp when status becomes 'Completed'
- Registered `onTaskStatusChanged()` event handler in constructor
- Implemented `onTaskStatusChanged()` to apply status and completedAt changes
- Added `getCompletedAt()` getter method
- Follows event sourcing pattern with event application

---

## Tasks Remaining

### Domain Layer
- [x] Add `changeStatus()` method to TaskAggregate
- [x] Register TaskStatusChangedDomainEvent handler in TaskAggregate
- [x] Add `completedAt` field to TaskAggregate state
- [x] Add `getCompletedAt()` getter to TaskAggregate

### Application Layer
- [ ] Create ChangeTaskStatusCommand
- [ ] Create ChangeTaskStatusHandler
- [ ] Add tests for ChangeTaskStatusHandler

### Infrastructure Layer
- [ ] Create TaskStatusChangedProjection event handler
- [ ] Update task read model with completedAt field

### API Layer
- [ ] Create PATCH /api/tasks/:id/status endpoint
- [ ] Add DTO validation for status change request

### Frontend Layer
- [ ] Create status change UI component/dialog
- [ ] Add task action for changeTaskStatus
- [ ] Add quick complete button
- [ ] Wire up status change to API endpoint
- [ ] Update task detail view to show status
- [ ] Update task list to show status badges

---

## Notes
- Following TDD approach: Will write tests before implementing handlers
- Status transitions: Any status � Any other status (no restrictions at domain level)
- Business rule: completedAt is set automatically when status becomes 'Completed'
- Quick complete feature: One-click transition to Completed status
