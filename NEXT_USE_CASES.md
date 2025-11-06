# Use Cases: Dashboard Overview (US-DASHBOARD-001)

## Use Case 8: See Updated Information After Making Changes

**Primary Actor**: Developer/Agency Owner

**Goal**: Have dashboard reflect current state after creating, updating, or deleting items

**Preconditions**:
- User is viewing the dashboard
- User makes changes to clients, projects, tasks, or communications

**Main Success Scenario**:
1. User performs an action that affects dashboard data (creates, updates, or deletes an item)
2. System automatically updates dashboard statistics and lists
3. User sees updated information without manually refreshing the page
4. User confirms their action had the expected effect on business metrics

**Extensions**:
- 2a. If update is in progress: System shows loading indicators while refreshing data
- 4a. If user expected different result: User can navigate to detail views to investigate

**Success Guarantee**: Dashboard always displays current, accurate information reflecting latest changes

