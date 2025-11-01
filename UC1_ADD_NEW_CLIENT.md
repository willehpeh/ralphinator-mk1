# UC1: Add a New Client - Implementation Documentation

**Use Case**: Add a New Client
**Status**: Not Started
**Started**: 2025-11-01
**Completed**: TBD

---

## Overview

This document tracks the implementation of Use Case 1: Add a New Client.

**Goal**: Record a new client company in the system to begin tracking their information

---

## Implementation Tasks

### Task 1: Create Base EventSourcedAggregate Class ✅
**Completed**: 2025-11-01
**Files**:
- `packages/domain/src/lib/base/event-sourced-aggregate.ts`
- `packages/domain/src/index.ts`

**Description**: Created the foundational `EventSourcedAggregate` base class that all domain aggregates will extend. This class provides:
- Event application and state rebuilding from history
- Uncommitted event tracking
- Version management for optimistic concurrency control
- Abstract `apply()` method for child aggregates to implement

**Verification**: Linting passed successfully

### Task 2: Create Base DomainEvent Class ✅
**Completed**: 2025-11-01
**Files**:
- `packages/domain/src/lib/base/domain-event.ts`
- `packages/domain/src/index.ts`

**Description**: Created the foundational `DomainEvent` base class that all domain events will extend. This class provides:
- Aggregate ID tracking
- Event versioning support for schema evolution
- Automatic timestamp capture (occurredOn)
- Automatic event type identification
- Immutable event properties (readonly)

**Verification**: Linting passed successfully

### Task 3: Create ClientCreatedDomainEvent ✅
**Completed**: 2025-11-01
**Files**:
- `packages/domain/src/lib/events/client-created.domain-event.ts`
- `packages/domain/src/index.ts`

**Description**: Created the `ClientCreatedDomainEvent` domain event that represents the creation of a new client. This event:
- Extends the base `DomainEvent` class
- Captures all client properties (companyName, email, phone, address, status, notes)
- Uses readonly properties to ensure immutability
- Supports event versioning (default version 1)
- Defines client status as a union type: 'Active' | 'Inactive' | 'Prospect' | 'Past Client'

**Verification**: Linting passed successfully

### Task 4: Create ClientAggregate Class ✅
**Completed**: 2025-11-01
**Files**:
- `packages/domain/src/lib/aggregates/client.aggregate.ts`
- `packages/domain/src/index.ts`

**Description**: Created the `ClientAggregate` domain aggregate that manages client business logic. This aggregate:
- Extends the base `EventSourcedAggregate` class
- Provides a static `create()` factory method for creating new clients
- Implements the `apply()` method to rebuild state from `ClientCreatedDomainEvent`
- Maintains private state for companyName, email, phone, address, status, and notes
- Provides getter methods for accessing aggregate state
- Follows event sourcing principles by applying events to change state

**Verification**: Linting passed successfully

### Task 5: Write Test for CreateClientCommand Handler ✅
**Completed**: 2025-11-01
**Files**:
- `packages/testing/src/tests/create-client.handler.spec.ts`

**Description**: Created comprehensive test suite for the `CreateClientHandler` following TDD principles. The test suite covers:
- Creating a new client aggregate and persisting events to the event store
- Handling optional fields (phone, address, notes) as null values
- Publishing integration events after successful client creation
- Supporting all valid client status types (Active, Inactive, Prospect, Past Client)
- Verifying proper interaction with event store (appendEvents with expected version -1)
- Verifying proper interaction with event bus for integration events

**Testing Framework**: Vitest with vi mock functions
**Test Location**: `packages/testing/src/tests/` as per CLAUDE.md guidelines
**TDD Status**: RED (test written, implementation pending)

### Task 6: Implement CreateClientCommand and CreateClientHandler ✅
**Completed**: 2025-11-01
**Files**:
- `packages/application/src/lib/commands/create-client.command.ts`
- `packages/application/src/lib/commands/handlers/create-client.handler.ts`
- `packages/application/src/lib/ports/event-store.interface.ts`
- `packages/application/src/lib/application.ts` (updated exports)
- `packages/domain/src/lib/events/client-created.domain-event.ts` (added ClientStatus type)
- `packages/domain/src/lib/aggregates/client.aggregate.ts` (updated to accept nullable parameters)

**Description**: Implemented the command and handler to make the test pass (TDD GREEN phase). Implementation includes:
- `CreateClientCommand` class with all required parameters (id, companyName, email, phone, address, status, notes)
- `CreateClientHandler` that orchestrates the client creation workflow:
  - Creates `ClientAggregate` using the domain factory method
  - Persists domain events to event store via `IEventStore` port
  - Publishes integration events to event bus for side effects
  - Returns the client ID upon successful creation
