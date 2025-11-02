import { ClientAggregate } from '@angular-nest-starter/domain';
import { ClientStatus } from '@angular-nest-starter/domain';

/**
 * All valid client statuses for comprehensive status testing.
 * Exported as a constant to ensure consistency across test files.
 */
export const ALL_CLIENT_STATUSES: readonly ClientStatus[] = [
  'Active',
  'Inactive',
  'Prospect',
  'Past Client',
] as const;

/**
 * Test assertion helper for verifying ClientAggregate state.
 * Reduces duplication across command handler tests by providing a clean,
 * declarative way to assert aggregate properties.
 *
 * @example
 * expectAggregateToMatch(aggregate, {
 *   id: 'client-123',
 *   companyName: 'Acme Corporation',
 *   email: 'contact@acme.com',
 *   status: 'Active'
 * });
 */
export function expectAggregateToMatch(
  aggregate: ClientAggregate,
  expected: {
    id: string;
    companyName?: string;
    email?: string;
    phone?: string | null;
    address?: string | null;
    status?: ClientStatus;
    notes?: string | null;
  }
): void {
  expect(aggregate.getId()).toBe(expected.id);

  if (expected.companyName !== undefined) {
    expect(aggregate.getCompanyName()).toBe(expected.companyName);
  }

  if (expected.email !== undefined) {
    expect(aggregate.getEmail()?.getValue()).toBe(expected.email);
  }

  if (expected.phone !== undefined) {
    expect(aggregate.getPhone()).toBe(expected.phone);
  }

  if (expected.address !== undefined) {
    expect(aggregate.getAddress()).toBe(expected.address);
  }

  if (expected.status !== undefined) {
    expect(aggregate.getStatus()).toBe(expected.status);
  }

  if (expected.notes !== undefined) {
    expect(aggregate.getNotes()).toBe(expected.notes);
  }
}

/**
 * Helper to test a handler with all valid client statuses.
 * Reduces duplication across test files that need to verify status handling.
 *
 * @param testFn - Function that executes the test logic for a given status.
 *                 Should accept a status parameter and perform the test.
 * @param clearMocks - Optional callback to clear mocks between iterations.
 *
 * @example
 * await testAllClientStatuses(async (status) => {
 *   const command = new CreateClientCommand(`client-${status}`, data);
 *   await handler.execute(command);
 *   expect(getSavedAggregate().getStatus()).toBe(status);
 * }, () => mockRepository.save.mockClear());
 */
export async function testAllClientStatuses(
  testFn: (status: ClientStatus) => Promise<void>,
  clearMocks?: () => void
): Promise<void> {
  for (const status of ALL_CLIENT_STATUSES) {
    if (clearMocks) {
      clearMocks();
    }
    await testFn(status);
  }
}
