# Current Use Case: Review Details of a Specific Action Item

## Use Case 3: Review Details of a Specific Action Item

**Primary Actor**: Developer or Agency Owner

**Goal**: Understand everything about a specific action item to decide what to do next

**Preconditions**:
- User has access to the task management system
- The action item exists in the system

**Main Success Scenario**:
1. User selects an action item from the list
2. System displays complete information:
   - What needs to be done (title)
   - Detailed notes about the work
   - How urgent it is (priority with visual indicator)
   - Current state (status with visual indicator)
   - Deadline (with alert if overdue)
   - Related client (with ability to navigate to client information)
   - Related project (with ability to navigate to project information)
   - When the action item was created
   - When it was last modified
3. User reviews the complete information
4. System offers available actions:
   - Modify the action item details
   - Mark the action as complete
   - Change the current state
   - Remove the action item from tracking

**Extensions**:
- 2a. If the deadline has passed and work is not complete:
  - 2a1. System prominently displays overdue warning
- 4a. If user decides to take an action:
  - 4a1. See Use Case 4 (Modify Action Item)
  - 4a2. See Use Case 5 (Update Action Item Progress)
  - 4a3. See Use Case 6 (Remove Action Item from Tracking)

**Success Guarantee**: User has complete context about the action item to make informed decisions

## Implementation Approach

This use case maps to:
- **UC-TASK-001-03: View Task Detail** in CURRENT_STORY.md
- Backend: GetTaskByIdQuery and handler (likely already implemented)
- Frontend: TaskDetailComponent (needs implementation)
- Route: /tasks/:id

## Key Requirements

### Backend (verify exists):
- ✅ GetTaskByIdQuery
- ✅ GetTaskByIdHandler
- ✅ GET /api/tasks/:id endpoint

### Frontend (to implement):
- TaskDetailComponent
- Route configuration for /tasks/:id
- Display all task properties with formatting
- Action buttons (Edit, Complete, Change Status, Delete)
- Overdue warning banner
- Links to client and project detail pages
- Professional styling with status/priority badges

### UX Considerations:
- Color-coded status badges (Todo: blue, In Progress: yellow, Completed: green, Cancelled: gray)
- Color-coded priority badges (Low: gray, Medium: blue, High: orange, Urgent: red)
- Overdue warning banner in red with warning icon
- Due date formatting ("due in 2 days", "overdue by 3 days")
- Clickable client/project names that navigate to their detail pages
- Clear action buttons with appropriate icons
- Responsive layout for mobile and desktop

## Definition of Done
- [ ] TaskDetailComponent created with proper structure
- [ ] Route configured for /tasks/:id
- [ ] All task properties displayed with proper formatting
- [ ] Status and priority badges with correct colors
- [ ] Overdue warning displayed when applicable
- [ ] Due date formatted with relative time
- [ ] Links to client and project detail pages working
- [ ] Action buttons present (Edit, Complete, Change Status, Delete)
- [ ] Loading state handled
- [ ] Error state handled (task not found)
- [ ] Responsive design works on mobile and desktop
- [ ] Navigation from task list to detail page works
- [ ] Component tested manually for all scenarios
