# Use Case 1: View Current Workload at a Glance

**Primary Actor**: Developer/Agency Owner

**Goal**: Quickly understand current business status and workload without navigating through multiple sections

**Preconditions**:
- User is authenticated and has access to the CRM
- System has client, project, task, and communication data

**Main Success Scenario**:
1. User opens the CRM application
2. System displays dashboard with summary statistics showing:
   - Number of active clients
   - Number of active projects
   - Number of pending tasks
   - Number of communications requiring follow-up
3. User reviews the statistics to understand current workload
4. User sees overall business health at a glance

**Extensions**:
- 2a. If no data exists yet: System displays empty state with suggestions to add first items
- 3a. If user wants details on any metric: User clicks on corresponding section to see detailed view

**Success Guarantee**: User understands their current business status and workload volume without navigating to other pages

---

## Implementation Scope

This use case maps to **AC1: Dashboard Statistics Cards** from US-DASHBOARD-001.

### Backend Requirements:
- Create `GetDashboardStatisticsQuery` and handler
- Create `DashboardStatisticsReadModel` with fields:
  - `activeClientsCount`
  - `activeProjectsCount`
  - `pendingTasksCount`
  - `followUpsRequiredCount`
- Create API endpoint: `GET /api/dashboard/statistics`
- Create `DashboardModule` and `DashboardController`

### Frontend Requirements:
- Create `DashboardPageComponent` (container)
- Create `StatisticsCardsComponent` (presentation)
- Set up NGRX state management for dashboard
- Configure route '/' to display dashboard
- Update navigation with "Dashboard" link

### Testing:
- Test statistics calculation correctness
- Test with empty database
- Test with various data combinations
- Test component rendering with mock data
