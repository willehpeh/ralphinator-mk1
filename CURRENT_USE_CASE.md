# Use Case 1: Record New Client Interaction

**Primary Actor**: Developer/Agency Owner

**Goal**: Document a client interaction in the system so that there is a permanent record of what was discussed and any follow-up actions required

**Preconditions**:
- At least one client exists in the system
- User is authenticated

**Main Success Scenario**:
1. User indicates they want to record a new communication
2. System presents a form to capture interaction details
3. User enters what type of interaction occurred (call, email, meeting, chat, or other)
4. User provides a brief description of the topic discussed
5. User specifies when the interaction took place
6. User describes what was discussed or agreed upon in notes
7. User indicates which client the interaction was with
8. User optionally specifies which contact person at the client was involved
9. User optionally specifies which project the interaction relates to
10. User indicates whether a follow-up action is needed
11. System validates that all required information is complete
12. System saves the interaction record
13. System confirms the interaction has been recorded
14. System shows the complete interaction details

**Extensions**:
- 10a. If follow-up is required:
  - 10a1. User specifies when the follow-up should occur
  - 10a2. System validates the follow-up date is in the future
- 11a. If communication date is in the future:
  - 11a1. System rejects the entry and asks user to correct the date
- 11b. If contact person is specified but doesn't belong to the selected client:
  - 11b1. System rejects the entry and asks user to select a contact from the correct client
- 11c. If project is specified but doesn't belong to the selected client:
  - 11c1. System rejects the entry and asks user to select a project from the correct client

**Success Guarantee**: A complete record of the client interaction is stored in the system with all relevant details and any follow-up requirements are tracked

---

## Implementation Mapping to CURRENT_STORY.md

This use case maps to **UC-COMMUNICATION-001-01: Create a New Communication** in the current story, which has been fully implemented (✅).

### Domain Layer Components
- CommunicationAggregate with create() method
- CommunicationCreatedDomainEvent

### Application Layer Components
- CreateCommunicationCommand
- CreateCommunicationCommandHandler

### Infrastructure Layer Components
- Event store for persisting events
- CommunicationProjection for building read model

### API Layer Components
- POST /api/communications endpoint

### Frontend Components
- CommunicationFormComponent
- "Add Communication" functionality in client/contact/project detail views
- NGRX actions, effects, reducers

### Business Rules Implemented
- Subject must not be empty
- Notes must not be empty
- Communication date cannot be in the future
- If contact is selected, it must belong to the selected client
- If project is selected, it must belong to the selected client
- If follow-up required = true, follow-up date must be provided and must be in the future
- Communication type must be one of: Call, Email, Meeting, Chat, Other

### Status
✅ **IMPLEMENTED** - All acceptance criteria met in CURRENT_STORY.md
