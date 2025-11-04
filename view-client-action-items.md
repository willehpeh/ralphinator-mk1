# Use Case 8: View Action Items for a Specific Client

## Status
🔄 **In Progress** - Task documentation file created

## Overview
Implement functionality to display all action items (tasks) associated with a specific client across all their projects within the client detail view.

## Implementation Tasks

### Backend Implementation
- [x] Task 1: Create GetTasksByClientIdQuery and handler (COMPLETED - query and handler created following CQRS pattern, exports added to application.ts)
- [x] Task 2: Add ITaskReadRepository.findByClientId() port interface method (COMPLETED - method added to interface at packages/application/src/lib/ports/task-read-repository.interface.ts:7)
- [x] Task 3: Implement InMemoryTaskReadRepository.findByClientId() method (COMPLETED - method added at packages/infrastructure/src/lib/read-models/in-memory-task-read-repository.ts:43-47)
- [ ] Task 4: Verify GET /api/clients/:id/tasks endpoint exists (may need to add to TasksController or ClientsController)

### Frontend Implementation
- [ ] Task 5: Verify TasksService.getTasksByClientId() method exists
- [ ] Task 6: Create NGRX actions (loadClientTasks, loadClientTasksSuccess, loadClientTasksFailure)
- [ ] Task 7: Implement TasksEffects.loadClientTasks$ effect for async API calls
- [ ] Task 8: Update tasksReducer to handle loadClientTasks actions
- [ ] Task 9: Create selectTasksByClientId(clientId) selector
- [ ] Task 10: Enhance ClientDetailComponent with Tasks section (similar to Projects section)
- [ ] Task 11: Implement task loading effect when clientId changes
- [ ] Task 12: Display task cards with title, status badge, priority badge, due date
- [ ] Task 13: Add overdue indicator for past-due incomplete tasks
- [ ] Task 14: Make task cards clickable with navigation to task detail page
- [ ] Task 15: Add "Add Task" button that pre-populates clientId
- [ ] Task 16: Implement empty state message: "No tasks yet. Add a task to get started."
- [ ] Task 17: Implement loading state with spinner
- [ ] Task 18: Implement error state with retry button
- [ ] Task 19: Apply professional styling with hover effects and responsive design

### Testing & Verification
- [ ] Task 20: Verify backend query returns correct tasks for client ID
- [ ] Task 21: Verify task cards display correctly in ClientDetailComponent
- [ ] Task 22: Verify task navigation to detail page works
- [ ] Task 23: Verify "Add Task" button pre-populates client ID correctly
- [ ] Task 24: Verify empty/loading/error states display correctly
- [ ] Task 25: Verify overdue indicator shows for past-due tasks

### Documentation
- [ ] Task 26: Update IMPLEMENTED_CASES.md with use case details
- [ ] Task 27: Archive this task file

## Acceptance Criteria
- ✅ User can view all tasks for a specific client on the client detail page
- ✅ Task cards show title, priority, status, due date, and associated project (if any)
- ✅ Overdue tasks are visually highlighted
- ✅ User can click task cards to navigate to task detail page
- ✅ "Add Task" button pre-populates client ID for new tasks
- ✅ Empty, loading, and error states are handled gracefully

## Notes
- This use case mirrors Use Case 7 (View Project Tasks) but for client context
- Backend may already have most infrastructure in place
- Focus on frontend integration with ClientDetailComponent
