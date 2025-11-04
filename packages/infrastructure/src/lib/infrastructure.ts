export function infrastructure(): string {
  return 'infrastructure';
}

// Base Classes
export * from './base/base-projection.handler';

// Event Store
export * from './event-store/in-memory-event-store';

// Repositories
export * from './repositories/aggregate.repository';

// Projections
export * from './projections/client.projection';
export * from './projections/contact.projection';
export * from './projections/project.projection';
export * from './projections/task.projection';

// Read Model Repositories
export * from './read-models/base-in-memory-read-repository';
export * from './read-models/in-memory-client-read-repository';
export * from './read-models/in-memory-contact-read-repository';
export * from './read-models/in-memory-project-read-repository';
export * from './read-models/in-memory-task-read-repository';
