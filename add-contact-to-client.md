# Use Case 1: Add a New Contact to a Client

## Tasks Completed

### Task 1: Create ContactAddedToClientDomainEvent 
- **Files Created:**
  - `packages/domain/src/lib/events/contact-added-to-client.domain-event.ts`
- **Files Modified:**
  - `packages/domain/src/lib/constants/client-event-types.ts` - Added CONTACT_ADDED constant
  - `packages/domain/src/index.ts` - Exported new event
- **Description:** Created the domain event that will be raised when a contact is added to a client. The event includes contactId, name, role, email, and phone fields.

### Task 2: Add contact state to ClientAggregate
- **Files Modified:**
  - `packages/domain/src/lib/aggregates/client.aggregate.ts`
- **Description:**
  - Added Contact interface to represent contact person data (contactId, name, role, email, phone)
  - Added private contacts Map to ClientAggregate to store contacts by contactId
  - Added getContacts() method to retrieve all contacts as an array
  - Contact interface is exported from domain package for use in other layers

### Task 3: Implement addContact() method on ClientAggregate
- **Files Modified:**
  - `packages/domain/src/lib/aggregates/client.aggregate.ts`
- **Description:**
  - Imported ContactAddedToClientDomainEvent into ClientAggregate
  - Registered CONTACT_ADDED event handler in constructor
  - Implemented addContact() method that applies ContactAddedToClientDomainEvent
  - Implemented onContactAdded() event handler that adds contact to contacts Map
  - Method validates aggregate is initialized before adding contact

## Next Tasks
- Create AddContactToClientCommand
- Create AddContactToClientCommandHandler
- Create ContactReadModel DTO
- Create GetClientContactsQuery and handler
- Create projection to build contact read models
- Add API endpoint for adding contacts
- Add API endpoint for retrieving client contacts
- Integrate frontend UI for adding contacts
