# Use Case 6: Remove a Contact from the System - Task Documentation

**Status**: IN PROGRESS
**Started**: 2025-11-03

## Overview
This use case allows users to delete a contact person from the system when they are no longer relevant (left the company, relationship ended, duplicate entry).

## Tasks Completed

### Domain Layer

### Application Layer

### Infrastructure Layer

### API Layer

### Frontend Layer

### Testing Layer

## Tasks Remaining

### Domain Layer
- [ ] Add ContactDeletedDomainEvent class
- [ ] Add removeContact method to ClientAggregate
- [ ] Register ContactDeletedDomainEvent handler in ClientAggregate
- [ ] Add CLIENT_EVENT_TYPES.CONTACT_DELETED constant

### Application Layer
- [ ] Create RemoveContactCommand class
- [ ] Export RemoveContactCommand
- [ ] Create RemoveContactCommandHandler
- [ ] Export RemoveContactCommandHandler

### Infrastructure Layer
- [ ] Update ContactProjection to handle ContactDeletedDomainEvent (soft delete/mark as deleted)

### API Layer
- [ ] Add DELETE /api/contacts/:id endpoint in ContactsController
- [ ] Register RemoveContactCommandHandler in ContactsModule

### Frontend Layer
- [ ] Add delete button to ContactDetailComponent
- [ ] Create confirmation dialog component
- [ ] Implement deleteContact() method to call DELETE API
- [ ] Add loading state during delete operation
- [ ] Add success confirmation and navigation to contacts list
- [ ] Add error handling for delete failures
- [ ] Update NGRX actions for deleting contacts
- [ ] Update NGRX effects for delete contact action
- [ ] Update NGRX reducer to handle contact deletion

### Testing Layer
- [ ] Add tests for ClientAggregate.removeContact() method
- [ ] Add tests for RemoveContactCommandHandler
- [ ] Add tests for ContactProjection handling ContactDeletedDomainEvent

## Files Created/Modified

### Domain Layer

### Application Layer

### Infrastructure Layer

### Shared Types Layer

### API Layer

### Frontend Layer

---
