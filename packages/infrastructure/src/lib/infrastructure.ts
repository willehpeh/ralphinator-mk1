export function infrastructure(): string {
  return 'infrastructure';
}

// Event Store
export * from './event-store/in-memory-event-store';

// Projections
export * from './projections/client.projection';
