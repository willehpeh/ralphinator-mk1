# US-DASHBOARD-001: Complete Dashboard Overview with Activity Summary

**Story**: As a software developer or agency owner, I want to see a comprehensive dashboard overview when I access the CRM so that I can quickly understand my current workload, identify urgent items, and access the most important information at a glance without navigating through multiple sections.

## Business Value

The dashboard serves as the central command center for the CRM, providing immediate visibility into:
- Overall business health (active clients/projects count)
- Work urgency (upcoming and overdue tasks)
- Communication follow-ups that require attention
- Recent activity across all entities
- Quick access to common actions

This eliminates the need to navigate through multiple screens to understand current status and priorities.

## Acceptance Criteria

### AC1: Dashboard Statistics Cards
**Given** I am on the dashboard
**When** the page loads
**Then** I should see summary cards displaying:
- Total number of active clients (status = "Active")
- Total number of active projects (status = "Active")
- Total number of pending tasks (status = "Todo" or "In Progress")
- Total number of communications requiring follow-up

### AC2: Upcoming Tasks Section
**Given** I am viewing the dashboard
**When** I look at the "Upcoming Tasks" section
**Then** I should see:
- List of tasks that are not completed or cancelled
- Tasks sorted by due date (earliest first)
- Limited to next 10 tasks
- Each task showing: title, priority badge, due date, project/client name
- Visual indicator for overdue tasks (past due date)
- "View All Tasks" link to navigate to full task list

### AC3: Overdue Tasks Section
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

### AC4: Recent Communications Section
**Given** I am viewing the dashboard
**When** I look at the "Recent Communications" section
**Then** I should see:
- List of most recent 10 communications
- Communications sorted by date (newest first)
- Each communication showing: type badge, subject, client name, contact name (if any), date
- "View All Communications" link to navigate to full communications list

### AC5: Follow-Ups Required Section
**Given** I am viewing the dashboard
**When** I look at the "Follow-Ups Required" section
**Then** I should see:
- List of communications flagged for follow-up where follow-up is not yet completed
- Communications sorted by follow-up date (earliest first)
- Each communication showing: type badge, subject, client name, follow-up date, days until/overdue
- Visual indicator for overdue follow-ups (past follow-up date)
- Count of total follow-ups required in section header
- "View All Communications" link
- Empty state message if no follow-ups required

### AC6: Quick Actions
**Given** I am viewing the dashboard
**When** I want to perform common actions
**Then** I should see quick action buttons:
- "Add Client" - navigates to add client form
- "Add Contact" - navigates to add contact form
- "Add Project" - navigates to add project form
- "Add Task" - navigates to add task form
- "Log Communication" - navigates to add communication form

### AC7: Dashboard Route and Navigation
**Given** I access the application
**When** I navigate to the root URL or click "Dashboard" in the main navigation
**Then** I should see the dashboard as the default landing page
**And** the "Dashboard" link should be highlighted in the navigation

### AC8: Empty States
**Given** I am viewing a dashboard section
**When** there is no data to display (e.g., no tasks, no communications)
**Then** I should see a friendly empty state message indicating:
- What the section would normally show
- Suggestion to create the first item
- Link to the appropriate creation form

### AC9: Real-Time Updates
**Given** I am viewing the dashboard
**When** I create, update, or delete an entity (client, project, task, communication)
**Then** the dashboard statistics and lists should update automatically to reflect the changes without requiring a page refresh

### AC10: Responsive Layout
**Given** I am viewing the dashboard on different screen sizes
**When** the viewport changes
**Then** the dashboard should:
- Display statistics cards in a responsive grid (4 columns desktop, 2 columns tablet, 1 column mobile)
- Stack sections vertically on smaller screens
- Maintain readability and usability across all viewport sizes

## Technical Requirements

### Backend (CQRS Queries)

**Query Handlers** (packages/application/src/queries/dashboard/handlers/):
1. `GetDashboardStatisticsQueryHandler`
   - Returns counts: activeClients, activeProjects, pendingTasks, followUpsRequired

2. `GetUpcomingTasksQueryHandler`
   - Returns next 10 non-completed tasks sorted by due date

3. `GetOverdueTasksQueryHandler`
   - Returns overdue tasks (due date < today, status = Todo/InProgress)

4. `GetRecentCommunicationsQueryHandler`
   - Returns last 10 communications sorted by date descending

5. `GetFollowUpCommunicationsQueryHandler`
   - Returns communications requiring follow-up sorted by follow-up date

**Query DTOs** (packages/application/src/queries/dashboard/):
- `GetDashboardStatisticsQuery`
- `GetUpcomingTasksQuery`
- `GetOverdueTasksQuery`
- `GetRecentCommunicationsQuery`
- `GetFollowUpCommunicationsQuery`

**Read Models** (packages/application/src/read-models/):
- `DashboardStatisticsReadModel`
- Reuse existing: `TaskReadModel`, `CommunicationReadModel`

**API Endpoints** (apps/api/src/app/dashboard/):
```
GET /api/dashboard/statistics          → DashboardStatisticsReadModel
GET /api/dashboard/tasks/upcoming      → TaskReadModel[]
GET /api/dashboard/tasks/overdue       → TaskReadModel[]
GET /api/dashboard/communications/recent → CommunicationReadModel[]
GET /api/dashboard/communications/followups → CommunicationReadModel[]
```

