# Use Case 7: View Action Items for a Specific Project

**Primary Actor**: Developer or Agency Owner

**Goal**: See all action items related to a specific project to understand what needs to be done for that project

**Preconditions**:
- User has access to the task management system
- The project exists in the system

**Main Success Scenario**:
1. User is reviewing project information (from project management features)
2. System displays section showing action items for this project
3. System lists all action items associated with the project with:
   - What needs to be done (title)
   - How urgent it is (priority with visual indicator)
   - Current state (status with visual indicator)
   - When it's due (deadline with alert if overdue)
4. User reviews project-specific action items
5. User can navigate to any action item for full details (Use Case 3)

**Extensions**:
- 2a. If no action items exist for this project:
  - 2a1. System displays message indicating no action items for this project
  - 2a2. System offers option to record a new action item for this project
- 4a. If user wants to add action item for this project:
  - 4a1. User requests to add new action item
  - 4a2. System starts Use Case 1 with project pre-selected

**Success Guarantee**: User sees all action items specific to the project

---

## Implementation Alignment

This use case corresponds to **UC-TASK-001-07: View Project Tasks** from the current story (US-TASK-001).

### Technical Requirements

**Backend**:
- Query: GetTasksByProjectIdQuery (accepts projectId)
- Query Handler: GetTasksByProjectIdQueryHandler
- Repository Method: ITaskReadRepository.findByProjectId(projectId)
- API Endpoint: GET /api/projects/:id/tasks

**Frontend**:
- Integration point: ProjectDetailComponent (/projects/:id)
- Display component: Task list section showing project tasks
- Task cards with: title, status badge, priority badge, due date (with overdue indicator)
- Empty state: "No tasks yet. Add a task to get started."
- "Add Task" button with project pre-selected
- Click navigation to task detail page (Use Case 3)

### Business Rules
- Only tasks with matching projectId are displayed
- Tasks are displayed regardless of status (Todo, InProgress, Completed, Cancelled)
- Overdue tasks (due date < today AND status != Completed/Cancelled) should be visually highlighted
- Task list should be sorted by: priority (desc), due date (asc)
