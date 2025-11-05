# US-COMMUNICATION-001: Complete Communication Management CRUD Operations

**Story**: As a software developer or agency owner, I want to create, update, view, and manage communication records (calls, emails, meetings, etc.) associated with clients, contacts, and projects so that I can maintain a complete history of all interactions, track follow-up requirements, and ensure nothing falls through the cracks.

**Priority**: High (Core functionality, required before Dashboard implementation)

**Dependencies**:
- Clients Management (US-CLIENT-001) ✅ Completed
- Contacts Management (US-CONTACT-001) ✅ Completed
- Projects Management (US-PROJECT-002) ✅ Completed

## Use Cases to Implement

### UC-COMMUNICATION-001-01: Create a New Communication
**Actor**: Developer/Agency Owner
**Preconditions**: At least one client exists in the system
**Flow**:
1. User navigates to "Add Communication" page or clicks "Log Communication" from client/contact/project detail
2. User fills in communication form:
   - Communication type (Call, Email, Meeting, Chat, Other) - REQUIRED
   - Subject/Title - REQUIRED
   - Date and time - REQUIRED
   - Duration (optional)
   - Notes/Summary - REQUIRED
   - Client - REQUIRED (pre-selected if coming from client detail)
   - Contact - OPTIONAL (dropdown filtered by selected client)
   - Project - OPTIONAL (dropdown filtered by selected client)
   - Follow-up required? - BOOLEAN (default: false)
   - Follow-up date - CONDITIONAL (required if follow-up required = true)
3. User submits the form
4. System validates all fields and business rules
5. System creates communication record via CreateCommunicationCommand
6. System redirects to communication detail or returns to previous view
7. System shows success notification

**Business Rules**:
- Subject must not be empty
- Notes must not be empty
- Communication date cannot be in the future
- If contact is selected, it must belong to the selected client
- If project is selected, it must belong to the selected client
- If follow-up required = true, follow-up date must be provided and must be in the future
- Communication type must be one of: Call, Email, Meeting, Chat, Other

**Acceptance Criteria**:
- ✅ Backend: CreateCommunicationCommand and handler implemented
- ✅ Backend: CommunicationAggregate with event sourcing
- ✅ Backend: CommunicationCreatedDomainEvent defined and applied
- ✅ Backend: POST /api/communications endpoint
- ✅ Frontend: CommunicationFormComponent with reactive forms
- ✅ Frontend: Validation for all required fields and business rules
- ✅ Frontend: "Add Communication" button in client/contact/project detail views
- ✅ Frontend: Client/Contact/Project dropdowns with proper filtering
- ✅ Frontend: Conditional follow-up date field
- ✅ Frontend: NGRX actions, effects, reducers for creating communications
- ✅ Tests: Unit tests for command handler and aggregate

---

### UC-COMMUNICATION-001-02: View All Communications with Filtering
**Actor**: Developer/Agency Owner
**Preconditions**: None
**Flow**:
1. User navigates to "Communications" page via main navigation
2. System displays all communications in a list/table with:
   - Communication type icon/badge
   - Subject
   - Client name
   - Contact name (if associated)
   - Project name (if associated)
   - Date and time
   - Follow-up indicator (if follow-up required)
   - Follow-up date (if applicable)
3. User can filter communications by:
   - Communication type
   - Client
   - Contact
   - Project
   - Date range
   - Follow-up required (Yes/No/All)
   - Overdue follow-ups
4. User can search by subject or notes (text search)
5. User can sort by date, client, type
6. User can click on a communication to view details

**Business Rules**:
- Communications are sorted by date descending by default (most recent first)
- Overdue follow-ups are highlighted (follow-up date < today and follow-up not completed)
- Search is case-insensitive

**Acceptance Criteria**:
- ✅ Backend: GetAllCommunicationsQuery and handler
- ✅ Backend: GetCommunicationsByClientIdQuery and handler
- ✅ Backend: GetCommunicationsByContactIdQuery and handler
- ✅ Backend: GetCommunicationsByProjectIdQuery and handler
- ✅ Backend: GetCommunicationsRequiringFollowUpQuery and handler
- ✅ Backend: GET /api/communications with query parameters
- ✅ Frontend: CommunicationsListComponent with filtering UI
- ✅ Frontend: Type badges, follow-up indicators, overdue highlighting
- ✅ Frontend: Search and filter controls
- ✅ Frontend: NGRX selectors for filtered communications
- ✅ Frontend: Responsive grid/table layout
- ✅ Tests: Query handler tests

---

