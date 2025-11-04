# Task Documentation: View Task Detail

## Use Case
UC-TASK-001-03: Review Details of a Specific Action Item (Use Case 3)

## Status
🟡 In Progress

## Implementation Steps

### 1. Verify Backend Implementation
- [ ] Confirm GetTaskByIdQuery exists
- [ ] Confirm GetTaskByIdHandler exists
- [ ] Confirm GET /api/tasks/:id endpoint exists
- [ ] Test endpoint returns complete task data with client/project names

### 2. Create TaskDetailComponent
- [x] Generate component using Nx
- [x] Set up standalone component with proper imports
- [x] Configure OnPush change detection
- [x] Set up dependency injection (Store, Router, ActivatedRoute)

### 3. Implement Component Logic
- [x] Read task ID from route parameters
- [x] Dispatch action to load task by ID
- [x] Select task from store using selectTaskById selector
- [x] Handle loading and error states
- [ ] Implement navigation methods for action buttons

### 4. Create Component Template
- [ ] Display task title as heading
- [ ] Show description/notes section
- [ ] Display status badge with color coding
- [ ] Display priority badge with color coding
- [ ] Show due date with relative time formatting
- [ ] Display overdue warning banner (if applicable)
- [ ] Show associated client with clickable link
- [ ] Show associated project with clickable link
- [ ] Display creation date
- [ ] Display last modified date
- [ ] Add action buttons (Edit, Complete, Change Status, Delete)
- [ ] Add loading spinner for loading state
- [ ] Add error message display for error state
- [ ] Add "Back to Tasks" navigation link

### 5. Implement Component Styling
- [ ] Create component styles with proper layout
- [ ] Style status badges with color coding
- [ ] Style priority badges with color coding
- [ ] Style overdue warning banner
- [ ] Style action buttons
- [ ] Ensure responsive design
- [ ] Add proper spacing and typography

### 6. Configure Routing
- [x] Add route for /tasks/:id in app routing
- [x] Ensure route uses TaskDetailComponent
- [ ] Test navigation from task list to detail page

### 7. Update Task List Component
- [ ] Ensure task cards/rows are clickable
- [ ] Add routing to task detail on click
- [ ] Test navigation flow

### 8. Testing and Refinement
- [ ] Test with task that has all properties populated
- [ ] Test with task missing optional properties (project, client)
- [ ] Test overdue task display
- [ ] Test with different statuses (Todo, In Progress, Completed, Cancelled)
- [ ] Test with different priorities (Low, Medium, High, Urgent)
- [ ] Test navigation to client detail page
- [ ] Test navigation to project detail page
- [ ] Test on mobile viewport
- [ ] Test on desktop viewport
- [ ] Test loading state
- [ ] Test error state (invalid task ID)

## Technical Notes

### Component Structure
```typescript
@Component({
  selector: 'app-task-detail',
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`,
  styles: [`...`]
})
export class TaskDetailComponent {
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  taskId = signal<string>('');
  task = this.store.selectSignal(selectTaskById(this.taskId()));
  loading = this.store.selectSignal(selectTasksLoading);

  // Methods for action buttons
  onEdit() { }
  onComplete() { }
  onChangeStatus() { }
  onDelete() { }
  onNavigateToClient() { }
  onNavigateToProject() { }
}
```

### Badge Color Coding
- **Status**:
  - Todo: blue (bg-blue-100 text-blue-800)
  - In Progress: yellow (bg-yellow-100 text-yellow-800)
  - Completed: green (bg-green-100 text-green-800)
  - Cancelled: gray (bg-gray-100 text-gray-800)

- **Priority**:
  - Low: gray (bg-gray-100 text-gray-800)
  - Medium: blue (bg-blue-100 text-blue-800)
  - High: orange (bg-orange-100 text-orange-800)
  - Urgent: red (bg-red-100 text-red-800)

### Due Date Formatting
Use a helper function to calculate relative time:
- "due today"
- "due tomorrow"
- "due in X days"
- "overdue by X days"

### Overdue Logic
A task is overdue if:
- dueDate < today
- status is Todo or InProgress (not Completed or Cancelled)

## Dependencies
- TaskReadModel with all properties
- NGRX selectors: selectTaskById, selectTasksLoading, selectTasksError
- Existing routes: /clients/:id, /projects/:id

## Blocked By
None - backend should already be implemented

## Notes
- This is a read-only view component
- Action buttons will be wired up in subsequent use cases (4, 5, 6)
- For now, action buttons can navigate to placeholder routes or show toast messages
- Focus on displaying all information clearly and professionally
