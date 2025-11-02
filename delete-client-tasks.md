# Use Case 7: Remove a Client from the System - Implementation Tasks

## Completed Tasks

### 1. Create ClientDeletedDomainEvent class
- Created `packages/domain/src/lib/events/client-deleted.domain-event.ts`
- Extended DomainEvent base class
- Added export to domain package index
- Verified with linting

### 2. Add delete() method and apply() case to ClientAggregate
- Added import for ClientDeletedDomainEvent in `packages/domain/src/lib/aggregates/client.aggregate.ts`
- Implemented delete() method that applies ClientDeletedDomainEvent
- Added validation to ensure client exists before deletion
- Added apply() case to handle ClientDeletedDomainEvent during event replay
- Verified with linting

### 3. Create DeleteClientCommand
- Created `packages/application/src/lib/commands/delete-client.command.ts`
- Simple command class with readonly id field
- Added export to application package index
- Verified with linting

## Next Tasks (Not Started)

### Domain Layer
- ✅ All domain layer tasks complete

### Application Layer
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
- Following event sourcing pattern: domain event → aggregate → command handler → projection
- Using TDD approach: tests first, then implementation
- One atomic task at a time
