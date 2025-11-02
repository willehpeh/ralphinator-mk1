# Comprehensive Refactoring Opportunities Analysis

## Summary
This analysis identifies **10 new refactoring opportunities** beyond the previously completed work (BaseCommandHandler, BaseQueryHandler, ClientAggregateBuilder, ClientData.fromPayload factory). The codebase is well-structured but has clear opportunities to reduce test boilerplate, improve mock factory flexibility, and add missing test coverage.

---

## 1. Command Handler Test Boilerplate - Setup Pattern (HIGH PRIORITY)

### Current State
All command handler tests (CreateClientHandler, UpdateClientHandler, DeleteClientHandler, ChangeClientStatusHandler) repeat the same setup pattern:

**Location**: `/packages/testing/src/tests/`

**Pattern Found**:
```typescript
// Repeated in every command handler test
let handler: SomeHandler;
let mockAggregateRepository: ReturnType<typeof createMockAggregateRepository>['mockRepository'];
let getSavedAggregate: ReturnType<typeof createMockAggregateRepository>['getSavedAggregate'];

beforeEach(() => {
  const mocks = createMockAggregateRepository();
  mockAggregateRepository = mocks.mockRepository;
  getSavedAggregate = mocks.getSavedAggregate;
  handler = new SomeHandler(mockAggregateRepository);
});
```

**Files Affected**:
- `/packages/testing/src/tests/create-client.handler.spec.ts` (lines 5-18)
- `/packages/testing/src/tests/update-client.handler.spec.ts` (lines 7-18)
- `/packages/testing/src/tests/delete-client.handler.spec.ts` (lines 7-18)
- `/packages/testing/src/tests/change-client-status.handler.spec.ts` (lines 7-18)

**Opportunity**: Extract into a reusable factory function that returns initialized handler and mock utilities.

**Proposed Solution**: 
Create `createCommandHandlerTestSetup<THandler, TCommand>()` function in `/packages/testing/src/lib/test-setup.ts`:

```typescript
export function createCommandHandlerTestSetup<THandler extends BaseCommandHandler<any>>(
  handlerConstructor: new (repo: any) => THandler
): {
  handler: THandler;
  mockRepository: ReturnType<typeof createMockAggregateRepository>['mockRepository'];
  getSavedAggregate: ReturnType<typeof createMockAggregateRepository>['getSavedAggregate'];
  resetSavedAggregate: ReturnType<typeof createMockAggregateRepository>['resetSavedAggregate'];
} {
  const mocks = createMockAggregateRepository();
  const handler = new handlerConstructor(mocks.mockRepository);
  
  return {
    handler,
    mockRepository: mocks.mockRepository,
    getSavedAggregate: mocks.getSavedAggregate,
    resetSavedAggregate: mocks.resetSavedAggregate,
  };
}
```

**Usage**:
```typescript
describe('CreateClientHandler', () => {
  const { handler, mockRepository, getSavedAggregate } = 
    createCommandHandlerTestSetup(CreateClientHandler);

  beforeEach(() => {
    mockRepository.save.mockClear();
  });

  // ... tests
});
```

**Impact**: 
- Eliminates 10 lines of boilerplate per test file
- Makes test intent clearer
- Reduces maintenance burden across 4 test files
- Consistent pattern for all command handler tests

---

## 2. Query Handler Test Boilerplate - Setup Pattern (HIGH PRIORITY)

### Current State
Query handler tests (GetAllClientsQueryHandler, GetClientByIdQueryHandler) repeat similar setup:

**Location**: `/packages/testing/src/tests/`

**Pattern Found**:
```typescript
let handler: SomeQueryHandler;
let mockReadRepository: ReturnType<typeof createMockReadRepository>;

beforeEach(() => {
  mockReadRepository = createMockReadRepository();
  handler = new SomeQueryHandler(mockReadRepository);
});
```

**Files Affected**:
- `/packages/testing/src/tests/get-all-clients.handler.spec.ts` (lines 5-13)
- `/packages/testing/src/tests/get-client-by-id.handler.spec.ts` (lines 5-13)

**Opportunity**: Extract into a `createQueryHandlerTestSetup<THandler>()` factory function.

