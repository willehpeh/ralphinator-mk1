# US-CLIENT-001: Complete Client Management CRUD Operations ✅ COMPLETE

**Story**: As a software developer or agency owner, I want to create, update, view, and manage client records so that I can maintain an accurate database of companies and individuals I work with, including their contact details, status, and notes.

**Status**: ✅ **COMPLETE** - All use cases implemented and tested (2025-11-03)

## Business Context

Currently, the system has a foundation for viewing clients and adding projects to them, but lacks the ability to create new clients or update existing ones. Client management is the cornerstone of a CRM system - without it, users cannot onboard new clients or maintain accurate client information as relationships evolve.

## User Value

- Add new clients to the system as business grows
- Update client information when details change (address, status, notes)
- Track client lifecycle with status management (Active, Inactive, Prospect, Past Client)
- Maintain organized client records with notes for context
- Have a complete view of each client including all related projects

## Use Cases

### UC-CLIENT-001-01: Create a New Client

**Priority**: HIGH (Foundation for entire CRM)

**Actor**: Developer/Agency Owner

**Preconditions**: User has access to the application

**Main Flow**:
1. User navigates to clients list
2. User clicks "Add Client" or "Create New Client" button
3. System displays client creation form
4. User enters required information:
   - Company name (required)
   - Client type: Company or Individual (required)
   - Status: Active, Inactive, Prospect, or Past Client (required, default: Prospect)
   - Email (optional)
   - Phone (optional)
   - Address (optional)
   - Website (optional)
   - Notes (optional)
5. User submits form
6. System validates input
7. System creates client with unique ID
8. System persists ClientCreatedDomainEvent to event store
9. System updates read model via projection
10. System redirects to client detail view or clients list
11. System displays success message

**Acceptance Criteria**:
- Client must have a company name (1-200 characters)
- Client type must be either "Company" or "Individual"
- Status must be one of: Active, Inactive, Prospect, Past Client
- Email must be valid format if provided
- Phone must be valid format if provided
- Website must be valid URL format if provided
- Notes can be up to 5000 characters
- Client creation generates immutable ClientCreatedDomainEvent
- Event sourcing pattern: aggregate rebuilt from events
- Success message confirms client creation
- User can navigate to newly created client detail view

**Business Rules**:
- BR-CLIENT-001: Company name is required and must be unique
- BR-CLIENT-002: Client type determines display and filtering behavior
- BR-CLIENT-003: New clients default to "Prospect" status
- BR-CLIENT-004: All contact fields are optional but recommended
- BR-CLIENT-005: Email and phone validation when provided

---

### UC-CLIENT-001-02: Update an Existing Client

**Priority**: HIGH (Critical for maintaining accurate data)

**Actor**: Developer/Agency Owner

**Preconditions**: Client exists in the system

**Main Flow**:
1. User navigates to client detail view
2. User clicks "Edit Client" or "Update" button
3. System displays edit form pre-populated with current values
4. User modifies fields (company name, email, phone, address, website, notes, status)
5. User submits form
6. System validates input
7. System loads ClientAggregate from event store
8. System applies business logic changes
9. System persists ClientUpdatedDomainEvent(s) to event store
10. System updates read model via projection
11. System displays updated client detail view
12. System displays success message

**Acceptance Criteria**:
- All validation rules from UC-CLIENT-001-01 apply
- Form is pre-populated with current client data
- Changes generate appropriate domain events (ClientNameChanged, ClientStatusChanged, etc.)
- Event sourcing: complete audit trail of all changes
- Optimistic concurrency: detect conflicting updates
- Success message confirms update
- Updated data immediately visible in UI

**Business Rules**:
- BR-CLIENT-006: Cannot change client to have duplicate company name
- BR-CLIENT-007: Status transitions must be logical (e.g., can reactivate inactive clients)
- BR-CLIENT-008: Changing to "Past Client" does not delete associated data
- BR-CLIENT-009: All historical events preserved in event store

---

### UC-CLIENT-001-03: View Client List with Filtering

**Priority**: MEDIUM (Improves usability for growing client base)

**Actor**: Developer/Agency Owner

**Preconditions**: User has access to the application

