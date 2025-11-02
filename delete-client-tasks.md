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

### 4. Create DeleteClientHandler
- Created `packages/application/src/lib/commands/handlers/delete-client.handler.ts`
- Implemented command handler following CQRS pattern
- Loads existing client aggregate from event store
- Calls delete() method on aggregate
- Persists events with optimistic concurrency control
- Publishes events to event bus for projections
- Added export to application package index
- Verified with linting

### 5. Create ClientDeletedEvent (integration event)
- Created `packages/application/src/lib/events/client-deleted.event.ts`
- Implemented IEvent interface from @nestjs/cqrs
- Added clientId and occurredOn fields
- Added export to application package index
- Verified with linting

### 6. Add test for DeleteClientHandler
- Created `packages/testing/src/tests/delete-client.handler.spec.ts`
- Added test for loading existing client and persisting deletion event
- Added test for publishing deletion event to event bus
- Added test for optimistic concurrency control with version
- Added test for returning client ID after deletion
- All 4 tests passing
- Verified with vitest

### 7. Add delete() method to IClientReadRepository
- Added delete(id: string) method to IClientReadRepository interface in `packages/application/src/lib/ports/client-read-repository.interface.ts`
- Implemented delete() in InMemoryClientReadRepository using Map.delete()
- Verified with linting (both application and infrastructure packages)
- Prerequisite for ClientDeletedProjection handler

### 8. Add ClientDeletedDomainEvent handler to ClientProjection
- Added ClientDeletedDomainEvent import to `packages/infrastructure/src/lib/projections/client.projection.ts`
- Updated @EventsHandler decorator to include ClientDeletedDomainEvent
- Updated IEventHandler type to include ClientDeletedDomainEvent
- Added else-if branch to handle ClientDeletedDomainEvent
- Calls clientReadRepository.delete() to remove client from read model
- Verified with linting

### 9. Add DELETE /clients/:id endpoint in controller
- Added Delete decorator import from @nestjs/common in `apps/api/src/app/clients/clients.controller.ts`
- Added DeleteClientCommand import from @angular-nest-starter/application
- Implemented deleteClient() method with @Delete(':id') decorator
- Method accepts id parameter from URL
- Creates DeleteClientCommand and executes via CommandBus
- Returns object with deleted client id
- Verified with linting

## Next Tasks (Not Started)

### Domain Layer
- ✅ All domain layer tasks complete

### Application Layer
- ✅ All application layer tasks complete

### Infrastructure Layer
- ✅ All infrastructure layer tasks complete

### API Layer
- [x] Add DELETE /clients/:id endpoint in controller
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
