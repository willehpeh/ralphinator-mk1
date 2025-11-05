# Use Case 3: Identify Overdue Work

**Primary Actor**: Developer/Agency Owner

**Goal**: Immediately see which tasks are past their due date and require urgent attention

**Preconditions**:
- User is viewing the dashboard
- System has tasks with due dates in the past that are not completed

**Main Success Scenario**:
1. User looks at "Overdue Tasks" section on dashboard
2. System displays all overdue incomplete tasks sorted by due date (oldest first)
3. System shows for each task: title, priority, due date, days overdue, and associated project/client
4. System highlights overdue tasks with visual warning indicators
5. User identifies which overdue tasks to address immediately
6. User takes action on critical overdue items

**Extensions**:
- 2a. If no overdue tasks exist: System displays positive message indicating all tasks are on schedule
- 3a. If many tasks are overdue: System shows count of total overdue tasks in section header
- 5a. If user wants to see all tasks: User clicks "View All Tasks" link
- 6a. If user needs to update task status: User navigates to task details to mark as complete or adjust due date

**Success Guarantee**: User is aware of all overdue work and can prioritize urgent items

---

## Acceptance Criteria (from CURRENT_STORY.md - AC3)

**Given** I am viewing the dashboard
**When** I look at the "Overdue Tasks" section
**Then** I should see:
- List of tasks with due dates in the past
- Tasks with status "Todo" or "In Progress" only
- Tasks sorted by due date (oldest first)
- Each task showing: title, priority badge, due date, days overdue, project/client name
- Visual warning indicator (red/orange styling)
- Count of total overdue tasks in section header
- "View All Tasks" link to navigate to full task list
- Empty state message if no overdue tasks

## Implementation Notes

### Backend
- Already have `GetOverdueTasksQueryHandler` from backend implementation
- Query should filter tasks where:
  - `dueDate < currentDate`
  - `status IN ['Todo', 'InProgress']`
- Sort by `dueDate` ascending (oldest first)
- Calculate `daysOverdue = currentDate - dueDate`

### Frontend
- Create `OverdueTasksComponent` in `apps/frontend/src/app/features/dashboard/components/`
- Use existing dashboard NGRX state (overdue tasks selector)
- Display visual warning indicators (red/orange badges/styling)
- Show count of total overdue tasks in section header
- Calculate and display "days overdue" for each task
- Implement empty state when no overdue tasks exist
- Add "View All Tasks" navigation link

### Styling
- Use warning colors (red/orange) to indicate urgency
- Badge for priority
- Clear visual distinction from upcoming tasks
- Responsive layout
