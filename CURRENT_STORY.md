# US-CONTACT-001: Complete Contact Management CRUD Operations

## User Story

**As a** software developer or agency owner
**I want to** create, update, view, and manage contact records for individuals at client companies
**So that** I can maintain an accurate database of the people I interact with at each client, including their roles, contact details, and communication preferences.

## Business Context

Clients are organizations, but we interact with individual people. This feature enables tracking multiple contacts per client, understanding their roles, and maintaining up-to-date contact information for effective relationship management.

## Acceptance Criteria

### 1. Create a New Contact
- [ ] User can add a contact to an existing client
- [ ] Required fields: first name, last name, client association
- [ ] Optional fields: role/title, email, phone, notes
- [ ] Email must be valid format when provided
- [ ] Contact names must be unique within the same client (no duplicate contacts)
- [ ] System generates unique contact ID
- [ ] System records creation timestamp
- [ ] Contact is immediately visible in contact list and client detail view

### 2. Update Contact Information
- [ ] User can edit any contact field except client association
- [ ] User can update role, email, phone, and notes
- [ ] Email validation applies on updates
- [ ] Cannot create duplicate names within same client
- [ ] System records update timestamp
- [ ] Changes are immediately reflected in all views

### 3. View Contact List
- [ ] User can view all contacts across all clients
- [ ] List displays: name, role, email, phone, associated client
- [ ] User can filter contacts by client
- [ ] User can search contacts by name
- [ ] List is sortable by name, client, or role
- [ ] Empty state message when no contacts exist

### 4. View Contact Detail
- [ ] User can view complete contact information
- [ ] Detail view shows all contact fields
- [ ] Detail view shows associated client with link to client detail page
- [ ] Detail view shows all communications with this contact (future enhancement)
- [ ] User can navigate to edit contact from detail view
- [ ] User can navigate to associated client from detail view

### 5. Delete Contact
- [ ] User can delete a contact
- [ ] System requires confirmation before deletion
- [ ] Deletion removes contact from system
- [ ] Contact is removed from client's contact list
- [ ] Cannot delete if contact has associated communications (future constraint)

### 6. View Contacts for a Client
- [ ] User can view all contacts for a specific client
- [ ] Contacts displayed in client detail page
- [ ] User can add new contact from client detail page
- [ ] Empty state when client has no contacts
- [ ] Quick access to contact details from client view

## Use Cases

### UC-CONTACT-001-01: Add a New Contact to a Client

**Preconditions**: User is viewing client detail page or contacts list
**Trigger**: User clicks "Add Contact" button

**Main Flow**:
1. System displays contact creation form
2. User enters first name, last name
3. User selects client from dropdown (or pre-selected if coming from client detail)
4. User optionally enters role, email, phone, notes
5. User submits form
6. System validates inputs (required fields, email format, no duplicates within client)
7. System creates contact record with unique ID and timestamps
8. System displays success message
9. System navigates to contact detail or returns to contact list

**Alternate Flows**:
- If validation fails, display error messages and allow correction
- If duplicate name within same client, display specific error message

### UC-CONTACT-001-02: Update Contact Information

**Preconditions**: Contact exists in system
**Trigger**: User clicks "Edit" on contact detail page

**Main Flow**:
1. System displays contact edit form with current values
2. User modifies desired fields (role, email, phone, notes)
3. User submits form
4. System validates inputs
5. System updates contact record with new values
6. System updates modification timestamp
7. System displays success message
8. System shows updated contact detail

### UC-CONTACT-001-03: View All Contacts with Filtering

**Preconditions**: None
**Trigger**: User navigates to Contacts page

**Main Flow**:
1. System displays list of all contacts
2. User can filter by client (dropdown)
3. User can search by name (text input)
4. System updates list based on filters
5. User can click contact to view details

### UC-CONTACT-001-04: View Contact Detail

**Preconditions**: Contact exists in system
**Trigger**: User clicks contact in list

**Main Flow**:
1. System retrieves contact details and associated client
2. System displays contact detail page with all information
3. User can navigate to associated client
4. User can edit contact
5. User can delete contact

### UC-CONTACT-001-05: Delete a Contact

**Preconditions**: Contact exists in system
**Trigger**: User clicks "Delete" on contact detail page

**Main Flow**:
1. System displays confirmation dialog
2. User confirms deletion
3. System deletes contact record
4. System removes contact from client's contact list
5. System displays success message
6. System navigates to contacts list or client detail

