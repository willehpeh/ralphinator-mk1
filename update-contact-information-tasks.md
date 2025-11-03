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
- [x] Create UpdateContactCommandHandler
- [x] Export UpdateContactCommandHandler

### Infrastructure Layer
- [x] Update ContactProjection to handle ContactUpdatedDomainEvent

## Tasks Remaining

### Domain Layer

### Application Layer

### Infrastructure Layer

### API Layer
- [x] Add UpdateContactDto
- [x] Add PUT /api/contacts/:id endpoint in ContactsController
- [x] Register UpdateContactCommandHandler in ContactsModule

### Frontend Layer
- [x] Add edit mode state to ContactDetailComponent
- [x] Create edit form in ContactDetailComponent
- [x] Add edit/cancel/save buttons
- [x] Implement saveContact() method to call API
- [x] Add loading state during save operation
- [ ] Add success confirmation message
- [ ] Add error handling for save failures
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
- `packages/application/src/lib/commands/handlers/update-contact.handler.ts` (created - UpdateContactCommandHandler)
- `packages/application/src/lib/application.ts` (modified - exported UpdateContactCommand and UpdateContactCommandHandler)

### Infrastructure Layer
- `packages/infrastructure/src/lib/projections/contact.projection.ts` (modified - added ContactUpdatedDomainEvent handler to update read model)

### Shared Types Layer
- `packages/shared-types/src/lib/dtos/contact.dtos.ts` (modified - added UpdateContactDto class with validation)

### API Layer
- `apps/api/src/app/contacts/contacts.controller.ts` (modified - added PUT /api/contacts/:id endpoint with UpdateContactCommand integration)
- `apps/api/src/app/contacts/contacts.module.ts` (modified - registered UpdateContactCommandHandler in providers)

### Frontend Layer
- `apps/frontend/src/app/clients/contact-detail.component.ts` (modified - added isEditMode signal, saving signal, enterEditMode() and cancelEdit() methods, editForm FormGroup, form template with validation, loading state during save operation)

---
