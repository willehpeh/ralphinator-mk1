# Use Case 7: Remove a Client from the System - Implementation Tasks

## Completed Tasks

### 1. Create ClientDeletedDomainEvent class 
- Created `packages/domain/src/lib/events/client-deleted.domain-event.ts`
- Extended DomainEvent base class
- Added export to domain package index
- Verified with linting

## Next Tasks (Not Started)

### Domain Layer
- [ ] Add delete() method to ClientAggregate to apply ClientDeletedDomainEvent
- [ ] Add apply() case in ClientAggregate for ClientDeletedDomainEvent

### Application Layer
- [ ] Create DeleteClientCommand
- [ ] Create DeleteClientHandler (load aggregate, call delete(), persist events)
- [ ] Create ClientDeletedEvent (integration event)
- [ ] Add test for DeleteClientHandler

### Infrastructure Layer
- [ ] Create ClientDeletedProjection to update read model
- [ ] Add projection handler registration

### API Layer
- [ ] Add DELETE /clients/:id endpoint in controller
- [ ] Register DeleteClientHandler and projection in module

### Frontend Layer
- [ ] Add deleteClient action to NGRX store
- [ ] Add deleteClient effect to call API
- [ ] Update reducer to remove deleted client
- [ ] Add "Delete Client" button to client detail view
- [ ] Add confirmation dialog component
- [ ] Handle delete success (navigate to list)
- [ ] Handle delete errors (show error message)
- [ ] Update client list to reflect deletion

## Notes
- Following event sourcing pattern: domain event ’ aggregate ’ command handler ’ projection
- Using TDD approach: tests first, then implementation
- One atomic task at a time