**Alternate Flows**:
- User cancels deletion, system returns to contact detail

### UC-CONTACT-001-06: View Client's Contacts

**Preconditions**: User is viewing client detail page
**Trigger**: Page loads or user clicks "Contacts" tab

**Main Flow**:
1. System retrieves all contacts for the client
2. System displays contacts in a list/table
3. User can click "Add Contact" (pre-filled with client)
4. User can click contact to view details

## Technical Requirements

### Backend (NestJS + CQRS + Event Sourcing)

#### Domain Layer (`packages/domain/`)
- **ContactAggregate** (`aggregates/contact.aggregate.ts`)
  - Properties: id, firstName, lastName, clientId, role, email, phone, notes, createdAt, updatedAt
  - Static factory: `create()`
  - Methods: `updateContactInfo()`, `delete()`
  - Event application: `apply()` for all domain events

- **Domain Events** (`events/`)
  - `ContactCreatedDomainEvent`
  - `ContactUpdatedDomainEvent`
  - `ContactDeletedDomainEvent`

- **Value Objects** (`value-objects/`)
  - Reuse `Email` value object from clients domain
  - Consider `PhoneNumber` value object for validation

#### Application Layer (`packages/application/`)

- **Commands** (`commands/`)
  - `CreateContactCommand`: firstName, lastName, clientId, role?, email?, phone?, notes?
  - `UpdateContactCommand`: id, role?, email?, phone?, notes?
  - `DeleteContactCommand`: id

- **Command Handlers** (`commands/handlers/`)
  - `CreateContactHandler`: Create aggregate, validate email, check duplicates via repository, persist events
  - `UpdateContactHandler`: Load aggregate, update, persist events
  - `DeleteContactHandler`: Load aggregate, delete, persist events

- **Queries** (`queries/`)
  - `GetContactByIdQuery`: id
  - `GetAllContactsQuery`: clientId?, search?
  - `GetContactsByClientIdQuery`: clientId

- **Query Handlers** (`queries/handlers/`)
  - `GetContactByIdHandler`: Query read model
  - `GetAllContactsHandler`: Query read model with filters
  - `GetContactsByClientIdHandler`: Query read model for specific client

- **Read Models** (`read-models/`)
  - `ContactReadModel`: id, firstName, lastName, clientId, clientName, role, email, phone, notes, createdAt, updatedAt

- **Ports** (`ports/`)
  - `IContactReadRepository`: findById, findAll, findByClientId, exists

#### Infrastructure Layer (`packages/infrastructure/`)

- **Event Store**: Reuse existing event store
- **Projections** (`projections/`)
  - `ContactProjection`: Build ContactReadModel from domain events
- **Read Repository** (`read-models/`)
  - `InMemoryContactReadRepository`: Implement IContactReadRepository

#### API Layer (`apps/api/`)

- **Module**: `ContactsModule` (register handlers, projections, repositories)
- **Controller**: `ContactsController`
  - `POST /api/contacts` - Create contact
  - `GET /api/contacts` - Get all contacts (with filters)
  - `GET /api/contacts/:id` - Get contact by ID
  - `PUT /api/contacts/:id` - Update contact
  - `DELETE /api/contacts/:id` - Delete contact
  - `GET /api/clients/:clientId/contacts` - Get contacts for client
  - `POST /api/clients/:clientId/contacts` - Create contact for client

### Frontend (Angular + NGRX)

#### State Management
- **Actions** (`+state/contacts.actions.ts`)
  - Load actions: loadContacts, loadContactSuccess, loadContactsFailure
  - Load by client: loadContactsByClient, loadContactsByClientSuccess
  - Load by ID: loadContact, loadContactSuccess
  - Create: createContact, createContactSuccess, createContactFailure
  - Update: updateContact, updateContactSuccess, updateContactFailure
  - Delete: deleteContact, deleteContactSuccess, deleteContactFailure

- **Effects** (`+state/contacts.effects.ts`)
  - HTTP calls to backend API
  - Error handling and success notifications

- **Reducers** (`+state/contacts.reducer.ts`)
  - Manage contacts state (entities, loading, error, selectedId)

- **Selectors** (`+state/contacts.selectors.ts`)
  - selectAllContacts, selectContactsLoading, selectSelectedContact, selectContactsByClient