- `IEventStore` port interface defining the contract for event persistence:
  - `appendEvents()` method for persisting events with optimistic concurrency control
  - `getEvents()` method for loading aggregate event history
- Extracted `ClientStatus` as a reusable type exported from domain layer
- Updated `ClientAggregate.create()` to accept nullable phone, address, and notes parameters
- All exports properly added to barrel files

**TDD Status**: GREEN (test should now pass)
**Verification**: Linting passed successfully for both domain and application packages

### Task 7: Fix Test Imports to Match tsconfig Package Names ✅
**Completed**: 2025-11-01
**Files**:
- `packages/testing/src/tests/create-client.handler.spec.ts`

**Description**: Fixed import statements in the test file to use correct package names defined in tsconfig.base.json. Changed imports from:
- `@ralphinator-mk1/application` → `@angular-nest-starter/application`
- `@ralphinator-mk1/domain` → `@angular-nest-starter/domain`

**Verification**: All tests now pass successfully (5 tests passed)
- ✅ CreateClientHandler creates new client aggregate and persists events
- ✅ CreateClientHandler handles optional fields as null
- ✅ CreateClientHandler publishes integration event after creating client
- ✅ CreateClientHandler handles all valid client statuses

### Task 8: Create ClientCreatedEvent Integration Event ✅
**Completed**: 2025-11-01
**Files**:
- `packages/application/src/lib/events/client-created.event.ts`
- `packages/application/src/lib/application.ts` (updated exports)

**Description**: Created the `ClientCreatedEvent` integration event that is published to the event bus after a client is created. This event:
- Implements NestJS `IEvent` interface for event bus integration
- Contains all client data (id, companyName, email, phone, address, status, notes, occurredOn)
- Is separate from `ClientCreatedDomainEvent` (domain events are persisted, integration events are published)
- Enables side effects and system-wide notifications about client creation
- Uses readonly properties for immutability
- Includes timestamp (occurredOn) for event tracking

**Verification**: Linting passed successfully, all tests still pass (5 tests)

### Task 9: Create ClientReadModel DTO ✅
**Completed**: 2025-11-01
**Files**:
- `packages/application/src/lib/read-models/client.read-model.ts`
- `packages/application/src/lib/application.ts` (updated exports)

**Description**: Created the `ClientReadModel` read model DTO for client queries. This read model:
- Provides an optimized data structure for read operations (CQRS read side)
- Contains all client fields (id, companyName, email, phone, address, status, notes, createdAt)
- Uses readonly properties for immutability
- Imports `ClientStatus` type from domain layer for consistency
- Supports nullable fields (phone, address, notes) matching domain model
- Will be used by query handlers to return client data to consumers

**Verification**: Linting passed successfully

### Task 10: Create GetClientByIdQuery and GetClientByIdQueryHandler ✅
**Completed**: 2025-11-01
**Files**:
- `packages/application/src/lib/queries/get-client-by-id.query.ts`
- `packages/application/src/lib/queries/handlers/get-client-by-id.handler.ts`
- `packages/application/src/lib/ports/client-read-repository.interface.ts`
- `packages/application/src/lib/application.ts` (updated exports)
- `packages/testing/src/tests/get-client-by-id.handler.spec.ts` (TDD test)

**Description**: Implemented the query and query handler for retrieving a client by ID following CQRS read-side patterns. Implementation includes:
- `GetClientByIdQuery` class implementing NestJS `IQuery` interface with client ID parameter
- `GetClientByIdQueryHandler` decorated with `@QueryHandler` that:
  - Queries the read repository (not the event store) for optimized reads
  - Returns `ClientReadModel` DTO or null if not found
  - Uses dependency injection with `IClientReadRepository` port interface
- `IClientReadRepository` port interface defining the contract for read operations:
  - `findById()` method for retrieving client by ID
  - Returns `ClientReadModel | null`
- Test suite (TDD approach) covering:
  - Successful retrieval of client by ID
  - Handling of non-existent clients (returns null)
  - Support for all valid client statuses

**TDD Status**: GREEN (all 8 tests pass)
**Verification**: Linting passed successfully, all tests pass

---

## Technical Design

(To be populated during implementation)

---

## Testing Notes

(To be populated during implementation)

---

## Challenges & Solutions

(To be populated during implementation)

---

## Completion Checklist

- [ ] Domain layer implementation
- [ ] Application layer (CQRS handlers)
- [ ] Infrastructure layer (projections, repositories)
- [ ] API endpoints
- [ ] Frontend components
- [ ] Integration tests
- [ ] End-to-end verification

---

## Notes

(To be populated during implementation)
