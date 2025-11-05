# Task Documentation: Track Required Follow-Ups (UC-DASHBOARD-001-05)

**Use Case**: Track Required Follow-Ups
**Status**: In Progress
**Started**: 2025-11-05
**Completed**: [Date to be filled]

## Objective
Implement the "Follow-Ups Required" section on the dashboard to help users track communications that need follow-up action, ensuring no client communication falls through the cracks.

## Tasks

### Backend Implementation

**Task 1**: [x] Create GetFollowUpCommunicationsQuery (2025-11-05)
**Task 2**: [x] Create GetFollowUpCommunicationsQueryHandler (2025-11-05)
**Task 3**: [x] Add findFollowUps() method to ICommunicationReadRepository (2025-11-05)
**Task 4**: [ ] Implement findFollowUps() in InMemoryCommunicationReadRepository
**Task 5**: [ ] Register query handler in DashboardModule
**Task 6**: [ ] Add GET /api/dashboard/communications/followups endpoint to DashboardController
**Task 7**: [ ] Write comprehensive backend tests for query handler

### Frontend Implementation

**Task 8**: [ ] Create NGRX actions for follow-up communications
**Task 9**: [ ] Add getFollowUpCommunications() method to DashboardService
**Task 10**: [ ] Create DashboardEffects for loading follow-up communications
**Task 11**: [ ] Update dashboardReducer with followUpCommunications state
**Task 12**: [ ] Create selectors for follow-up communications
**Task 13**: [ ] Create FollowUpCommunicationsComponent
**Task 14**: [ ] Implement visual urgency indicators (overdue highlighting)
**Task 15**: [ ] Implement days until/overdue calculation
**Task 16**: [ ] Add empty state for when no follow-ups are required
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