**Main Flow**:
1. User navigates to clients list page
2. System displays all clients in read model
3. User applies optional filters:
   - Status (Active, Inactive, Prospect, Past Client)
   - Client type (Company, Individual)
   - Search by company name (partial match)
4. System filters results based on criteria
5. System displays filtered list
6. User can click on any client to view details

**Acceptance Criteria**:
- List displays: company name, status, type, email, phone
- Status shown with color-coded badges
- Filtering updates list without full page reload
- Search matches partial company names (case-insensitive)
- Empty state message when no clients match filters
- Each client row clickable to navigate to detail view
- List sorted by company name (alphabetical) by default

**Business Rules**:
- BR-CLIENT-010: List queries use optimized read model (not event store)
- BR-CLIENT-011: Filters can be combined (AND logic)
- BR-CLIENT-012: Search highlights matched text (optional enhancement)

---

### UC-CLIENT-001-04: View Client Detail with Related Data

**Priority**: MEDIUM (Already partially exists, needs enhancement)

**Actor**: Developer/Agency Owner

**Preconditions**: Client exists in the system

**Main Flow**:
1. User navigates to client detail view (from list or direct URL)
2. System loads client data from read model
3. System displays:
   - All client information (company name, type, status, contact details, notes)
   - List of associated projects (already implemented)
   - Counts of related data: projects count, contacts count (when implemented), communications count (when implemented)
   - Edit button to update client
   - Action buttons for related operations (Add Project, Add Contact, Log Communication)
4. User can navigate to related entities or edit client

**Acceptance Criteria**:
- All client fields displayed in organized layout
- Status shown with color-coded badge
- Projects list shown (existing functionality)
- Related data counts displayed even if zero
- Edit button navigates to edit form
- Action buttons clearly labeled and accessible
- Notes displayed with proper formatting (line breaks preserved)

**Business Rules**:
- BR-CLIENT-013: Detail view uses read model for performance
- BR-CLIENT-014: Related data loaded efficiently (no N+1 queries)
- BR-CLIENT-015: Missing optional fields show "Not provided" or similar

---

## Domain Model

### ClientAggregate (Event-Sourced)

**Location**: `packages/domain/src/aggregates/client.aggregate.ts`

**State**:
```typescript
- id: string (UUID)
- companyName: string
- clientType: 'Company' | 'Individual'
- status: 'Active' | 'Inactive' | 'Prospect' | 'Past Client'
- email?: string
- phone?: string
- address?: string
- website?: string
- notes?: string
- version: number (for optimistic concurrency)
- uncommittedEvents: DomainEvent[]
```

**Methods**:
```typescript
static create(id, companyName, clientType, status, ...): ClientAggregate
updateCompanyName(newName): void
updateContactDetails(email, phone, address, website): void
updateStatus(newStatus): void
updateNotes(notes): void
apply(event: DomainEvent): void (event handler for state reconstruction)
```

---

### Domain Events

**Location**: `packages/domain/src/events/client/`

1. **ClientCreatedDomainEvent**
   - Payload: id, companyName, clientType, status, email, phone, address, website, notes, timestamp

2. **ClientCompanyNameChangedDomainEvent**
   - Payload: id, oldName, newName, timestamp

3. **ClientStatusChangedDomainEvent**
   - Payload: id, oldStatus, newStatus, timestamp

4. **ClientContactDetailsChangedDomainEvent**
   - Payload: id, email, phone, address, website, timestamp

5. **ClientNotesUpdatedDomainEvent**
   - Payload: id, notes, timestamp

---

### Commands

**Location**: `packages/application/src/commands/client/`

1. **CreateClientCommand**
   - Fields: companyName, clientType, status, email, phone, address, website, notes

2. **UpdateClientCommand**
   - Fields: id, companyName, email, phone, address, website, notes, status

---

### Queries

**Location**: `packages/application/src/queries/client/`

1. **GetClientByIdQuery**
   - Fields: id
   - Returns: ClientReadModel

2. **GetAllClientsQuery**
   - Fields: filters (status, clientType, searchTerm)
   - Returns: ClientReadModel[]

---

### Read Model

**Location**: `packages/application/src/read-models/client/`

