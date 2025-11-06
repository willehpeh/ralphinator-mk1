# Task Documentation: UC5 - Track Required Follow-Ups

## Use Case
**UC-DASHBOARD-001-05**: Track Required Follow-Ups

## Goal
Ensure no client communication falls through the cracks by tracking required follow-ups on the dashboard.

## Implementation Status: IN PROGRESS

---

## Completed Tasks

### Task 1: Create GetFollowUpCommunicationsQuery ✅
**Commit**: 17ecd13
**Date**: 2025-11-05
**Description**: Created query for retrieving follow-up communications
**Files**:
- `packages/application/src/queries/dashboard/get-follow-up-communications.query.ts`

### Task 2: Add GetFollowUpCommunicationsQueryHandler ✅
**Commit**: 9d18667
**Date**: 2025-11-05
**Description**: Implemented query handler that retrieves follow-up communications from read repository
**Files**:
- `packages/application/src/queries/handlers/dashboard/get-follow-up-communications.handler.ts`

### Task 3: Add GET /api/dashboard/communications/followups endpoint ✅
**Commit**: 652dec6
**Date**: 2025-11-05
**Description**: Created REST endpoint that executes GetFollowUpCommunicationsQuery
**Files**:
- `apps/api/src/app/dashboard/dashboard.controller.ts`

### Task 4: Add findFollowUps() to ICommunicationReadRepository ✅
**Commit**: a2c63f0
**Date**: 2025-11-05
**Description**: Extended read repository interface with method to find follow-up communications
**Files**:
- `packages/application/src/ports/communication-read-repository.interface.ts`

### Task 5: Implement findFollowUps() in InMemoryCommunicationReadRepository ✅
**Commit**: 07bcb39
**Date**: 2025-11-05
**Description**: Implemented findFollowUps() method with filtering and sorting logic
**Files**:
- `packages/infrastructure/src/read-models/in-memory-communication-read-repository.ts`

### Task 6: Add NGRX actions for follow-up communications ✅
**Commit**: 7d49fe7
**Date**: 2025-11-05
**Description**: Created actions for loading follow-up communications (load, success, failure)
**Files**:
- `apps/frontend/src/app/dashboard/store/dashboard.actions.ts`

### Task 7: Update dashboard service with getFollowUpCommunications() ✅
**Commit**: d3eaf01
**Date**: 2025-11-06
**Description**: Added getFollowUpCommunications() method to dashboard service that calls the follow-ups endpoint
**Files**:
- `apps/frontend/src/app/dashboard/dashboard.service.ts`

### Task 8: Add NGRX effects for follow-up communications ✅
**Commit**: 9baadf6
**Date**: 2025-11-06
**Description**: Created effect that calls dashboard service to load follow-up communications
**Files**:
- `apps/frontend/src/app/dashboard/store/dashboard.effects.ts`

### Task 9: Update NGRX reducer for follow-up communications ✅
**Commit**: c312317
**Date**: 2025-11-06
**Description**: Added followUpCommunications to state interface and handled load/success/failure actions in dashboard reducer
**Files**:
- `apps/frontend/src/app/dashboard/store/dashboard.reducer.ts`

---

## Pending Tasks

### Task 10: Add NGRX selectors for follow-up communications (NEXT)
**Status**: Pending
**Description**: Create selectors for follow-up communications state
**Files to create/modify**:
- `apps/frontend/src/app/dashboard/store/dashboard.selectors.ts`

### Task 11: Create FollowUpCommunicationsComponent
**Status**: Pending
**Description**: Create component to display follow-up communications with visual urgency indicators
**Files to create**:
- `apps/frontend/src/app/dashboard/follow-up-communications.component.ts`
- `apps/frontend/src/app/dashboard/follow-up-communications.component.spec.ts`

### Task 12: Integrate FollowUpCommunicationsComponent into DashboardPageComponent
**Status**: Pending
**Description**: Add follow-up communications component to dashboard page template
**Files to modify**:
- `apps/frontend/src/app/dashboard/dashboard-page.component.ts`

### Task 13: Test FollowUpCommunicationsComponent
**Status**: Pending
**Description**: Write comprehensive tests for follow-up communications component
**Files to modify**:
- `apps/frontend/src/app/dashboard/follow-up-communications.component.spec.ts`

### Task 14: Verify follow-ups integration in browser
**Status**: Pending
**Description**: Manual browser test to verify follow-ups section displays correctly with proper styling and urgency indicators

---

## Implementation Notes

### Backend Implementation
- Query handler retrieves communications where `requiresFollowUp = true` and `followUpCompletedDate IS NULL`
- Results sorted by `followUpDate` ascending (earliest first)
- Returns `CommunicationReadModel[]` with all necessary fields

### Frontend Implementation Requirements
- Display follow-ups in card format similar to recent communications
- Show type badge, subject, client name, follow-up date
- Calculate and display "days until" or "days overdue"
- Visual indicators for overdue follow-ups (red/urgent styling)
- Empty state message when no follow-ups required
- Responsive grid layout

### Visual Urgency Indicators
- Overdue: Red border/background, "OVERDUE" badge, days overdue count
- Due today: Yellow/warning styling, "DUE TODAY" badge
- Upcoming: Normal styling with days until count

---

## Dependencies
- ✅ Communication domain events (UserCreatedDomainEvent, etc.)
- ✅ Communication aggregates
- ✅ Communication read models and repositories
- ✅ Dashboard module structure
- ✅ NGRX store setup for dashboard

## Related Files
**Backend**:
- `packages/application/src/queries/dashboard/get-follow-up-communications.query.ts`
- `packages/application/src/queries/handlers/dashboard/get-follow-up-communications.handler.ts`
- `packages/application/src/ports/communication-read-repository.interface.ts`
- `packages/infrastructure/src/read-models/in-memory-communication-read-repository.ts`
- `apps/api/src/app/dashboard/dashboard.controller.ts`

**Frontend** (to be created):
- `apps/frontend/src/app/dashboard/store/dashboard.actions.ts`
- `apps/frontend/src/app/dashboard/store/dashboard.effects.ts`
- `apps/frontend/src/app/dashboard/store/dashboard.reducer.ts`
- `apps/frontend/src/app/dashboard/store/dashboard.selectors.ts`
- `apps/frontend/src/app/dashboard/dashboard.service.ts`
- `apps/frontend/src/app/dashboard/follow-up-communications.component.ts`
- `apps/frontend/src/app/dashboard/dashboard-page.component.ts`

---

## Acceptance Criteria

### AC5: Follow-Ups Required Section
- [x] Backend query retrieves communications requiring follow-up
- [x] Backend endpoint returns follow-up communications
- [x] Results sorted by follow-up date (earliest first)
- [ ] Frontend displays follow-up communications in dedicated section
- [ ] Each follow-up shows: type, subject, client name, follow-up date
- [ ] System calculates and displays days until/overdue
- [ ] Overdue follow-ups have visual indicators (red styling/badges)
- [ ] Empty state message when no follow-ups required
- [ ] Responsive layout works on mobile and desktop
