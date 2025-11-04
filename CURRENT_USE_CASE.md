# Use Case 5: Update Action Item Progress

**Primary Actor**: Developer or Agency Owner

**Goal**: Track progress on an action item as work proceeds

**Preconditions**:
- User has access to the task management system
- The action item exists in the system

**Main Success Scenario**:
1. User is reviewing an action item (Use Case 3)
2. User indicates the current progress state has changed
3. User selects new state (To Do, In Progress, Completed, or Cancelled)
4. System records the state change
5. If state changed to Completed, system records when completion occurred
6. System confirms the state has been updated
7. User sees the updated state

**Extensions**:
- 2a. If user wants to quickly mark action as complete without choosing from states:
  - 2a1. User directly marks action as complete
  - 2a2. System changes state to Completed
  - 2a3. Continue at step 5

**Success Guarantee**: Action item reflects current progress state

---

## Implementation Context

This use case corresponds to **UC-TASK-001-05: Change Task Status** in the current story (US-TASK-001).

### Mapping to Technical Implementation

**Domain Layer**:
- `TaskAggregate.changeStatus()` method
- `TaskStatusChangedDomainEvent`
- `TaskStatus` enum: Todo, InProgress, Completed, Cancelled

**Application Layer**:
- `ChangeTaskStatusCommand` (taskId, newStatus)
- `ChangeTaskStatusHandler`

**API Endpoint**:
- `PATCH /api/tasks/:id/status` - Change task status

**Frontend**:
- `StatusChangeDialogComponent` - UI for selecting new status
- Task actions: `changeTaskStatus`, `markTaskComplete`
- Quick complete button for Todo/InProgress → Completed transition

**Business Rules**:
1. Status transitions should be logical (Todo → In Progress → Completed)
2. When status changes to Completed, system records completion date (`completedAt`)
3. Cancelled tasks retain their due date but are no longer considered for overdue checks
4. Quick complete action immediately sets status to Completed without showing status dialog

**Success Criteria**:
- User can change task status from any valid state to another
- Completion date is automatically recorded when status becomes Completed
- Quick complete button provides one-click completion
- Status change is reflected in task detail view and task list
- Status badge updates with correct color coding
