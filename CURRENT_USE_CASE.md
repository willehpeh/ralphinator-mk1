# Use Case 4: Review Recent Client Communications

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

## Acceptance Criteria (from US-DASHBOARD-001)

### AC4: Recent Communications Section
**Given** I am viewing the dashboard
**When** I look at the "Recent Communications" section
**Then** I should see:
- List of most recent 10 communications
- Communications sorted by date (newest first)
- Each communication showing: type badge, subject, client name, contact name (if any), date
- "View All Communications" link to navigate to full communications list

### AC8: Empty States
**Given** I am viewing a dashboard section
**When** there is no data to display (e.g., no communications)
**Then** I should see a friendly empty state message indicating:
- What the section would normally show
- Suggestion to create the first item
- Link to the appropriate creation form

---

## Technical Implementation

### Backend (CQRS)

**Query Handler**: `GetRecentCommunicationsQueryHandler`
- Location: `packages/application/src/queries/dashboard/handlers/get-recent-communications.handler.ts`
- Returns: Last 10 communications sorted by date descending
- Uses: Existing `ICommunicationReadRepository`

**Query DTO**: `GetRecentCommunicationsQuery`
- Location: `packages/application/src/queries/dashboard/get-recent-communications.query.ts`
- No parameters (returns recent 10 by default)

**Read Model**: Use existing `CommunicationReadModel`
- Already defined in `packages/application/src/read-models/communication.read-model.ts`

**API Endpoint**:
```
GET /api/dashboard/communications/recent → CommunicationReadModel[]
```
- Location: `apps/api/src/app/dashboard/dashboard.controller.ts`

### Frontend (Angular + NGRX)

**Component**: `RecentCommunicationsComponent`
- Location: `apps/frontend/src/app/features/dashboard/components/recent-communications/recent-communications.component.ts`
- Displays list of recent communications with type badges
- Handles empty state
- Provides "View All Communications" link

**NGRX State**:
- Actions: `loadRecentCommunications`, `loadRecentCommunicationsSuccess`, `loadRecentCommunicationsFailure`
  - Location: `apps/frontend/src/app/store/dashboard/dashboard.actions.ts`
- Effect: Load recent communications from API on dashboard page init
  - Location: `apps/frontend/src/app/store/dashboard/dashboard.effects.ts`
- Reducer: Store recent communications array in dashboard state
  - Location: `apps/frontend/src/app/store/dashboard/dashboard.reducer.ts`
- Selector: `selectRecentCommunications`, `selectRecentCommunicationsLoading`
  - Location: `apps/frontend/src/app/store/dashboard/dashboard.selectors.ts`

**Service**:
- Add `getRecentCommunications()` method to `DashboardService`
  - Location: `apps/frontend/src/app/features/dashboard/services/dashboard.service.ts`

### Testing

**Backend Test**: `get-recent-communications.handler.spec.ts`
- Location: `packages/testing/src/tests/dashboard/queries/get-recent-communications.handler.spec.ts`
- Test cases:
  - Returns last 10 communications sorted by date descending
  - Handles empty communications list
  - Returns communications with all required fields
  - Respects limit of 10 items

**Frontend Test**: `recent-communications.component.spec.ts`
- Location: `apps/frontend/src/app/features/dashboard/components/recent-communications/recent-communications.component.spec.ts`
- Test cases:
  - Displays communications list with type badges
  - Shows empty state when no communications
  - Renders "View All Communications" link
  - Displays date in readable format

---

## Implementation Checklist

### Backend
- [ ] Create `GetRecentCommunicationsQuery` DTO
- [ ] Create `GetRecentCommunicationsQueryHandler`
- [ ] Register handler in `DashboardModule`
- [ ] Add endpoint to `DashboardController`
- [ ] Write backend tests
- [ ] Verify API endpoint works with Postman/curl

### Frontend
- [ ] Add NGRX actions for recent communications
- [ ] Add effect to load recent communications
- [ ] Update reducer to store recent communications
- [ ] Add selectors for recent communications
- [ ] Add `getRecentCommunications()` to `DashboardService`
- [ ] Create `RecentCommunicationsComponent`
- [ ] Add component to `DashboardPageComponent` template
- [ ] Write frontend tests
- [ ] Verify component displays correctly in browser

### Integration
- [ ] Test end-to-end flow (API → NGRX → Component)
- [ ] Verify empty state displays when no communications
- [ ] Verify "View All Communications" link navigates correctly
- [ ] Test responsive layout
- [ ] Verify no ESLint errors

---

## Definition of Done

- [ ] Backend query handler implemented and tested
- [ ] API endpoint created and functional
- [ ] Frontend component created and styled
- [ ] NGRX state management implemented
- [ ] Empty state displays correctly
- [ ] "View All Communications" link works
- [ ] All tests passing
- [ ] No ESLint errors
- [ ] Component integrated into dashboard page
- [ ] Acceptance criteria AC4 and AC8 validated
