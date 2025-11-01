# Angular-NestJS CQRS + Event Sourcing Monorepo

## Overview

Nx-managed monorepo implementing **Clean Architecture** + **CQRS** + **Event Sourcing** with Angular (frontend) and NestJS (backend).

### Core Principles

1. **Clean Architecture**: Domain → Application → Infrastructure layers with enforced boundaries
2. **CQRS**: Commands (writes) / Queries (reads) separation using `@nestjs/cqrs`
3. **Event Sourcing**: Events as source of truth; aggregates rebuilt by replaying events; optimized read models
4. **TDD**: Tests first, targeting application layer
5. **Enforced Boundaries**: ESLint-enforced module dependencies
6. **State Management**: NGRX (frontend), CQRS + Event Sourcing (backend)

---

## Project Structure

```
angular-nest-starter/
├── apps/
│   ├── api/                    # NestJS backend
│   └── frontend/               # Angular frontend (NGRX)
├── packages/
│   ├── domain/                 # Pure business logic (aggregates, events, value objects)
│   ├── application/            # CQRS handlers, ports, read models
│   ├── infrastructure/         # Event store, projections, external services
│   └── testing/                # Test utilities, builders, mocks
```

---

## Architecture Layers

### 1. Domain Layer (`packages/domain/`)

**Pure business logic** - No framework dependencies, no infrastructure concerns.

**Contains**:
- **Event-Sourced Aggregates** (`aggregates/`): Rebuild state by replaying events
- **Domain Events** (`events/`): Immutable facts stored in event store
- **Value Objects** (`value-objects/`): Email, Money, etc.
- **Base Classes** (`base/`): `EventSourcedAggregate`, `DomainEvent`

**Key Pattern**:
```typescript
export class UserAggregate extends EventSourcedAggregate {
  static create(id, email, passwordHash): UserAggregate {
    const user = new UserAggregate();
    user.applyEvent(new UserCreatedDomainEvent(id, email, passwordHash));
    return user;
  }

  apply(event): void {
    // Rebuild state from events
  }
}
```

**Dependencies**: Domain only

---

### 2. Application Layer (`packages/application/`)

**Orchestrates domain logic** using CQRS handlers. Uses ports (interfaces) for infrastructure.

**Contains**:
- **Commands & Handlers** (`commands/`, `commands/handlers/`): Write operations
- **Queries & Handlers** (`queries/`, `queries/handlers/`): Read operations (use read models)
- **Integration Events & Handlers** (`events/`, `events/handlers/`): Side effects
- **Sagas** (`sagas/`): Complex workflows
- **Ports** (`ports/`): `IEventStore`, `IReadRepository`, `ISnapshotStore`
- **Read Models** (`read-models/`): DTOs for queries

**Key Pattern**:
```typescript
@CommandHandler(CreateUserCommand)
export class CreateUserHandler {
  async execute(command): Promise<string> {
    const user = UserAggregate.create(id, email, hash);
    await this.eventStore.appendEvents(id, user.getUncommittedEvents());
    this.eventBus.publish(...); // Integration events
    return id;
  }
}
```

**Dependencies**: Application, Domain

---

### 3. Infrastructure Layer (`packages/infrastructure/`)

**Implements ports** and handles external systems.

**Contains**:
- **Event Store** (`event-store/`): Persists domain events (PostgreSQL, EventStoreDB, etc.)
- **Projections** (`projections/`): Build read models from domain events
- **Read Model Repositories** (`read-models/`): Optimized query databases
- **Snapshots** (`snapshots/`): Performance optimization for long event streams
- **External Services** (`services/`): APIs, email, etc.

**Key Pattern**:
```typescript
@EventsHandler(UserCreatedDomainEvent)
export class UserProjection implements IEventHandler {
  async handle(event: UserCreatedDomainEvent): Promise<void> {
    // Update read model database
  }
}
```

**Dependencies**: Infrastructure, Application, Domain

---

### 4. Testing Layer (`packages/testing/`)

Shared test utilities, builders, and mocks.

**Contains**: Test builders, mock event stores, mock repositories, test fixtures

**Dependencies**: All packages (for testing)

---

## CQRS + Event Sourcing Flow

**Commands** → Load aggregate → Execute business logic → Persist events → Publish integration events
**Queries** → Query read models (projections)
**Events** → Update projections + Trigger side effects

### Module Registration Example

