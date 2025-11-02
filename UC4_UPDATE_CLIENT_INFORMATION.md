# Use Case 4: Update Client Information - Implementation Documentation

**Status**: In Progress
**Started**: 2025-11-02
**Completed**: TBD

---

## Overview

This document tracks the implementation of Use Case 4: Update Client Information.

**Goal**: Modify existing client information when details change

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
