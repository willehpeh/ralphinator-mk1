// Commands
export * from './commands/create-client.command';

// Command Handlers
export * from './commands/handlers/create-client.handler';

// Integration Events
export * from './events/client-created.event';

// Ports
export * from './ports/event-store.interface';

// Read Models
export * from './read-models/client.read-model';

export function application(): string {
  return 'application';
}
