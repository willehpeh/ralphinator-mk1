import { vi } from 'vitest';

/**
 * Creates a mock aggregate repository for testing command handlers.
 *
 * @returns Mock repository with save and load methods that can be used with Vitest
 *
 * @example
 * ```typescript
 * const { mockRepository, getSavedAggregate } = createMockAggregateRepository();
 * const handler = new CreateClientHandler(mockRepository);
 *
 * await handler.execute(command);
 *
 * expect(mockRepository.save).toHaveBeenCalled();
 * expect(getSavedAggregate()).toBeDefined();
 * ```
 */
export function createMockAggregateRepository() {
  let savedAggregate: unknown = null;

  const mockRepository = {
    save: vi.fn().mockImplementation(async (aggregate) => {
      savedAggregate = aggregate;
    }),
    load: vi.fn(),
  };

  const getSavedAggregate = () => savedAggregate;
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