### UC-COMMUNICATION-001-03: View Communication Detail
**Actor**: Developer/Agency Owner
**Preconditions**: Communication exists
**Flow**:
1. User clicks on a communication from the list
2. System displays communication detail page showing:
   - Communication type
   - Subject
   - Date and time
   - Duration
   - Complete notes/summary
   - Associated client (with link)
   - Associated contact (with link, if any)
   - Associated project (with link, if any)
   - Follow-up required indicator
   - Follow-up date (if applicable)
   - Follow-up status (if applicable)
   - Created date/time
   - Last updated date/time
3. User can navigate to Edit, Delete, or Mark Follow-up Complete
4. User can navigate to associated client/contact/project

**Acceptance Criteria**:
- ✅ Backend: GetCommunicationByIdQuery and handler
- ✅ Backend: GET /api/communications/:id endpoint
- ✅ Frontend: CommunicationDetailComponent
- ✅ Frontend: Display all communication metadata
- ✅ Frontend: Action buttons (Edit, Delete, Complete Follow-up)
- ✅ Frontend: Links to associated entities
- ✅ Frontend: Route /communications/:id
- ✅ Tests: Query handler test

---

### UC-COMMUNICATION-001-04: Update Communication Details
**Actor**: Developer/Agency Owner
**Preconditions**: Communication exists
**Flow**:
1. User clicks "Edit" on communication detail page
2. System displays edit form pre-populated with current values
3. User updates fields (same fields as create)
4. User submits the form
5. System validates all fields and business rules
6. System updates communication via UpdateCommunicationDetailsCommand
7. System redirects to communication detail
8. System shows success notification

**Business Rules**: Same as UC-COMMUNICATION-001-01

**Acceptance Criteria**:
- ✅ Backend: UpdateCommunicationDetailsCommand and handler
- ✅ Backend: CommunicationDetailsUpdatedDomainEvent
- ✅ Backend: PUT /api/communications/:id endpoint
- ✅ Frontend: Communication edit page reusing CommunicationFormComponent
- ✅ Frontend: Form pre-population
- ✅ Frontend: Route /communications/:id/edit
- ✅ Frontend: NGRX actions, effects for updating
- ✅ Tests: Command handler test

---

### UC-COMMUNICATION-001-05: Mark Follow-up as Complete
**Actor**: Developer/Agency Owner
**Preconditions**: Communication exists with follow-up required = true
**Flow**:
1. User clicks "Complete Follow-up" on communication detail page
2. System marks follow-up as completed via CompleteFollowUpCommand
3. System updates communication record
4. System removes communication from "Requires Follow-up" filter
5. System shows success notification

**Business Rules**:
- Can only complete follow-up if communication has follow-up required = true
- Once completed, follow-up cannot be unmarked (new communication should be logged instead)

**Acceptance Criteria**:
- ✅ Backend: CompleteFollowUpCommand and handler
- ✅ Backend: FollowUpCompletedDomainEvent
- ✅ Backend: PATCH /api/communications/:id/complete-followup endpoint
- ✅ Frontend: "Complete Follow-up" button (only shown if follow-up required and not completed)
- ✅ Frontend: NGRX action and effect
- ✅ Frontend: Visual indicator when follow-up is completed
- ✅ Tests: Command handler test

---

### UC-COMMUNICATION-001-06: Delete a Communication
**Actor**: Developer/Agency Owner
**Preconditions**: Communication exists
**Flow**:
1. User clicks "Delete" on communication detail page
2. System displays confirmation dialog
3. User confirms deletion
4. System soft-deletes communication via DeleteCommunicationCommand
5. System redirects to communications list
6. System shows success notification

**Business Rules**:
- Soft delete pattern: communication is removed from read model but events are preserved
- User must confirm before deletion

**Acceptance Criteria**:
- ✅ Backend: DeleteCommunicationCommand and handler
- ✅ Backend: CommunicationDeletedDomainEvent
- ✅ Backend: DELETE /api/communications/:id endpoint
- ✅ Frontend: Delete button with confirmation dialog
- ✅ Frontend: NGRX action and effect
- ✅ Tests: Command handler test

---

### UC-COMMUNICATION-001-07: View Client Communications
**Actor**: Developer/Agency Owner
**Preconditions**: Client exists
**Flow**:
1. User views client detail page
2. System displays "Communications" section showing all communications for this client
3. User can see communication history sorted by date descending
4. User can click on a communication to view details
5. User can click "Log Communication" to create new communication pre-associated with this client

**Acceptance Criteria**:
- ✅ Backend: GET /api/clients/:id/communications endpoint
- ✅ Frontend: Communications section in ClientDetailComponent
- ✅ Frontend: List of communications with summary view
- ✅ Frontend: "Log Communication" button
- ✅ Frontend: NGRX selector for client communications

---