```typescript
@Module({
  imports: [CqrsModule],
  providers: [
    ...CommandHandlers,  // Load aggregate, persist events
    ...QueryHandlers,    // Query read models
    ...EventHandlers,    // Side effects
    ...Projections,      // Build read models from events
    ...Sagas,            // Complex workflows
    { provide: 'IEventStore', useClass: EventStore },
    { provide: 'IUserReadRepository', useClass: UserReadRepository },
  ],
})
export class UsersModule {}
```

---

## Test-Driven Development (TDD)

### Workflow

1. Write test first (red)
2. Implement minimum code (green)
3. Refactor (keep green)

### Testing Strategy

- **Target**: Application layer (command/query/event handlers)
- **Framework**: Vitest (backend), `@analogjs/vitest-angular` (frontend)
- **Location**: `packages/testing/src/tests/`

### Test Focus

**Command Handlers**: Domain logic, event persistence, integration event publishing
**Query Handlers**: Read model queries, data transformation
**Event Handlers**: Side effects, external service calls
**Projections**: Read model updates from domain events

### Running Tests

```bash
nx test testing              # Run tests
nx test testing --watch      # Watch mode
nx test testing --coverage   # With coverage
```

---

## Module Boundaries

ESLint enforces dependency rules (`eslint.config.mjs`):

| Layer            | Can Depend On                                    |
|------------------|--------------------------------------------------|
| `domain`         | `domain` only (pure TypeScript)                  |
| `application`    | `application`, `domain`                          |
| `infrastructure` | `infrastructure`, `application`, `domain`        |
| `testing`        | All packages                                     |
| `api` (backend)  | `api`, `application`, `infrastructure`, `domain` |
| `frontend`       | `frontend` only (isolated)                       |

---

## Development Workflow

### Creating a New Feature (Event Sourced)

1. **Write tests first** (`packages/testing/`)
2. **Define domain events** (`domain/events/`) - Include event versioning
3. **Create aggregate** (`domain/aggregates/`) - Implement `apply()`, business logic
4. **Create CQRS handlers** (`application/`):
   - Command handlers: Load aggregate → Execute logic → Persist events
   - Query handlers: Query read models
   - Event handlers: Side effects
5. **Create projection** (`infrastructure/projections/`) - Build read models from events
6. **Wire up module** (`apps/api/`) - Register handlers, projections, event store
7. **Create API endpoint** (controllers)
8. **Integrate frontend** (NGRX)

### Code Placement Guidelines

| What                      | Where                                      |
|---------------------------|--------------------------------------------|
| Event-sourced aggregates  | `packages/domain/src/aggregates/`          |
| Domain events             | `packages/domain/src/events/`              |
| Base aggregate classes    | `packages/domain/src/base/`                |
| Value objects             | `packages/domain/src/value-objects/`       |
| Domain services           | `packages/domain/src/services/`            |
| Commands                  | `packages/application/src/commands/`       |
| Command handlers          | `packages/application/src/commands/handlers/` |
| Queries                   | `packages/application/src/queries/`        |
| Query handlers            | `packages/application/src/queries/handlers/` |
| Integration events        | `packages/application/src/events/`         |
| Event handlers (side effects) | `packages/application/src/events/handlers/` |
| Sagas                     | `packages/application/src/sagas/`          |
| Port interfaces           | `packages/application/src/ports/`          |
| Read models (DTOs)        | `packages/application/src/read-models/`    |
| Event store implementation| `packages/infrastructure/src/event-store/` |
| Snapshot store implementation| `packages/infrastructure/src/snapshots/` |
| Projections               | `packages/infrastructure/src/projections/` |
| Read model repositories   | `packages/infrastructure/src/read-models/` |
| External services         | `packages/infrastructure/src/services/`    |
| NestJS modules            | `apps/api/src/app/*/`                      |
| Controllers               | `apps/api/src/app/*/`                      |
| Test utilities            | `packages/testing/src/lib/`                |
| Test builders             | `packages/testing/src/builders/`           |
| Mocks                     | `packages/testing/src/mocks/`              |
| Tests                     | `packages/testing/src/tests/`              |

### Naming Conventions