**ClientReadModel**:
```typescript
- id: string
- companyName: string
- clientType: 'Company' | 'Individual'
- status: 'Active' | 'Inactive' | 'Prospect' | 'Past Client'
- email?: string
- phone?: string
- address?: string
- website?: string
- notes?: string
- projectsCount: number (computed/cached)
- contactsCount: number (computed/cached, 0 for now)
- communicationsCount: number (computed/cached, 0 for now)
- createdAt: Date
- updatedAt: Date
```

---

## Implementation Guidance

### Backend Implementation Order

1. **Domain Layer** (TDD - write tests first in `packages/testing/`):
   - Create domain events (ClientCreatedDomainEvent, etc.)
   - Create ClientAggregate with event-sourced methods
   - Tests: Aggregate creation, state changes, event application, validation

2. **Application Layer** (TDD):
   - Create commands (CreateClientCommand, UpdateClientCommand)
   - Create command handlers
   - Create queries (GetClientByIdQuery, GetAllClientsQuery)
   - Create query handlers
   - Create ClientReadModel
   - Tests: Command handlers persist events, query handlers return correct data

3. **Infrastructure Layer**:
   - Create ClientProjection (builds read model from domain events)
   - Update InMemoryClientReadRepository with CRUD methods and filtering
   - Tests: Projections correctly update read model

4. **API Layer**:
   - Create/update ClientsController endpoints:
     - POST /api/clients (create)
     - GET /api/clients (list with filters)
     - GET /api/clients/:id (detail - may already exist)
     - PUT /api/clients/:id (update)
   - Tests: Integration tests for endpoints

---

### Frontend Implementation Order

1. **Create ClientFormComponent** (shared form for create/edit):
   - Reactive form with validation
   - All fields from domain model
   - Status dropdown
   - Client type radio buttons or dropdown
   - Submit and cancel buttons
   - Form modes: "create" vs "edit" (passed as input)
   - Modern Angular: standalone, signals, inject(), OnPush change detection
   - Location: `apps/frontend/src/app/clients/components/client-form/`

2. **Create ClientCreatePage/Component**:
   - Uses ClientFormComponent in create mode
   - Handles form submission → dispatch CreateClient action
   - Success → navigate to client detail or list
   - Error handling with user feedback
   - Location: `apps/frontend/src/app/clients/pages/client-create/`

3. **Update ClientDetailComponent**:
   - Add "Edit" button
   - Display all client fields (not just name)
   - Show status badge
   - Show notes with formatting
   - Show related data counts
   - Location: `apps/frontend/src/app/clients/pages/client-detail/` (likely exists)

4. **Create ClientEditPage/Component**:
   - Uses ClientFormComponent in edit mode
   - Pre-populate form with current client data
   - Handles form submission → dispatch UpdateClient action
   - Success → navigate back to detail view
   - Error handling with user feedback
   - Location: `apps/frontend/src/app/clients/pages/client-edit/`

5. **Update ClientListComponent**:
   - Add "Create Client" button
   - Display status badges with colors
   - Add filter controls (status, type, search)
   - Apply filters using signals or NGRX selectors
   - Improve table/list layout
   - Location: `apps/frontend/src/app/clients/pages/client-list/` (likely exists)

6. **NGRX State Management**:
   - Update/create actions: CreateClient, CreateClientSuccess, UpdateClient, UpdateClientSuccess
   - Update effects: Call API, handle success/error
   - Update reducers: Update client state
   - Update selectors: selectAllClients, selectClientById, selectClientsLoading, selectFilteredClients

---

## API Endpoints

| Method | Endpoint              | Description                    | Request Body            | Response            |
|--------|-----------------------|--------------------------------|-------------------------|---------------------|
| POST   | /api/clients          | Create new client              | CreateClientCommand     | ClientReadModel     |
| GET    | /api/clients          | List all clients (with filters)| Query params (optional) | ClientReadModel[]   |
| GET    | /api/clients/:id      | Get client by ID               | -                       | ClientReadModel     |
| PUT    | /api/clients/:id      | Update existing client         | UpdateClientCommand     | ClientReadModel     |

**Query Parameters for GET /api/clients**:
- `status` (optional): Filter by status
- `clientType` (optional): Filter by type
- `search` (optional): Search company name

---

## Testing Strategy

### Backend Tests (Vitest in `packages/testing/`)

