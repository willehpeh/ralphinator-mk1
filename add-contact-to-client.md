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

### Task 7: Create GetClientContactsQuery
- **Files Created:**
  - `packages/application/src/lib/queries/get-client-contacts.query.ts`
- **Files Modified:**
  - `packages/application/src/lib/application.ts` - Exported new query
- **Description:**
  - Created GetClientContactsQuery with clientId field to retrieve contacts for a specific client
  - Query is exported from application package for use in query handlers and API layer

### Task 8: Create IContactReadRepository port interface
- **Files Created:**
  - `packages/application/src/lib/ports/contact-read-repository.interface.ts`
- **Files Modified:**
  - `packages/application/src/lib/ports/index.ts` - Exported new interface
  - `packages/application/src/lib/ports/injection-tokens.ts` - Added CONTACT_READ_REPOSITORY injection token
- **Description:**
  - Created IContactReadRepository interface for contact read model operations
  - Added findByClientId() method to retrieve contacts for a specific client
  - Added save() method to persist contact read models
  - Added delete() method to remove contacts from repository
  - Added CONTACT_READ_REPOSITORY injection token for dependency injection
  - Interface follows the same pattern as IClientReadRepository

### Task 9: Create GetClientContactsQueryHandler
- **Files Created:**
  - `packages/application/src/lib/queries/handlers/get-client-contacts.handler.ts`
- **Files Modified:**
  - `packages/application/src/lib/application.ts` - Exported new handler and contact read repository interface
- **Description:**
  - Created GetClientContactsQueryHandler implementing IQueryHandler interface
  - Handler injects IContactReadRepository using CONTACT_READ_REPOSITORY injection token
  - Implements execute() method that calls contactReadRepository.findByClientId()
  - Returns array of ContactReadModel instances for the specified client
  - Includes comprehensive error handling with descriptive error messages
  - Handler is exported from application package and ready for module registration

### Task 10: Create ContactProjection to build contact read models
- **Files Created:**
  - `packages/infrastructure/src/lib/projections/contact.projection.ts`
- **Files Modified:**
  - `packages/infrastructure/src/lib/infrastructure.ts` - Exported ContactProjection
- **Description:**
  - Created ContactProjection extending BaseProjectionHandler
  - Registered ContactAddedToClientDomainEvent in @EventsHandler decorator
  - Implemented onContactAdded() event handler that creates ContactReadModel
  - Handler transforms event data (contactId, clientId, name, role, email, phone) into ContactReadModel
  - Calls contactReadRepository.save() to persist read model
  - Projection is exported from infrastructure package and ready for module registration
  - Follows same pattern as ClientProjection with event handler registry

### Task 11: Create InMemoryContactReadRepository implementation
- **Files Created:**
  - `packages/infrastructure/src/lib/read-models/in-memory-contact-read-repository.ts`
- **Files Modified:**
  - `packages/infrastructure/src/lib/infrastructure.ts` - Exported InMemoryContactReadRepository
- **Description:**
  - Created InMemoryContactReadRepository implementing IContactReadRepository interface
  - Uses Map<string, ContactReadModel> to store contacts by contactId
  - Implemented findByClientId() method that filters contacts by clientId
  - Implemented save() method to upsert contact read models
  - Implemented delete() method to remove contacts by contactId
  - Added clear() utility method for testing purposes
  - Includes comprehensive JSDoc comments explaining in-memory limitations
  - Repository is exported from infrastructure package and ready for module registration
  - Follows same pattern as InMemoryClientReadRepository

### Task 12: Add API endpoint for adding contacts to a client
- **Files Created:**
  - `packages/shared-types/src/lib/dtos/contact.dtos.ts`
- **Files Modified:**
  - `packages/shared-types/src/index.ts` - Exported contact DTOs
  - `apps/api/src/app/clients/clients.controller.ts` - Added addContactToClient endpoint
- **Description:**
  - Created AddContactDto with name (required), role, email, and phone (all optional) fields
  - Created AddContactResponse interface with contactId and clientId fields
  - Added POST /:id/contacts endpoint to ClientsController
  - Endpoint generates contactId using randomUUID()
  - Endpoint creates AddContactToClientCommand with all contact data
  - Endpoint executes command via CommandBus and returns AddContactResponse
  - Follows RESTful pattern: POST /clients/:id/contacts

### Task 13: Add API endpoint for retrieving client contacts
- **Files Modified:**
  - `apps/api/src/app/clients/clients.controller.ts`
- **Description:**
  - Added GetClientContactsQuery and ContactReadModel imports to controller
  - Added GET /:id/contacts endpoint to ClientsController
  - Endpoint creates GetClientContactsQuery with clientId parameter
  - Endpoint executes query via QueryBus and returns ContactReadModel[] array
  - Follows RESTful pattern: GET /clients/:id/contacts
  - Returns empty array if client has no contacts

### Task 14: Create ContactFormComponent for adding contacts
- **Files Created:**
  - `apps/frontend/src/app/clients/contact-form.component.ts`
- **Description:**
  - Created ContactFormComponent following modern Angular patterns (standalone, signals, inject())
  - Implemented reactive form with typed controls (ContactForm interface)
  - Added form validation: name is required, email format validation
  - Integrated with backend API: POST /api/clients/:id/contacts
  - Added input() for clientId (required) to associate contact with client
  - Added output events: contactAdded and formCancelled
  - Implemented error handling with user-friendly error messages
  - Added loading state with isSubmitting signal
  - Form uses clients-common.scss for consistent styling
  - Only includes optional fields (role, email, phone) in payload if they have values
  - Follows OnPush change detection strategy for performance

### Task 15: Integrate ContactFormComponent into ClientDetailComponent
- **Files Modified:**
  - `apps/frontend/src/app/clients/client-detail.component.ts`
  - `apps/frontend/src/app/clients/client-detail.component.scss`
- **Description:**
  - Imported ContactFormComponent into ClientDetailComponent
  - Added isAddingContact signal to track add contact mode state
  - Added toggleAddContactMode() method to show/hide contact form
  - Added handleContactAdded() method to close form after successful submission
  - Added Contacts section to template with "Add Contact" button
  - Contact form conditionally displayed when isAddingContact is true
  - Added empty state message when no contacts exist
  - Added section-header, add-contact-button, and empty-state styles
  - Section-header uses flexbox to position heading and button
  - Contacts section placed between Notes and Metadata sections
  - Form is pre-populated with clientId from current client

### Task 16: Create ContactListComponent for displaying client contacts
- **Files Created:**
  - `apps/frontend/src/app/clients/contact-list.component.ts`
- **Description:**
  - Created ContactListComponent following modern Angular patterns (standalone, signals, inject())
  - Component accepts contacts array as required input using input.required<Contact[]>()
  - Implemented responsive grid layout that adapts to screen size (auto-fill minmax pattern)
  - Each contact displayed in a card with hover effect for better UX
  - Contact cards show name (bold heading), optional role (italic subtitle)
  - Contact details (email, phone) displayed with SVG icons for visual clarity
  - Email and phone are clickable links (mailto: and tel: protocols)
  - Added empty state message when no contacts exist
  - Uses OnPush change detection strategy for performance
  - Follows same styling patterns as other client components
  - Component is ready to be integrated into ClientDetailComponent

## Next Tasks
- Integrate contact list component to show existing contacts
- Load and display contacts when viewing client details
