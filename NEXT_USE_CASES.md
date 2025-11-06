# Use Cases: Dashboard Overview (US-DASHBOARD-001)

## Use Case 7: Monitor Business Activity Across Devices

**Primary Actor**: Developer/Agency Owner

**Goal**: Access dashboard overview from any device (desktop, tablet, mobile) while maintaining usability

**Preconditions**:
- User is authenticated
- User accesses dashboard from various screen sizes

**Main Success Scenario**:
1. User opens dashboard on their device
2. System detects viewport size
3. System arranges dashboard sections appropriately for screen size:
   - Desktop: 4-column grid for statistics, side-by-side sections
   - Tablet: 2-column grid for statistics, stacked sections
   - Mobile: Single column layout for all content
4. User can read and interact with all dashboard content on their device
5. User can perform all dashboard actions regardless of screen size

**Extensions**:
- 1a. If user rotates device: System adjusts layout to new orientation
- 4a. If content is difficult to read: System maintains readable text sizes and touch-friendly buttons

**Success Guarantee**: User can effectively use the dashboard on any device size

---

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

