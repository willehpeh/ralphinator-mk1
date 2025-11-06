# Task Documentation: Track Required Follow-Ups (UC-DASHBOARD-001-05)

**Use Case**: Track Required Follow-Ups
**Status**: In Progress
**Started**: 2025-11-05
**Completed**: [Date to be filled]

## Objective
Implement the "Follow-Ups Required" section on the dashboard to help users track communications that need follow-up action, ensuring no client communication falls through the cracks.

## Tasks

### Backend Implementation

**Task 1**: [x] Create GetFollowUpCommunicationsQuery (2025-11-05) - Commit: 17ecd13
**Task 2**: [x] Create GetFollowUpCommunicationsQueryHandler (2025-11-05) - Commit: 9d18667
**Task 3**: [x] Add findFollowUps() method to ICommunicationReadRepository (2025-11-05) - Commit: a2c63f0
**Task 4**: [x] Implement findFollowUps() in InMemoryCommunicationReadRepository (2025-11-05) - Filters for requiresFollowUp=true with followUpDate, sorts by followUpDate ascending
**Task 5**: [x] Register query handler in DashboardModule (2025-11-05) - Commit: 652dec6
**Task 6**: [x] Add GET /api/dashboard/communications/followups endpoint to DashboardController (2025-11-05) - Commit: 652dec6
**Task 7**: [x] Write comprehensive backend tests for query handler (2025-11-05) - Commit: 291adc8

### Frontend Implementation

**Task 8**: [x] Create NGRX actions for follow-up communications (2025-11-05) - Commit: 7d49fe7
**Task 9**: [x] Add getFollowUpCommunications() method to DashboardService (2025-11-05) - Commit: d3eaf01
**Task 10**: [x] Create DashboardEffects for loading follow-up communications (2025-11-05) - Commit: 9baadf6
**Task 11**: [x] Update dashboardReducer with followUpCommunications state (2025-11-05) - Commit: c312317
**Task 12**: [x] Create selectors for follow-up communications (2025-11-05) - Commit: 6c11549
**Task 13**: [x] Create FollowUpCommunicationsComponent (2025-11-06) - Commit: 6defa44
**Task 14**: [x] Implement visual urgency indicators (overdue highlighting) (2025-11-06) - Included in Task 13
**Task 15**: [x] Implement days until/overdue calculation (2025-11-06) - Included in Task 13
**Task 16**: [x] Add empty state for when no follow-ups are required (2025-11-06) - Included in Task 13
**Task 17**: [ ] Integrate FollowUpCommunicationsComponent into DashboardPageComponent
**Task 18**: [ ] Write comprehensive frontend component tests
**Task 19**: [ ] Verify API endpoint with manual testing
**Task 20**: [ ] Verify component integration in browser

## Acceptance Criteria (from AC5)
- [ ] List displays all communications with requiresFollowUp=true where follow-up is not completed
- [ ] Communications sorted by follow-up date (earliest first)
- [ ] Each item shows: type badge, subject, client name, follow-up date, days until/overdue
- [ ] Visual indicator for overdue follow-ups (past follow-up date)
- [ ] Count of total follow-ups in section header
- [ ] "View All Communications" link provided
- [ ] Empty state message when no follow-ups required

## Implementation Notes
- Follow-up is "overdue" if followUpDate < current date
- Days until = followUpDate - current date (positive number)
- Days overdue = current date - followUpDate (positive number)
- Use strong visual indicators (orange/red) for overdue follow-ups
- Provide reassuring message when all follow-ups are complete

## Definition of Done
- [ ] All tasks completed
- [ ] Backend tests passing
- [ ] Frontend tests passing
- [ ] API endpoint verified
- [ ] Component renders correctly in browser
- [ ] Empty state displays correctly
- [ ] Overdue highlighting works correctly
- [ ] No ESLint errors
- [ ] Code follows Clean Architecture + CQRS patterns
