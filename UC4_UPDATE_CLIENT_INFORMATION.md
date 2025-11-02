# Use Case 4: Update Client Information - Implementation Documentation

**Status**: In Progress (Backend Complete, Frontend Pending)
**Started**: 2025-11-02
**Completed**: TBD

---

## Overview

This document tracks the implementation of Use Case 4: Update Client Information.

**Goal**: Modify existing client information when details change

## Current Status Summary

**Backend (✅ Complete)**:
- Domain event: ClientInformationUpdatedDomainEvent
- Aggregate method: ClientAggregate.updateInformation()
- CQRS command: UpdateClientCommand
- Command handler: UpdateClientHandler
- API endpoint: PUT /api/clients/:id
- Projection: ClientProjection handles ClientInformationUpdatedDomainEvent
- Read model updates working via event-driven projections

**Frontend (⏳ In Progress)**:
- ClientsService.updateClient() method (✅ complete)
- NGRX update action (✅ complete)
- NGRX update effect (not started)
- NGRX reducer for update (not started)
- Edit form component (not started)
- UI integration with client detail view (not started)

---

## Implementation Tasks

### Task 1: Create ClientInformationUpdatedDomainEvent ✅
**Completed**: 2025-11-02
**Files**:
- `packages/domain/src/lib/events/client-information-updated.domain-event.ts`
- `packages/domain/src/index.ts`

**Description**: Created the `ClientInformationUpdatedDomainEvent` domain event that represents the update of client information. This event:
- Extends the base `DomainEvent` class
- Captures all client properties (companyName, email, phone, address, status, notes)
- Uses readonly properties to ensure immutability
- Supports event versioning (default version 1)
- Uses `ClientStatus` type from client-created event for consistency
- Follows event sourcing pattern where every state change is represented as an event

**Verification**: Linting passed successfully

---

### Task 2: Add updateInformation method to ClientAggregate ✅
**Completed**: 2025-11-02
**Files**:
- `packages/domain/src/lib/aggregates/client.aggregate.ts`

**Description**: Added the `updateInformation` method to the `ClientAggregate` to handle updating client information. This method:
- Accepts all client properties as parameters (companyName, email, phone, address, status, notes)
- Validates that the aggregate has been created (throws error if id is not set)
- Applies the `ClientInformationUpdatedDomainEvent`
- Updated the `apply` method to handle `ClientInformationUpdatedDomainEvent` for event sourcing replay
- Follows the event sourcing pattern where business logic is executed and events are applied

**Verification**: Linting passed successfully

---

### Task 3: Create UpdateClientCommand ✅
**Completed**: 2025-11-02
**Files**:
- `packages/application/src/lib/commands/update-client.command.ts`
- `packages/application/src/lib/application.ts`

**Description**: Created the `UpdateClientCommand` command class that represents the intent to update client information. This command:
- Contains all fields needed to update a client (id, companyName, email, phone, address, status, notes)
- Uses readonly properties following CQRS pattern (commands are immutable data)
- Includes the client id to identify which client to update
- Uses `ClientStatus` type from domain layer for type safety
- Exported from the application package for use in the API layer
- Follows naming convention: `{Verb}{Noun}Command`

**Verification**: Linting passed successfully

---

### Task 4: Create UpdateClientHandler ✅
**Completed**: 2025-11-02
**Files**:
- `packages/application/src/lib/commands/handlers/update-client.handler.ts`
- `packages/application/src/lib/application.ts`

**Description**: Created the `UpdateClientHandler` command handler that processes update client commands. This handler:
- Implements `ICommandHandler<UpdateClientCommand>` following CQRS pattern
- Loads the existing client aggregate from the event store using `getEvents()`
- Reconstructs the aggregate state by replaying all events
- Calls the `updateInformation()` method on the aggregate with updated values
- Uses optimistic concurrency control by passing the current version to `appendEvents()`
- Persists new domain events to the event store
- Publishes domain events to the event bus to trigger projections
- Returns the client ID upon successful completion
- Exported from the application package for registration in the API module

**Verification**: Linting passed successfully

---

### Task 5: Register UpdateClientHandler in ClientsModule ✅
**Completed**: 2025-11-02
**Files**:
- `apps/api/src/app/clients/clients.module.ts`

