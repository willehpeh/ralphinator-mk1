// Commands
export * from './commands/create-client.command';

// Command Handlers
export * from './commands/handlers/create-client.handler';

// Ports
export * from './ports/event-store.interface';

export function application(): string {
  return 'application';
}
