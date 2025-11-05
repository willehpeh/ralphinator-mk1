# Use Cases: Dashboard Overview (US-DASHBOARD-001)

## Use Case 2: Identify Upcoming Work

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

---

## Use Case 3: Identify Overdue Work

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

## Use Case 4: Review Recent Client Communications

**Primary Actor**: Developer/Agency Owner

**Goal**: Stay informed about recent client interactions and communication history

**Preconditions**:
- User is viewing the dashboard
- System has recorded communications

**Main Success Scenario**:
1. User looks at "Recent Communications" section on dashboard
2. System displays last 10 communications sorted by date (newest first)
3. System shows for each communication: type, subject, client name, contact name, and date
4. User reviews recent interactions to stay informed about client relationships
5. User identifies any communications that may need follow-up action

**Extensions**:
- 2a. If no communications exist: System displays message suggesting to log first communication
- 4a. If user wants to see all communications: User clicks "View All Communications" link
- 5a. If user wants communication details: User clicks on specific communication to see full content

**Success Guarantee**: User is informed about recent client interactions without searching through communication history

---

## Use Case 5: Track Required Follow-Ups

**Primary Actor**: Developer/Agency Owner

**Goal**: Ensure no client communication falls through the cracks by tracking required follow-ups

**Preconditions**:
- User is viewing the dashboard
- System has communications marked as requiring follow-up

**Main Success Scenario**:
1. User looks at "Follow-Ups Required" section on dashboard
2. System displays all communications requiring follow-up where follow-up is not yet completed
3. System sorts follow-ups by follow-up date (earliest first)
4. System shows for each: type, subject, client name, follow-up date, and days until/overdue
5. System highlights overdue follow-ups with visual indicators
6. User identifies which clients need to be contacted
7. User takes action to follow up with clients

**Extensions**:
- 2a. If no follow-ups are required: System displays message indicating all follow-ups are complete
- 2b. If follow-up date has passed: System shows "overdue" indicator and number of days overdue
- 6a. If user wants to see all communications: User clicks "View All Communications" link
- 7a. If user completes follow-up: User logs new communication or marks follow-up as complete

**Success Guarantee**: User knows which clients require follow-up contact and won't miss important follow-up deadlines

---

## Use Case 6: Quickly Create New Items

**Primary Actor**: Developer/Agency Owner

**Goal**: Rapidly add new clients, projects, tasks, or communications without navigating through menus

**Preconditions**:
- User is viewing the dashboard
- User needs to create a new item

**Main Success Scenario**:
1. User sees quick action buttons on dashboard
2. User identifies the type of item they want to create (client, contact, project, task, or communication)
3. User clicks the corresponding quick action button
4. System navigates to the appropriate creation form
5. User completes the form and saves the new item
6. System returns user to dashboard with updated information

**Extensions**:
- 2a. If user is unsure which item to create: User can browse available actions and select appropriate one
- 5a. If user cancels creation: System returns to dashboard without saving

**Success Guarantee**: User can create new items quickly without navigating through multiple menus

---

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

---

## Use Case 9: Start Work Session with Business Overview

**Primary Actor**: Developer/Agency Owner

**Goal**: Begin work day with comprehensive overview of business status and priorities

**Preconditions**:
- User has authenticated to the CRM
- It is the beginning of a work session

**Main Success Scenario**:
1. User navigates to CRM application (root URL)
2. System displays dashboard as the default landing page
3. System highlights "Dashboard" in main navigation
4. User reviews all dashboard sections to understand:
   - Current business health (active clients and projects)
   - Urgent items (overdue tasks and follow-ups)
   - Upcoming work (tasks due soon)
   - Recent activity (communications)
5. User identifies priorities for the work session
6. User uses quick actions or navigation to begin work on priority items

**Extensions**:
- 3a. If user navigates away and returns: User clicks "Dashboard" link to return to overview
- 5a. If no urgent items exist: User can proactively plan future work or create new items
- 6a. If user wants to focus on specific area: User navigates to detailed views (tasks, projects, etc.)

**Success Guarantee**: User starts work session fully informed about business status and knows what to prioritize

---

## Use Case 10: Understand Empty or New System

**Primary Actor**: Developer/Agency Owner (New User)

**Goal**: Understand what dashboard sections are for and how to populate them when starting with empty system

**Preconditions**:
- User is viewing dashboard
- System has little or no data in one or more sections

**Main Success Scenario**:
1. User views dashboard section with no data
2. System displays friendly empty state message explaining:
   - What the section normally displays
   - Suggestion to create the first item
3. System provides link to appropriate creation form
4. User understands what the section is for
5. User clicks link to create their first item
6. System navigates to creation form
7. User creates item and returns to dashboard
8. System displays the newly created item in appropriate section

**Extensions**:
- 4a. If user doesn't want to create item yet: User continues reviewing other dashboard sections
- 7a. If user cancels creation: User returns to dashboard with empty state still showing

**Success Guarantee**: User understands what each dashboard section displays and knows how to populate it with data