**Module Registration**:
- Create `DashboardModule` in apps/api/src/app/dashboard/
- Register all query handlers
- Register DashboardController
- Import into AppModule

### Frontend (Angular + NGRX)

**Components** (apps/frontend/src/app/features/dashboard/):
1. `DashboardPageComponent` - Container component
2. `StatisticsCardsComponent` - Summary statistics cards
3. `UpcomingTasksComponent` - Upcoming tasks list
4. `OverdueTasksComponent` - Overdue tasks list with warnings
5. `RecentCommunicationsComponent` - Recent communications list
6. `FollowUpCommunicationsComponent` - Follow-ups required list
7. `QuickActionsComponent` - Quick action buttons
8. `EmptyStateComponent` - Reusable empty state display

**NGRX State** (apps/frontend/src/app/store/dashboard/):
- `dashboard.actions.ts` - Actions for loading dashboard data
- `dashboard.effects.ts` - Effects to fetch data from API
- `dashboard.reducer.ts` - Dashboard state slice
- `dashboard.selectors.ts` - Selectors for dashboard data

**Routing**:
- Update app.routes.ts to set dashboard as default route ('/')
- Add dashboard link to main navigation
- Ensure navigation highlights active route

**Styling**:
- Professional card-based layout
- Responsive grid system
- Color-coded badges (status, priority, type)
- Visual indicators for overdue/urgent items
- Consistent spacing and typography

## Dependencies

**Existing Functionality Required**:
- ✅ Client read models and queries (US-CLIENT-001)
- ✅ Project read models and queries (US-PROJECT-002)
- ✅ Task read models and queries (US-TASK-001)
- ✅ Communication read models and queries (US-COMMUNICATION-001)
- ✅ All NGRX stores for clients, projects, tasks, communications

**No New Aggregates or Events Required**: This story only involves querying existing read models.

## Testing Requirements

### Backend Tests (packages/testing/src/tests/dashboard/):
1. `get-dashboard-statistics.handler.spec.ts`
2. `get-upcoming-tasks.handler.spec.ts`
3. `get-overdue-tasks.handler.spec.ts`
4. `get-recent-communications.handler.spec.ts`
5. `get-followup-communications.handler.spec.ts`

**Test Coverage**:
- Statistics calculation correctness
- Task filtering and sorting logic
- Date comparisons (overdue, upcoming)
- Follow-up filtering logic
- Empty result handling
- Edge cases (all completed, no data, etc.)

### Frontend Tests:
- Component rendering with mock data
- Empty state display when no data
- Navigation to detail pages
- Quick action button functionality
- Responsive layout behavior

## Definition of Done

- [ ] All backend query handlers implemented and tested
- [ ] All API endpoints created and tested
- [ ] All frontend components created and styled
- [ ] NGRX state management for dashboard implemented
- [ ] Dashboard route configured as default landing page
- [ ] Navigation updated with "Dashboard" link
- [ ] Responsive design works on all screen sizes
- [ ] Empty states display correctly
- [ ] Quick actions navigate to correct pages
- [ ] All acceptance criteria validated
- [ ] No ESLint errors or warnings
- [ ] Code follows project architecture (Clean Architecture + CQRS)
- [ ] All tests passing
- [ ] Documentation updated

## Out of Scope

- Real-time WebSocket updates (will use standard HTTP polling via NGRX effects)
- Dashboard customization/personalization
- Date range filtering for dashboard data
- Chart/graph visualizations (future enhancement)
- Export dashboard data
- Email notifications for overdue items

## Implementation Notes

### Query Optimization
- Dashboard queries should be optimized for read performance
- Consider caching frequently accessed statistics
- Use existing read model repositories (no need for new projections)

### Date Calculations
- "Overdue" = due date < current date AND status in [Todo, InProgress]
- "Upcoming" = due date >= current date AND status in [Todo, InProgress]
- "Days overdue" = current date - due date
- Handle null due dates gracefully

### UI/UX Considerations
- Use loading skeletons while data is fetching
- Show friendly messages when sections are empty
- Use color coding: green (ok), yellow (warning/upcoming), red (overdue/urgent)
- Ensure all interactive elements have hover states
- Add tooltips where helpful

## Success Metrics

**This story is complete when**:
1. Users can see their current workload at a glance
2. Users can identify overdue tasks and follow-ups immediately
3. Users can access common actions quickly from the dashboard
4. Users can navigate to detailed views with one click
5. The dashboard updates automatically when underlying data changes
6. All acceptance criteria are met and tested

## Project Completion

**Note**: This is the FINAL user story for the Developer CRM project. Upon completion of this story, all requirements from PROMPT.md will be fulfilled:

1. ✅ Manage Clients (US-CLIENT-001)
2. ✅ Manage Contacts (US-CONTACT-001)
3. ✅ Manage Projects (US-PROJECT-001, US-PROJECT-002)
4. ✅ Manage Tasks (US-TASK-001)
5. ✅ Log Communications (US-COMMUNICATION-001)
6. ⏳ View Dashboard (US-DASHBOARD-001) ← THIS STORY

After implementing US-DASHBOARD-001, the project will satisfy all success criteria:
- ✅ Manage complete client list
- ✅ Track all contacts at client companies
- ✅ Monitor project status and progress
- ✅ Organize tasks and identify what's due
- ✅ Maintain history of all client communications
- ✅ Navigate easily between related information
- ✅ Access everything through both API and web interface
