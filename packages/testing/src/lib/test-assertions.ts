import { ClientAggregate } from '@angular-nest-starter/domain';
import { ClientStatus } from '@angular-nest-starter/domain';

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