1. **Domain Tests**:
   - ClientAggregate.create() generates ClientCreatedDomainEvent
   - ClientAggregate.updateStatus() generates ClientStatusChangedDomainEvent
   - ClientAggregate.apply() correctly rebuilds state from events
   - Validation errors thrown for invalid inputs

2. **Application Tests**:
   - CreateClientHandler persists events to event store
   - UpdateClientHandler loads aggregate, applies changes, persists events
   - GetClientByIdQueryHandler returns correct read model
   - GetAllClientsQueryHandler filters correctly

3. **Infrastructure Tests**:
   - ClientProjection updates read model when ClientCreatedDomainEvent occurs
   - ClientProjection updates read model when client fields change
   - InMemoryClientReadRepository findAll filters by status and clientType

4. **Integration Tests**:
   - POST /api/clients creates client and returns 201
   - PUT /api/clients/:id updates client and returns 200
   - GET /api/clients returns filtered results

---

### Frontend Tests (@analogjs/vitest-angular)

1. **Component Tests**:
   - ClientFormComponent validates required fields
   - ClientFormComponent emits formSubmit event with valid data
   - ClientCreatePage dispatches CreateClient action on submit
   - ClientDetailComponent displays all client fields
   - ClientListComponent displays filtered clients

2. **Integration Tests** (optional):
   - E2E flow: Create client → View in list → Edit client → View updated detail

---

## Acceptance Criteria (Story Complete)

- [ ] Backend: ClientAggregate with event sourcing implemented
- [ ] Backend: All domain events created and tested
- [ ] Backend: Command handlers persist events to event store
- [ ] Backend: Query handlers return data from read model
- [ ] Backend: ClientProjection updates read model from events
- [ ] Backend: All API endpoints implemented and tested
- [ ] Frontend: ClientFormComponent with full validation
- [ ] Frontend: Create client page functional
- [ ] Frontend: Edit client page functional
- [ ] Frontend: Client detail page shows all fields and edit button
- [ ] Frontend: Client list page has filters and create button
- [ ] Frontend: NGRX state management wired up
- [ ] All backend tests passing (domain, application, infrastructure, integration)
- [ ] All frontend tests passing (component, integration)
- [ ] Manual testing: Can create, view, edit, and filter clients
- [ ] Code follows CLAUDE.md architecture (Clean Architecture, CQRS, Event Sourcing)
- [ ] Module boundaries respected (ESLint passing)

---

## Definition of Done

- All use cases implemented and tested
- Backend tests passing (TDD approach)
- Frontend tests passing
- API endpoints working and tested
- UI is responsive and user-friendly
- Event sourcing: All state changes captured as events
- Read models optimized for queries
- Code reviewed and meets architecture standards
- Documentation updated (IMPLEMENTED_STORIES.md)
- No ESLint errors (module boundaries respected)

---

## Non-Functional Requirements

- **Performance**: Client list loads in <500ms for 1000 clients
- **Validation**: Client-side and server-side validation for all inputs
- **User Experience**: Clear error messages, success confirmations, loading states
- **Accessibility**: Forms keyboard-navigable, proper ARIA labels
- **Maintainability**: Follow Clean Architecture, CQRS, Event Sourcing patterns from CLAUDE.md

---

## Out of Scope (Future Stories)

- Client deletion (soft delete or archive feature)
- Client tags/categories
- Client logo/avatar upload
- Client custom fields
- Bulk import/export
- Client merge functionality
- Advanced search with multiple criteria
- Client activity timeline/audit log (will use event store when needed)

---

## Dependencies

- Existing event store infrastructure
- Existing CQRS setup in NestJS
- Existing Angular + NGRX setup
- Existing routing and navigation

---

## Risks & Mitigation

**Risk**: Complexity of event sourcing for basic CRUD
**Mitigation**: Follow existing project patterns (reference projects module)

**Risk**: Form validation complexity with many optional fields
**Mitigation**: Create reusable validation utilities, leverage Angular reactive forms

**Risk**: Read model consistency with event projections
**Mitigation**: Use existing projection patterns, ensure tests verify projections work correctly

---

## Notes

- This story establishes the foundation for the entire CRM system
- Client management is prerequisite for contacts, communications, and dashboard features
- Event sourcing provides complete audit trail of client changes
- Status transitions enable lifecycle management (prospect → active → past client)
- Filtering and search will become more important as client base grows
