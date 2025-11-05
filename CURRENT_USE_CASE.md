# Use Case 5: Track Required Follow-Ups (UC-DASHBOARD-001-05)

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

**Related Acceptance Criteria**: AC5 (Follow-Ups Required Section)

**Dependencies**:
- Communication read models and infrastructure (already implemented)
- Communications with requiresFollowUp and followUpDate fields (already in schema)

**Implementation Scope**:
- Backend: GetFollowUpCommunicationsQuery and handler
- Backend: ICommunicationReadRepository.findFollowUps() method
- Backend: Dashboard API endpoint: GET /api/dashboard/communications/followups
- Frontend: NGRX actions, effects, reducer, and selectors for follow-up communications
- Frontend: FollowUpCommunicationsComponent with visual urgency indicators
- Frontend: Integration into DashboardPageComponent

**Out of Scope**:
- Marking follow-ups as complete (will be handled in future communication management features)
- Email/push notifications for overdue follow-ups
- Snoozing or rescheduling follow-ups