**Proposed Solution**:
```typescript
export function createQueryHandlerTestSetup<THandler extends BaseQueryHandler<any, any>>(
  handlerConstructor: new (repo: any) => THandler
): {
  handler: THandler;
  mockRepository: ReturnType<typeof createMockReadRepository>;
} {
  const mockRepository = createMockReadRepository();
  const handler = new handlerConstructor(mockRepository);
  
  return { handler, mockRepository };
}
```

**Usage**:
```typescript
describe('GetAllClientsQueryHandler', () => {
  const { handler, mockRepository } = 
    createQueryHandlerTestSetup(GetAllClientsQueryHandler);

  // ... tests
});
```

**Impact**:
- Eliminates boilerplate from query handler tests
- Consistent with command handler test setup pattern
- Reduces maintenance burden across 2 test files

---

## 3. Enhanced Mock Factory with findByStatus Method (MEDIUM PRIORITY)

### Current State
The `createMockReadRepository()` in `/packages/testing/src/lib/mock-factories.ts` (lines 61-66) only provides:
- `findAll()`
- `findById()`

**Missing**: `findByStatus()` method is used in `GetClientsByStatusQueryHandler` but:
1. Mock factory doesn't include it
2. No test exists for this handler

**Location of Usage**: `/packages/application/src/lib/queries/handlers/get-clients-by-status.handler.ts` (line 22)

**Opportunity**: Update mock factory to include all IClientReadRepository methods.

**Current Code**:
```typescript
export function createMockReadRepository() {
  return {
    findAll: vi.fn(),
    findById: vi.fn(),
  };
}
```

**Proposed Enhancement**:
```typescript
export function createMockReadRepository() {
  return {
    findAll: vi.fn(),
    findById: vi.fn(),
    findByStatus: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
  };
}
```

**Impact**:
- Enables complete testing of GetClientsByStatusQueryHandler
- Completes mock repository interface coverage
- Provides foundation for testing filter operations

---

## 4. Mock Factory - Missing delete() Method (MEDIUM PRIORITY)

### Current State
The `createMockReadRepository()` doesn't include a `delete()` method, yet the actual repository interface and ClientProjection use it:

**Location**: `/packages/infrastructure/src/lib/projections/client.projection.ts` (line 118)

**Code**:
```typescript
await this.clientReadRepository.delete(event.aggregateId);
```