**Description**: Registered the `UpdateClientHandler` in the `ClientsModule` to enable command processing. This registration:
- Imported `UpdateClientHandler` from the application package
- Added it to the `CommandHandlers` array in the module
- Enables the CQRS infrastructure to route `UpdateClientCommand` to the handler
- Follows the same pattern as `CreateClientHandler` registration
- Completes the backend wiring for the update client functionality

**Verification**: Linting passed successfully

---

### Task 6: Add PUT endpoint for updating client ✅
**Completed**: 2025-11-02
**Files**:
- `apps/api/src/app/clients/clients.controller.ts`

**Description**: Added a PUT endpoint to the `ClientsController` for updating existing clients. This endpoint:
- Created `UpdateClientDto` class with all client fields (companyName, email, phone, address, status, notes)
- Imported `Put` decorator and `UpdateClientCommand` from necessary packages
- Implemented `@Put(':id')` endpoint that accepts client ID as URL parameter
- Accepts `UpdateClientDto` in request body with updated client information
- Creates an `UpdateClientCommand` with the ID and DTO data
- Executes the command through the command bus
- Returns the client ID in response format `{ id: string }`
- Follows the same pattern as the POST endpoint for consistency
- Completes the backend API layer for UC4

**Verification**: Linting passed successfully

---

### Task 7: Add ClientInformationUpdatedDomainEvent handler to ClientProjection ✅
**Completed**: 2025-11-02
**Files**:
- `packages/infrastructure/src/lib/projections/client.projection.ts`

**Description**: Updated the `ClientProjection` to handle the `ClientInformationUpdatedDomainEvent` for updating read models. This update:
- Imported `ClientInformationUpdatedDomainEvent` from the domain package
- Added `ClientInformationUpdatedDomainEvent` to the `@EventsHandler` decorator
- Updated the `implements` clause to handle both event types
- Modified the `handle` method to check event type using `instanceof`
- Transforms `ClientInformationUpdatedDomainEvent` into `ClientReadModel` DTO
- Calls `save()` on the read repository to persist the updated read model
- Enables the read model to stay in sync with the event store when clients are updated
- Follows the same pattern as the `ClientCreatedDomainEvent` handler
- Completes the projection layer for UC4

**Verification**: Linting passed successfully

---

### Task 8: Add updateClient method to ClientsService ✅
**Completed**: 2025-11-02
**Files**:
- `apps/frontend/src/app/clients/clients.service.ts`

**Description**: Added the `updateClient()` method to the `ClientsService` for making HTTP PUT requests to update existing clients. This implementation:
- Created `UpdateClientDto` interface with all client fields (companyName, email, phone, address, status, notes)
- Created `UpdateClientResponse` interface with the expected response shape (id)
- Implemented `updateClient(id: string, dto: UpdateClientDto)` method that:
  - Accepts client ID as first parameter
  - Accepts UpdateClientDto as second parameter
  - Returns Observable<UpdateClientResponse>
  - Makes HTTP PUT request to `/api/clients/{id}` with the DTO payload
- Follows the same pattern as `createClient()` for consistency
- Uses modern Angular patterns (inject() function, typed interfaces)
- Enables the Angular app to communicate with the backend API for client updates

**Verification**: Linting passed successfully (eslint apps/frontend/src/app/clients/clients.service.ts)

---

### Task 9: Create NGRX update client actions ✅
**Completed**: 2025-11-02
**Files**:
- `apps/frontend/src/app/clients/store/clients.actions.ts`

**Description**: Added NGRX actions for updating clients in the state management layer. This implementation:
- Created `updateClient` action with props for all client fields (id, companyName, email, phone, address, status, notes)
- Created `updateClientSuccess` action to handle successful updates (returns id)
- Created `updateClientFailure` action to handle errors (returns error string)
- Follows the same pattern as `loadClients` actions for consistency
- Uses NGRX `createAction` and `props` for type-safe action creation
- Uses action naming convention: `[Clients] {Action Name}`
- Enables the frontend to dispatch update client commands to the NGRX store
- Will be connected to effects in next task to trigger API calls

**Verification**: Linting passed successfully (eslint apps/frontend/src/app/clients/store/clients.actions.ts)

---

