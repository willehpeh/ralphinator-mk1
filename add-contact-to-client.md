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

### Task 4: Create AddContactToClientCommand
- **Files Created:**
  - `packages/application/src/lib/commands/add-contact-to-client.command.ts`
- **Files Modified:**
  - `packages/application/src/lib/application.ts` - Exported new command
- **Description:**
  - Created AddContactToClientCommand with clientId, contactId, name, role, email, and phone fields
  - All optional fields (role, email, phone) are nullable
  - Command is exported from application package for use in handlers and API layer

### Task 5: Create AddContactToClientCommandHandler
- **Files Created:**
  - `packages/application/src/lib/commands/handlers/add-contact-to-client.handler.ts`
- **Files Modified:**
  - `packages/application/src/lib/application.ts` - Exported new handler
- **Description:**
  - Created AddContactToClientCommandHandler extending BaseCommandHandler
  - Uses executeOnAggregate helper to load client, add contact, and save
  - Calls ClientAggregate.addContact() method with all contact parameters
  - Returns clientId on successful execution
  - Handler is exported from application package and ready for registration in module

### Task 6: Create ContactReadModel DTO
- **Files Created:**
  - `packages/application/src/lib/read-models/contact.read-model.ts`
- **Files Modified:**
  - `packages/application/src/lib/application.ts` - Exported new read model
- **Description:**
  - Created ContactReadModel class following the same pattern as ClientReadModel
  - Includes contactId, clientId, name, role (nullable), email (nullable), and phone (nullable) fields
  - Read model is exported from application package for use in query handlers and projections
  - ContactReadModel includes clientId to support querying contacts by client

## Next Tasks
- Create GetClientContactsQuery and handler
- Create projection to build contact read models
- Add API endpoint for adding contacts
- Add API endpoint for retrieving client contacts
- Integrate frontend UI for adding contacts