**Commands**: `{Verb}{Noun}Command` (e.g., `CreateUserCommand`, `UpdateProfileCommand`)
**Queries**: `Get{Noun}Query` or `Find{Noun}Query` (e.g., `GetUserQuery`, `FindUsersByRoleQuery`)
**Domain Events**: `{Noun}{PastTenseVerb}DomainEvent` (e.g., `UserCreatedDomainEvent`, `PasswordChangedDomainEvent`)
**Integration Events**: `{Noun}{PastTenseVerb}Event` (e.g., `UserCreatedEvent`, `ProfileUpdatedEvent`)
**Aggregates**: `{Noun}Aggregate` (e.g., `UserAggregate`, `OrderAggregate`)
**Read Models**: `{Noun}ReadModel` (e.g., `UserReadModel`, `OrderSummaryReadModel`)
**Projections**: `{Noun}Projection` (e.g., `UserProjection`, `OrderProjection`)
**Handlers**: `{CommandOrQueryOrEvent}Handler` (e.g., `CreateUserHandler`, `GetUserHandler`)
**Tests**: `{HandlerName}.spec.ts` (e.g., `create-user.handler.spec.ts`)

---

## Event Sourcing Key Concepts

**Event Store**: Single source of truth. Append-only, immutable events.
**Aggregates**: Rebuild state by replaying events from event store.
**Projections**: Build optimized read models from events. Can be rebuilt anytime.
**Snapshots**: Performance optimization for aggregates with long event histories.
**Event Versioning**: Include version field in events; handle schema evolution gracefully.

### Critical Patterns

**Domain Events**: Stored in event store (e.g., `UserCreatedDomainEvent`)
**Integration Events**: Published to event bus for side effects (e.g., `UserCreatedEvent`)
**Optimistic Concurrency**: Check expected version when appending events
**Read Model Rebuilding**: Clear + replay all events to rebuild projections

---

## Best Practices

### Do's ✅

- Write tests BEFORE implementation (TDD)
- Keep domain layer pure (no framework dependencies)
- Use interfaces (ports) in application layer, implement in infrastructure
- Make commands and queries immutable
- Name events in past tense (they represent facts that happened)
- Use value objects for domain concepts
- Make domain events immutable and serializable
- Store all state changes as events in the event store
- Use event versioning from the start (include version field in events)
- Build read models from events (projections)
- Use optimistic concurrency control when appending events
- Keep handlers focused (Single Responsibility Principle)
- Use builders and mocks from testing package
- Separate domain events (stored) from integration events (published)

### Don'ts ❌

- Don't put business logic in controllers or infrastructure
- Don't import infrastructure code into domain or application layers
- Don't make commands or queries have behavior (they're just data)
- Don't use queries to modify state
- Don't mutate events after creation (they're immutable historical facts)
- Don't delete events from the event store (append-only)
- Don't query the event store for reads (use read models/projections)
- Don't bypass the aggregate when applying state changes
- Don't catch errors in handlers unless you can handle them meaningfully
- Don't skip tests because "it's simple code"
- Don't violate module boundaries (ESLint will catch this)
- Don't put tests in app or domain packages (use testing package)

---

## Useful Commands

```bash
# Development
nx serve api                  # Start backend (port 3000)
nx serve frontend             # Start frontend (port 4200)

# Testing
nx test testing               # Run tests
nx test testing --watch       # Watch mode
nx test testing --coverage    # With coverage

# Linting
nx lint api                   # Lint backend
nx lint frontend              # Lint frontend
nx run-many -t lint           # Lint all projects

# Building
nx build api                  # Build backend
nx build frontend             # Build frontend
nx run-many -t build          # Build all projects

# Code generation
nx g @nx/nest:module users apps/api/src/app
nx g @nx/nest:controller users apps/api/src/app/users
nx g @nx/nest:service users apps/api/src/app/users
```

---

## Additional Resources

### Documentation
- [NestJS CQRS Documentation](https://docs.nestjs.com/recipes/cqrs)
- [Nx Documentation](https://nx.dev)

### Architecture & Patterns
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [Event Sourcing by Martin Fowler](https://martinfowler.com/eaaDev/EventSourcing.html)
- [Domain-Driven Design and Event Sourcing](https://www.eventstore.com/event-sourcing)

### Event Sourcing Resources
- [EventStoreDB Documentation](https://www.eventstore.com/event-store-db)
- [Versioning in an Event Sourced System](https://leanpub.com/esversioning)
- [CQRS Journey by Microsoft](https://docs.microsoft.com/en-us/previous-versions/msp-n-p/jj554200(v=pandp.10))
- [Greg Young - CQRS and Event Sourcing](https://www.youtube.com/watch?v=JHGkaShoyNs)

---

## Questions or Issues?

This document should serve as the primary reference for understanding the codebase architecture and development practices. If you have questions or find areas needing clarification, please update this document to help future developers.