**Opportunity**: Enhance `createMockReadRepository()` to include `delete()` method for complete interface coverage (see #3 above).

**Impact**:
- Makes mock repository interface complete and accurate
- Enables future projection testing
- Better alignment with actual repository contract

---

## 5. Test Data Factory - ClientReadModelBuilder (MEDIUM PRIORITY)

### Current State
Query handler tests create read model objects inline with literal object syntax, with significant repetition:

**Example from get-all-clients.handler.spec.ts (lines 17-37)**:
```typescript
const expectedClients = [
  {
    id: 'client-1',
    companyName: 'Acme Corp',
    email: 'contact@acme.com',
    phone: '555-1234',
    address: '123 Main St',
    status: 'Active' as const,
    notes: 'Test client 1',
    createdAt: new Date('2025-11-01'),
  },
  // ... 70+ more lines with similar pattern
];
```

**Similar Code Locations**:
- `get-all-clients.handler.spec.ts` (lines 17-109) - 93 lines of test data
- `get-client-by-id.handler.spec.ts` (lines 17-72) - 56 lines of test data

**Opportunity**: Create a `ClientReadModelBuilder` similar to existing `ClientAggregateBuilder` for fluent test data creation.

**Proposed Implementation** in `/packages/testing/src/lib/builders/client-read-model.builder.ts`:
```typescript
export class ClientReadModelBuilder {
  private id = 'test-client-id';
  private companyName = 'Test Company';
  private email = 'test@example.com';
  private phone: string | null = null;
  private address: string | null = null;
  private status: ClientStatus = 'Active';
  private notes: string | null = null;
  private createdAt = new Date();

  withId(id: string): ClientReadModelBuilder { this.id = id; return this; }
  withCompanyName(name: string): ClientReadModelBuilder { this.companyName = name; return this; }
  withEmail(email: string): ClientReadModelBuilder { this.email = email; return this; }
  withPhone(phone: string | null): ClientReadModelBuilder { this.phone = phone; return this; }
  withAddress(address: string | null): ClientReadModelBuilder { this.address = address; return this; }
  withStatus(status: ClientStatus): ClientReadModelBuilder { this.status = status; return this; }
  withNotes(notes: string | null): ClientReadModelBuilder { this.notes = notes; return this; }
  withCreatedAt(createdAt: Date): ClientReadModelBuilder { this.createdAt = createdAt; return this; }

  build(): ClientReadModel {
    return {
      id: this.id,
      companyName: this.companyName,
      email: this.email,
      phone: this.phone,
      address: this.address,
      status: this.status,
      notes: this.notes,
      createdAt: this.createdAt,
    };
  }
}
```

**Usage**:
```typescript
const expectedClient = new ClientReadModelBuilder()
  .withId('client-1')
  .withCompanyName('Acme Corp')
  .withEmail('contact@acme.com')
  .withPhone('555-1234')
  .withStatus('Active')
  .withCreatedAt(new Date('2025-11-01'))
  .build();
```

**Impact**:
- Reduces test setup code by 70+ lines per test file
- Improves readability and test intent clarity
- Makes test data creation consistent with command handler tests
- Enables easier modification of test data structure in the future
- Better test maintainability

---

## 6. Common Assertion Helpers for Command Handler Tests (MEDIUM PRIORITY)

### Current State
Command handler tests that use `executeOnAggregate()` pattern have repeated verification assertions:

**Example verification patterns**:

From `update-client.handler.spec.ts` (lines 50-51):
```typescript
expect(mockAggregateRepository.load).toHaveBeenCalledWith('client-123', ClientAggregate);
expect(mockAggregateRepository.save).toHaveBeenCalledTimes(1);
```

From `delete-client.handler.spec.ts` (lines 43, 66-67):
```typescript
expect(mockAggregateRepository.load).toHaveBeenCalledWith(clientId, ClientAggregate);
expect(mockAggregateRepository.save).toHaveBeenCalledTimes(1);
```

From `change-client-status.handler.spec.ts` (lines 39-40):
```typescript
expect(mockAggregateRepository.load).toHaveBeenCalledWith('client-123', ClientAggregate);
expect(mockAggregateRepository.save).toHaveBeenCalledTimes(1);
```

**Opportunity**: Create helper functions in `/packages/testing/src/lib/test-helpers.ts` for common assertions.

**Proposed Implementation**:
```typescript
export function assertLoadCalledWith(
  mockRepo: ReturnType<typeof createMockAggregateRepository>['mockRepository'],
  expectedId: string,
  expectedAggregateType: new () => EventSourcedAggregate
): void {
  expect(mockRepo.load).toHaveBeenCalledWith(expectedId, expectedAggregateType);
}

export function assertLoadAndSaveCalledOnce(
  mockRepo: ReturnType<typeof createMockAggregateRepository>['mockRepository'],
  expectedId: string,
  expectedAggregateType: new () => EventSourcedAggregate
): void {
  assertLoadCalledWith(mockRepo, expectedId, expectedAggregateType);
  expect(mockRepo.save).toHaveBeenCalledTimes(1);
}

export function assertSaveNotCalled(
  mockRepo: ReturnType<typeof createMockAggregateRepository>['mockRepository']
): void {
  expect(mockRepo.save).not.toHaveBeenCalled();
}

export function assertSaveCalledTimes(
  mockRepo: ReturnType<typeof createMockAggregateRepository>['mockRepository'],
  times: number
): void {
  expect(mockRepo.save).toHaveBeenCalledTimes(times);
}
```

**Usage**:
```typescript
it('should load and save aggregate', async () => {
  // ... test setup
  
  await handler.execute(command);
  
  assertLoadAndSaveCalledOnce(mockRepository, 'client-123', ClientAggregate);
});
```

**Impact**:
- Reduces assertion boilerplate across all command handler tests
- Makes common patterns explicit and named
- Easier to enforce consistent test patterns
- Centralized assertion logic for maintenance

---

## 7. Create ReadModel Factory for Consistent Test Data (LOW PRIORITY)

### Current State
Read model test data appears in multiple test formats. Compare with domain layer pattern:

**Domain Pattern**: `ClientData.fromPayload()` factory method in `/packages/domain/src/lib/value-objects/client-data.value-object.ts`

**Opportunity**: Create `ClientReadModelData.fromPayload()` factory method for read models.

**Proposed Implementation** in `/packages/application/src/lib/read-models/`:
```typescript
export class ClientReadModelData {
  constructor(
    public readonly companyName: string,
    public readonly email: string,
    public readonly phone: string | null = null,
    public readonly address: string | null = null,
    public readonly status: ClientStatus = 'Active',
    public readonly notes: string | null = null
  ) {}

  static fromPayload(payload: ClientDataPayload): ClientReadModelData {
    return new ClientReadModelData(
      payload.companyName,
      payload.email,
      payload.phone,
      payload.address,
      payload.status,
      payload.notes
    );
  }
}
```

**Impact**:
- Consistent with domain layer patterns
- Enables easier test data creation
- Could be used by both tests and infrastructure layers
- Better separation of concerns

---

## 8. Test Utility Organization - Builders Package Export (LOW PRIORITY)

### Current State
`mock-factories.ts` re-exports `ClientAggregateBuilder`:
```typescript
export { ClientAggregateBuilder } from './builders/client-aggregate.builder';
```

If we add `ClientReadModelBuilder` (from #5), we'll have multiple builder exports scattered.

**Opportunity**: Create `builders/index.ts` to organize all builders centrally.

**Proposed Structure**:
```
packages/testing/src/lib/builders/
├── index.ts                          (new barrel export)
├── client-aggregate.builder.ts
└── client-read-model.builder.ts      (new from #5)
```

**Content of builders/index.ts**:
```typescript
export { ClientAggregateBuilder } from './client-aggregate.builder';
export { ClientReadModelBuilder } from './client-read-model.builder';
```

**Update mock-factories.ts**:
```typescript
export { ClientAggregateBuilder, ClientReadModelBuilder } from './builders';
```

**Impact**:
- Cleaner import statements in tests
- Better code organization as builders grow
- Follows standard barrel export pattern
- Easier to discover available builders

---

## 9. Missing Test Coverage - GetClientsByStatusQueryHandler (MEDIUM PRIORITY)

### Current State
No test file exists for `GetClientsByStatusQueryHandler`.

**Handler Location**: `/packages/application/src/lib/queries/handlers/get-clients-by-status.handler.ts`

**Handler Code**:
```typescript
@QueryHandler(GetClientsByStatusQuery)
export class GetClientsByStatusQueryHandler
  extends BaseQueryHandler<GetClientsByStatusQuery, ClientReadModel[]>
  implements IQueryHandler<GetClientsByStatusQuery, ClientReadModel[]>
{
  async execute(query: GetClientsByStatusQuery): Promise<ClientReadModel[]> {
    return this.readRepository.findByStatus(query.status);
  }
}
```

**Opportunity**: Create comprehensive test file `/packages/testing/src/tests/get-clients-by-status.handler.spec.ts`.

**Proposed Test Cases**:
1. Should retrieve clients by Active status
2. Should retrieve clients by Inactive status
3. Should retrieve clients by Prospect status
4. Should retrieve clients by Past Client status
5. Should return empty array when no clients match status
6. Should handle multiple clients with same status
7. Should not return clients with different statuses
8. Should call findByStatus with correct status parameter

**Impact**:
- Completes query handler test coverage (currently 2/3 covered)
- Validates filtering logic works correctly
- Ensures projection handles status-based queries properly
- Improves test suite comprehensiveness

---

## 10. Mock Repository Interface Consistency (LOW PRIORITY)

### Current State
The `createMockReadRepository()` (lines 61-66) only partially implements `IClientReadRepository`.

**Current Implementation**:
```typescript
export function createMockReadRepository() {
  return {
    findAll: vi.fn(),
    findById: vi.fn(),
  };
}
```

**Actual IClientReadRepository Methods** (inferred from usage):
- `findAll()` ✓ Implemented
- `findById(id: string)` ✓ Implemented
- `findByStatus(status: ClientStatus)` ✗ Missing (used in #3, #9)
- `save(readModel: ClientReadModel)` ✗ Missing (used in projections)
- `delete(id: string)` ✗ Missing (used in ClientProjection, line 118)

**Opportunity**: Ensure mock includes all methods from actual interface (see #3 above for implementation).

**Impact**:
- Better mock accuracy and completeness
- Prevents runtime surprises
- Encourages test expansion for all repository methods
- Full interface contract coverage

---

## Summary Table

| # | Opportunity | Priority | Effort | Impact | Files Affected |
|---|-------------|----------|--------|--------|-----------------|
| 1 | Command Handler Test Setup Factory | HIGH | Low | Reduces boilerplate | 4 handler specs |
| 2 | Query Handler Test Setup Factory | HIGH | Low | Reduces boilerplate | 2 handler specs |
| 3 | Add findByStatus to Mock Factory | MEDIUM | Low | Test coverage | mock-factories.ts |
| 4 | Add delete() to Mock Repository | MEDIUM | Low | Mock completeness | mock-factories.ts |
| 5 | ClientReadModelBuilder | MEDIUM | Medium | Query test cleanup | Query handler specs |
| 6 | Common Assertion Helpers | MEDIUM | Low | Assertion boilerplate | Command handler specs |
| 7 | ClientReadModelData Factory | LOW | Low | Pattern consistency | Testing utilities |
| 8 | Organize Builders Exports | LOW | Very Low | Code organization | builders/* |
| 9 | GetClientsByStatusQueryHandler Tests | MEDIUM | Medium | Test coverage | New spec file |
| 10 | Mock Repository Interface Alignment | LOW | Low | Mock accuracy | mock-factories.ts |

---

## Recommended Implementation Order

### Phase 1: Quick Wins (1-2 hours)
1. **Setup Factories** (#1, #2): Create test setup factory functions
2. **Mock Factory Enhancement** (#3, #4, #10): Add missing mock methods

### Phase 2: Coverage (2-3 hours)
3. **Missing Test** (#9): Create GetClientsByStatusQueryHandler tests
4. **Test Builders** (#5): Create ClientReadModelBuilder

### Phase 3: Polish (1-2 hours)
5. **Assertion Helpers** (#6): Add common test assertion functions
6. **Organization** (#7, #8): Create factories and reorganize exports

---

## Code Locations Reference

### Key Files to Modify
- `/packages/testing/src/lib/mock-factories.ts` - Add setup factories and enhance mocks
- `/packages/testing/src/lib/builders/` - Add ClientReadModelBuilder
- `/packages/testing/src/lib/test-helpers.ts` - NEW: Add assertion helpers
- `/packages/testing/src/tests/` - Update existing tests and add missing test
- `/packages/testing/src/lib/test-setup.ts` - NEW: Add setup factories

### Files to Create
- `/packages/testing/src/lib/builders/index.ts` - Barrel export for builders
- `/packages/testing/src/lib/builders/client-read-model.builder.ts` - Read model builder
- `/packages/testing/src/lib/test-helpers.ts` - Common assertion helpers
- `/packages/testing/src/lib/test-setup.ts` - Setup factory functions
- `/packages/testing/src/tests/get-clients-by-status.handler.spec.ts` - Missing test

### Existing Tests to Update
- `/packages/testing/src/tests/create-client.handler.spec.ts` - Use setup factory
- `/packages/testing/src/tests/update-client.handler.spec.ts` - Use setup factory and builders
- `/packages/testing/src/tests/delete-client.handler.spec.ts` - Use setup factory
- `/packages/testing/src/tests/change-client-status.handler.spec.ts` - Use setup factory and assertion helpers
- `/packages/testing/src/tests/get-all-clients.handler.spec.ts` - Use setup factory and builders
- `/packages/testing/src/tests/get-client-by-id.handler.spec.ts` - Use setup factory and builders

---

## Architecture Benefits

These refactorings align with CQRS and Clean Architecture principles:

1. **Reduced Boilerplate**: Less test code means fewer bugs and faster feature development
2. **Consistency**: Uniform patterns across all handler tests
3. **Maintainability**: Changes to test setup only need to happen in one place
4. **Clarity**: Builder patterns make test data intent explicit
5. **Completeness**: Full test coverage for all query handlers
6. **Testability**: Better mocking infrastructure for future components

