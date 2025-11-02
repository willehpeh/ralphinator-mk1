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

### 10. Register DeleteClientHandler and projection in module
- Added DeleteClientHandler import to `apps/api/src/app/clients/clients.module.ts`
- Added DeleteClientHandler to CommandHandlers array
- ClientProjection already registered (handles all client domain events including deletion)
- Verified with linting
- Backend implementation now complete

## Next Tasks (Not Started)

### Domain Layer
- ✅ All domain layer tasks complete

### Application Layer
- ✅ All application layer tasks complete

### Infrastructure Layer
- ✅ All infrastructure layer tasks complete

### API Layer
- ✅ All API layer tasks complete

### Frontend Layer
- [x] **Add deleteClient action to NGRX store** ✅
  - Added deleteClient action with props<{ id: string }> to `apps/frontend/src/app/clients/store/clients.actions.ts`
  - Added deleteClientSuccess action with props<{ id: string }>
  - Added deleteClientFailure action with props<{ error: string }>
  - Follows existing NGRX action pattern with action creator and typed props
  - No new linting errors introduced (pre-existing architectural decisions maintained)
- [x] **Add deleteClient effect to call API** ✅
  - Added DeleteClientResponse interface to `apps/frontend/src/app/clients/clients.service.ts`
  - Added deleteClient(id: string) method to ClientsService that calls DELETE /api/clients/:id
  - Returns Observable<DeleteClientResponse> matching backend response type
  - Added deleteClient, deleteClientSuccess, deleteClientFailure imports to `apps/frontend/src/app/clients/store/clients.effects.ts`
  - Implemented deleteClient$ effect that listens for deleteClient action
  - Effect calls clientsService.deleteClient() and dispatches success/failure actions
  - Follows existing NGRX effect pattern (switchMap, map, catchError)
  - No new linting errors introduced in effects file
- [x] **Update reducer to remove deleted client** ✅
  - Added deleteClient, deleteClientSuccess, deleteClientFailure imports to `apps/frontend/src/app/clients/store/clients.reducer.ts`
  - Added on(deleteClient) handler to set loading state
  - Added on(deleteClientSuccess) handler to filter deleted client from both clients and allClients arrays
  - Added on(deleteClientFailure) handler to set error state
  - Follows existing NGRX reducer pattern
  - No new linting errors introduced (pre-existing architectural decisions maintained)
- [x] **Add "Delete Client" button to client detail view** ✅
  - Added "Delete Client" button to action buttons section in `apps/frontend/src/app/clients/client-detail.component.ts`
  - Added delete-button CSS styling with red color (#dc3545) to indicate destructive action
  - Added deleteClient() method with placeholder implementation (logs to console)
  - Button appears alongside "Edit Client" and "Change Status" buttons
  - Button is only visible when not in edit or status change mode
  - No new linting errors introduced (pre-existing architectural decisions maintained)
  - Ready for next task: confirmation dialog implementation
- [x] **Add confirmation dialog component** ✅
  - Created `apps/frontend/src/app/shared/confirmation-dialog.component.ts`
  - Implemented reusable confirmation dialog with modern Angular patterns
  - Uses signal-based input() and output() functions
  - Uses OnPush change detection strategy
  - Includes accessibility features (ARIA attributes, keyboard support, focusability)
  - Supports escape key to cancel dialog
  - Backdrop click dismisses dialog
  - Customizable title, message, confirmText, and cancelText via inputs
  - Emits confirmed and cancelled events via outputs
  - Styled with red confirm button to indicate destructive action
  - No new linting errors (all accessibility requirements met)
- [ ] Handle delete success (navigate to list)
- [ ] Handle delete errors (show error message)
- [ ] Update client list to reflect deletion

## Notes
- Following event sourcing pattern: domain event → aggregate → command handler → projection
- Using TDD approach: tests first, then implementation
- One atomic task at a time
