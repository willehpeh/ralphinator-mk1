# Use Case 1: Record a New Contact for a Client

**Primary Actor**: Developer or Agency Owner

**Goal**: Capture information about a new person at a client company so I can maintain organized contact records

**Preconditions**:
- The client company already exists in the system
- The user has access to add contacts

**Main Success Scenario**:
1. User indicates they want to record a new contact for a specific client
2. System requests contact's essential information (first name, last name)
3. User provides the contact's first and last name
4. User optionally provides additional details (role/title, email address, phone number, notes)
5. User confirms the information
6. System validates the information (email format is correct, no duplicate person already exists for this client)
7. System records the contact and associates them with the client
8. System confirms the contact has been recorded and displays the complete contact information

**Extensions**:
- 6a. If the email format is invalid:
  - 6a1. System notifies user of the invalid email format
  - 6a2. User corrects the email address
  - 6a3. Return to step 6
- 6b. If a contact with the same name already exists for this client:
  - 6b1. System alerts user that this person is already recorded for this client
  - 6b2. User can modify the name or cancel the operation
  - 6b3. Return to step 3 or cancel
- 5a. If user cancels the operation:
  - 5a1. System discards the information
  - 5a2. No contact is recorded

**Success Guarantee**: A new contact is recorded in the system, associated with the correct client, with all provided information accurately captured

---

## Implementation Scope

This use case requires:

### Backend
- Domain layer: ContactAggregate, ContactCreatedDomainEvent, Email value object validation
- Application layer: CreateContactCommand, CreateContactHandler
- Infrastructure layer: ContactProjection, ContactReadRepository
- API layer: POST /api/contacts, POST /api/clients/:clientId/contacts

### Frontend
- ContactFormComponent (create mode)
- AddContactPageComponent
- NGRX actions/effects/reducers for createContact
- Navigation integration

### Testing
- Command handler tests (TDD)
- Validation tests (email format, duplicate detection)
- Projection tests
- Component tests
