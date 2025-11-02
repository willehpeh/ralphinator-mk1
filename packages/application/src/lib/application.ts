// Commands
export * from './commands/create-client.command';

// Command Handlers
export * from './commands/handlers/create-client.handler';

// Queries
export * from './queries/get-client-by-id.query';
export * from './queries/get-all-clients.query';

// Query Handlers
export * from './queries/handlers/get-client-by-id.handler';
export * from './queries/handlers/get-all-clients.handler';

// Integration Events
export * from './events/client-created.event';

// Ports
export * from './ports/event-store.interface';
export * from './ports/client-read-repository.interface';

// Read Models
export * from './read-models/client.read-model';

export function application(): string {
  return 'application';
}