#### Components

- **ContactListComponent** (list view)
  - Display contacts table
  - Client filter dropdown
  - Name search input
  - Navigate to contact detail
  - "Add Contact" button

- **ContactDetailComponent** (detail view)
  - Display contact information
  - Show associated client with link
  - "Edit" and "Delete" buttons
  - Navigation breadcrumbs

- **ContactFormComponent** (create/edit form)
  - Reactive form with validation
  - Client selection (dropdown or hidden if from client detail)
  - Email validation
  - Phone input
  - Submit and cancel actions
  - Error display

- **AddContactPageComponent** (page wrapper)
  - Contains ContactFormComponent
  - Handles navigation after creation

- **Client Detail Enhancement**
  - Add contacts section to ClientDetailComponent
  - Display contacts for the client
  - "Add Contact" button (navigates with clientId pre-filled)

#### Routes
```typescript
{
  path: 'contacts',
  children: [
    { path: '', component: ContactListComponent },
    { path: 'new', component: AddContactPageComponent },
    { path: ':id', component: ContactDetailComponent },
    { path: ':id/edit', component: AddContactPageComponent }
  ]
}
```

#### Models
- `Contact` interface matching ContactReadModel
- `CreateContactDto` interface
- `UpdateContactDto` interface

### Testing (`packages/testing/`)

#### Test Focus (TDD)
- **Command Handlers**:
  - Create contact with valid data
  - Validate email format
  - Prevent duplicate contacts within same client
  - Update contact information
  - Delete contact
  - Handle domain validation errors

- **Query Handlers**:
  - Retrieve contact by ID
  - Retrieve all contacts
  - Filter contacts by client
  - Search contacts by name
  - Handle not found scenarios

- **Projections**:
  - Build read model from ContactCreatedDomainEvent
  - Update read model from ContactUpdatedDomainEvent
  - Remove from read model on ContactDeletedDomainEvent
  - Include client name in read model

- **Frontend Components**:
  - Contact form validation
  - Create contact flow
  - Edit contact flow
  - Delete contact with confirmation
  - Filter and search functionality

## Business Rules

1. **Required Fields**: firstName, lastName, clientId must be provided
2. **Email Validation**: Email must be valid format when provided (optional field)
3. **No Duplicate Contacts**: Cannot have two contacts with same firstName + lastName within the same client
4. **Client Association**: Contact must be associated with an existing client
5. **Phone Format**: Accept various phone formats (no strict validation initially)
6. **Character Limits**: firstName/lastName max 100 chars, role max 100 chars, email max 255 chars
7. **Notes**: Optional free-text field, max 1000 characters

## Definition of Done

- [ ] All acceptance criteria met
- [ ] All use cases implemented
- [ ] TDD: Tests written first and passing
- [ ] Backend: Domain events, aggregates, commands, queries, handlers implemented
- [ ] Backend: Event sourcing working (events persisted and replayed)
- [ ] Backend: Projections building read models correctly
- [ ] Backend: All API endpoints implemented and tested
- [ ] Frontend: All components created with standalone, signals, modern Angular patterns
- [ ] Frontend: NGRX state management implemented
- [ ] Frontend: Reactive forms with validation
- [ ] Frontend: Client detail page shows contacts section
- [ ] UI: Professional appearance with validation feedback
- [ ] Integration: Full end-to-end flow working
- [ ] Code: Follows Clean Architecture + CQRS + Event Sourcing patterns
- [ ] Code: Module boundaries respected (ESLint passing)
- [ ] Documentation: Implementation documented in IMPLEMENTED_STORIES.md

## Dependencies

- **Requires**: US-CLIENT-001 (Client management must exist)
- **Blocks**: US-COMMUNICATION-001 (Communications will reference contacts)

## Estimated Complexity

**Medium** - Similar pattern to clients and projects, but with additional relationship to clients and validation rules.

## Success Metrics

- User can add contacts to clients
- User can view all contacts for a client
- User can search and filter contacts
- Contact information is always valid (email format, required fields)
- No duplicate contacts within same client
- Complete audit trail via event sourcing

## Notes

- This feature lays the foundation for the Communications feature
- Consider adding "primary contact" flag in future iteration
- Consider adding "active/inactive" status in future iteration
- Phone number validation can be enhanced later with country codes
- Social media links could be added as future enhancement
