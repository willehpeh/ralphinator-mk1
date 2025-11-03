# Use Case 5: Update Contact Information - Task Documentation

**Status**: IN PROGRESS
**Started**: 2025-11-03

## Overview
This use case allows users to update a contact's information (name, role, email, phone) after it has been created.

## Tasks Completed

### Domain Layer
- [x] Add updateContact method to ClientAggregate
- [x] Register ContactUpdatedDomainEvent handler in ClientAggregate
- [x] Add CLIENT_EVENT_TYPES.CONTACT_UPDATED constant
- [x] Add CONTACT_NOT_FOUND error constant

### Application Layer
- [x] Create UpdateContactCommand class
- [x] Export UpdateContactCommand

## Tasks Remaining

### Domain Layer

### Application Layer
- [ ] Create UpdateContactCommandHandler
- [ ] Export UpdateContactCommandHandler

### Infrastructure Layer
- [ ] Update ContactProjection to handle ContactUpdatedDomainEvent

### API Layer
- [ ] Add UpdateContactDto
- [ ] Add PUT /api/contacts/:id endpoint in ContactsController
- [ ] Register UpdateContactCommandHandler in ContactsModule

### Frontend Layer
- [ ] Add edit mode state to ContactDetailComponent
- [ ] Create edit form in ContactDetailComponent
- [ ] Add edit/cancel/save buttons
- [ ] Add form validation
- [ ] Add validation error messages
- [ ] Add success confirmation message
- [ ] Update NGRX actions for updating contacts
- [ ] Update NGRX effects for update contact action
- [ ] Update NGRX reducer to handle contact updates

### Testing Layer
- [ ] Add tests for ClientAggregate.updateContact() method
- [ ] Add tests for UpdateContactCommandHandler
- [ ] Add tests for ContactProjection handling ContactUpdatedDomainEvent

## Files Created/Modified

### Domain Layer
- `packages/domain/src/lib/aggregates/client.aggregate.ts` (modified - added updateContact method, onContactUpdated event handler)
- `packages/domain/src/lib/constants/client-event-types.ts` (modified - added CONTACT_UPDATED constant)
- `packages/domain/src/lib/constants/domain-errors.ts` (modified - added CONTACT_NOT_FOUND error)

### Application Layer
- `packages/application/src/lib/commands/update-contact.command.ts` (created - UpdateContactCommand class)
- `packages/application/src/lib/application.ts` (modified - exported UpdateContactCommand)

---
