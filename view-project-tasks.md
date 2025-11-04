# View Project Tasks - Implementation Tasks

## Status: In Progress

## Use Case
Use Case 7: View Action Items for a Specific Project (UC-TASK-001-07)

## Overview
Implement the ability to view all tasks associated with a specific project within the project detail page. This provides users with context about what action items are related to each project.

## Tasks

### Backend Implementation
- [x] Task 1: Create GetTasksByProjectIdQuery in packages/application/src/queries/ (commit: 2ee8881)
- [x] Task 2: Create GetTasksByProjectIdQueryHandler in packages/application/src/queries/handlers/ (commit: a51e5ce)
- [x] Task 3: Add findByProjectId(projectId: string) method to ITaskReadRepository interface (commit: e3a9569)
- [x] Task 4: Implement findByProjectId() in InMemoryTaskReadRepository (packages/infrastructure/) (commit: ec45ece)
- [x] Task 5: Add GET /api/projects/:id/tasks endpoint to AllProjectsController (commit: a29732d)
- [x] Task 6: Test backend endpoint with curl to verify data retrieval (commit: 45992b7)

### Frontend Implementation
- [x] Task 7: Add getTasksByProjectId(projectId: string) method to TasksService (commit: bff8173)
- [x] Task 8: Create NGRX actions (loadProjectTasks, loadProjectTasksSuccess, loadProjectTasksFailure) (commit: cac5c7a)
- [x] Task 9: Create NGRX effect to handle loadProjectTasks action with API call (commit: 51372f2)
- [x] Task 10: Update tasksReducer to handle project tasks loading state (commit: 5b485ef)
- [x] Task 11: Create NGRX selector selectTasksByProjectId(projectId) for querying tasks by project (commit: 012bcfa)
- [x] Task 12: Update ProjectDetailComponent to dispatch loadProjectTasks action on init (commit: c59a90b)
- [ ] Task 13: Add Tasks section to ProjectDetailComponent template
- [ ] Task 14: Display task list with cards showing title, status badge, priority badge, due date
- [ ] Task 15: Add color-coded status badges (Todo=blue, InProgress=yellow, Completed=green, Cancelled=gray)
- [ ] Task 16: Add color-coded priority badges (Low=gray, Medium=blue, High=orange, Urgent=red)
- [ ] Task 17: Add overdue indicator (red "OVERDUE" label) for tasks past due date
- [ ] Task 18: Implement empty state message "No tasks yet. Add a task to get started."
- [ ] Task 19: Add "Add Task" button that navigates to /tasks/add with projectId pre-populated
- [ ] Task 20: Make task cards clickable to navigate to task detail page (/tasks/:id)
- [ ] Task 21: Add professional styling with hover effects for task cards
- [ ] Task 22: Add loading state spinner while fetching tasks
- [ ] Task 23: Add error state handling with user-friendly error messages

### Testing & Verification
- [ ] Task 24: Verify backend query returns only tasks for specified projectId
- [ ] Task 25: Verify task list displays correctly in ProjectDetailComponent
- [ ] Task 26: Test navigation from task card to task detail page
- [ ] Task 27: Test "Add Task" button pre-populates project field
- [ ] Task 28: Verify overdue tasks are visually highlighted
- [ ] Task 29: Verify empty state displays when project has no tasks
- [ ] Task 30: Test responsive design on mobile and desktop

## Acceptance Criteria
- [ ] User viewing a project detail page sees a "Tasks" section
- [ ] Section displays all tasks associated with that specific project
- [ ] Each task shows title, status badge, priority badge, and due date
- [ ] Overdue tasks are visually highlighted with red indicator
- [ ] User can click any task card to navigate to task detail page
- [ ] Empty state message displays when project has no tasks
- [ ] "Add Task" button navigates to task creation form with project pre-selected
- [ ] Task list is sorted by priority (desc) and due date (asc)

## Dependencies
- Use Case 1 (Create Task) - already implemented
- Use Case 2 (View All Tasks) - already implemented
- Use Case 3 (View Task Detail) - already implemented
- ProjectDetailComponent must exist (Use Case 3: View Detailed Information About a Project) - already implemented

## Notes
- This follows the same pattern as contacts embedded in ClientDetailComponent
- Tasks should be displayed in a card layout similar to other list views
- Consider reusing task card styles from TaskListComponent if possible
- The "Add Task" button should pre-populate both projectId AND clientId (from project's client)
