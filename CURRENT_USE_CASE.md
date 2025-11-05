# Use Case 2: Identify Upcoming Work

**Primary Actor**: Developer/Agency Owner

**Goal**: See what tasks need attention in the near future to plan work effectively

**Preconditions**:
- User is viewing the dashboard
- System has tasks with due dates

**Main Success Scenario**:
1. User looks at "Upcoming Tasks" section on dashboard
2. System displays next 10 incomplete tasks sorted by due date (earliest first)
3. System shows for each task: title, priority, due date, and associated project/client
4. User reviews upcoming tasks to plan their work
5. User identifies which tasks to prioritize

**Extensions**:
- 2a. If no upcoming tasks exist: System displays friendly message indicating no pending tasks
- 4a. If user wants to see all tasks: User clicks "View All Tasks" link and system navigates to full task list
- 5a. If user wants task details: User clicks on a specific task to view complete information

**Success Guarantee**: User knows what work is coming up and can plan accordingly
