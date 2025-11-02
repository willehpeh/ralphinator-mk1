import { vi } from 'vitest';

// Re-export builders for convenience
export { ClientAggregateBuilder } from './builders/client-aggregate.builder';

/**
 * Creates a mock aggregate repository for testing command handlers.
 *
 * @template T - The type of aggregate being managed by the repository
 * @returns Mock repository with save and load methods that can be used with Vitest
 *
 * @example
 * ```typescript
 * const { mockRepository, getSavedAggregate } = createMockAggregateRepository<ClientAggregate>();
 * const handler = new CreateClientHandler(mockRepository);
 *
 * await handler.execute(command);
 *
 * expect(mockRepository.save).toHaveBeenCalled();
 * const aggregate = getSavedAggregate(); // Typed as ClientAggregate | null
 * expect(aggregate).toBeDefined();
 * ```
 */
export function createMockAggregateRepository<T = unknown>() {
  let savedAggregate: T | null = null;

  const mockRepository = {
    save: vi.fn().mockImplementation(async (aggregate: T) => {
      savedAggregate = aggregate;
    }),
    load: vi.fn(),
  };

  const getSavedAggregate = (): T | null => savedAggregate;
  const resetSavedAggregate = () => {
    savedAggregate = null;
  };

  return {
    mockRepository,
    getSavedAggregate,
    resetSavedAggregate,
  };
}

/**
 * Creates a mock read repository for testing query handlers.
 *
 * @returns Mock repository with findAll and findById methods that can be used with Vitest
 *
 * @example
 * ```typescript
 * const mockRepository = createMockReadRepository();
 * const handler = new GetAllClientsQueryHandler(mockRepository);
 *
 * mockRepository.findAll.mockResolvedValue([...clients]);
 *
 * const result = await handler.execute(query);
 *
 * expect(mockRepository.findAll).toHaveBeenCalled();
 * ```
 */
export function createMockReadRepository() {
  return {
    findAll: vi.fn(),
    findById: vi.fn(),
  };
}

/**
 * Creates a complete test setup for command handler tests.
 * Provides the handler instance, mock repository, and helper methods in one call.
 *
 * @param handlerConstructor - The handler class constructor
 * @returns Object containing handler instance and all mock utilities
 *
 * @example
 * ```typescript
 * describe('CreateClientHandler', () => {
 *   const { handler, mockRepository, getSavedAggregate } =
 *     createCommandHandlerTestSetup(CreateClientHandler);
 *
 *   beforeEach(() => {
 *     mockRepository.save.mockClear();
 *   });
 *
 *   it('should create client', async () => {
 *     await handler.execute(command);
 *     expect(getSavedAggregate()).toBeDefined();
 *   });
 * });
 * ```
 */
export function createCommandHandlerTestSetup<THandler>(
  handlerConstructor: new (repo: ReturnType<typeof createMockAggregateRepository>['mockRepository']) => THandler
) {
  const mocks = createMockAggregateRepository();
  const handler = new handlerConstructor(mocks.mockRepository);

  return {
    handler,
    mockRepository: mocks.mockRepository,
    getSavedAggregate: mocks.getSavedAggregate,
    resetSavedAggregate: mocks.resetSavedAggregate,
  };
}

/**
 * Creates a complete test setup for query handler tests.
 * Provides the handler instance and mock read repository in one call.
 *
 * @param handlerConstructor - The handler class constructor
 * @returns Object containing handler instance and mock read repository
 *
 * @example
 * ```typescript
 * describe('GetAllClientsQueryHandler', () => {
 *   const { handler, mockReadRepository } =
 *     createQueryHandlerTestSetup(GetAllClientsQueryHandler);
 *
 *   beforeEach(() => {
 *     mockReadRepository.findAll.mockClear();
 *   });
 *
 *   it('should retrieve all clients', async () => {
 *     mockReadRepository.findAll.mockResolvedValue([...clients]);
 *     const result = await handler.execute(query);
 *     expect(result).toEqual([...clients]);
 *   });
 * });
 * ```
 */
export function createQueryHandlerTestSetup<THandler>(
  handlerConstructor: new (repo: ReturnType<typeof createMockReadRepository>) => THandler
) {
  const mockReadRepository = createMockReadRepository();
  const handler = new handlerConstructor(mockReadRepository);

  return {
    handler,
    mockReadRepository,
  };
}