### UC-COMMUNICATION-001-08: View Contact Communications
**Actor**: Developer/Agency Owner
**Preconditions**: Contact exists
**Flow**:
1. User views contact detail page
2. System displays "Communications" section showing all communications with this contact
3. User can see communication history sorted by date descending
4. User can click on a communication to view details
5. User can click "Log Communication" to create new communication pre-associated with this contact

**Acceptance Criteria**:
- ✅ Backend: GET /api/contacts/:id/communications endpoint
- ✅ Frontend: Communications section in ContactDetailComponent
- ✅ Frontend: List of communications with summary view
- ✅ Frontend: "Log Communication" button
- ✅ Frontend: NGRX selector for contact communications

---

### UC-COMMUNICATION-001-09: View Project Communications
**Actor**: Developer/Agency Owner
**Preconditions**: Project exists
**Flow**:
1. User views project detail page
2. System displays "Communications" section showing all communications related to this project
3. User can see communication history sorted by date descending
4. User can click on a communication to view details
5. User can click "Log Communication" to create new communication pre-associated with this project

**Acceptance Criteria**:
- ✅ Backend: GET /api/projects/:id/communications endpoint
- ✅ Frontend: Communications section in ProjectDetailComponent
- ✅ Frontend: List of communications with summary view
- ✅ Frontend: "Log Communication" button
- ✅ Frontend: NGRX selector for project communications

---

## Technical Implementation Notes

### Domain Layer
- **CommunicationAggregate** (`packages/domain/src/aggregates/communication.aggregate.ts`)
  - Properties: id, type, subject, communicationDate, duration, notes, clientId, contactId?, projectId?, followUpRequired, followUpDate?, followUpCompleted, createdAt, updatedAt
  - Methods: create(), updateDetails(), completeFollowUp(), delete()
  - Events: CommunicationCreatedDomainEvent, CommunicationDetailsUpdatedDomainEvent, FollowUpCompletedDomainEvent, CommunicationDeletedDomainEvent

### Application Layer
- **Commands**: CreateCommunicationCommand, UpdateCommunicationDetailsCommand, CompleteFollowUpCommand, DeleteCommunicationCommand
- **Queries**: GetAllCommunicationsQuery, GetCommunicationByIdQuery, GetCommunicationsByClientIdQuery, GetCommunicationsByContactIdQuery, GetCommunicationsByProjectIdQuery, GetCommunicationsRequiringFollowUpQuery
- **Read Model**: CommunicationReadModel (id, type, subject, communicationDate, duration, notes, clientId, clientName, contactId?, contactName?, projectId?, projectName?, followUpRequired, followUpDate?, followUpCompleted, createdAt, updatedAt)

### Infrastructure Layer
- **Event Store**: Append/retrieve communication events
- **Projection**: CommunicationProjection - builds read models from events, denormalizes client/contact/project names
- **Repository**: ICommunicationReadRepository and InMemoryCommunicationReadRepository

### API Layer
- POST /api/communications
- GET /api/communications (with query params: type, clientId, contactId, projectId, followUpRequired, dateFrom, dateTo)
- GET /api/communications/:id
- PUT /api/communications/:id
- PATCH /api/communications/:id/complete-followup
- DELETE /api/communications/:id
- GET /api/clients/:id/communications
- GET /api/contacts/:id/communications
- GET /api/projects/:id/communications

### Frontend
- **Components**: CommunicationFormComponent, CommunicationsListComponent, CommunicationDetailComponent
- **Pages**: AddCommunicationPageComponent, EditCommunicationPageComponent
- **NGRX**: actions, effects, reducers, selectors for communication state management
- **Routes**: /communications, /communications/new, /communications/:id, /communications/:id/edit
- **Navigation**: Add "Communications" link to main navigation

### Business Value
- Complete communication history for all client interactions
- Never miss a follow-up with flagging and tracking
- Quick access to all communications related to a client, contact, or project
- Search and filter to find specific communications
- Audit trail of all communication activities
- Foundation for Dashboard "Recent Communications" and "Follow-ups Required" sections

## Definition of Done
- ✅ All 9 use cases implemented and tested
- ✅ Backend: CQRS + Event Sourcing architecture complete
- ✅ Backend: All commands, queries, events implemented
- ✅ Backend: All API endpoints functional
- ✅ Backend: Event store and projections working
- ✅ Frontend: All components and pages implemented
- ✅ Frontend: NGRX state management complete
- ✅ Frontend: Forms with validation and business rules
- ✅ Frontend: Filtering, search, and sorting working
- ✅ Frontend: Navigation between related entities
- ✅ Frontend: Professional UI with responsive design
- ✅ Tests: Unit tests for all handlers
- ✅ Manual testing: All use cases verified end-to-end
- ✅ Documentation: Implementation documented in IMPLEMENTED_STORIES.md
