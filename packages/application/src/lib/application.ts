// Commands
export * from './commands/client-data.payload';
export * from './commands/create-client.command';
export * from './commands/update-client.command';
export * from './commands/change-client-status.command';
export * from './commands/delete-client.command';
export * from './commands/add-contact-to-client.command';
export * from './commands/update-contact.command';
export * from './commands/remove-contact.command';

// Command Handlers
export * from './commands/handlers/create-client.handler';
export * from './commands/handlers/update-client.handler';
export * from './commands/handlers/change-client-status.handler';
export * from './commands/handlers/delete-client.handler';
export * from './commands/handlers/add-contact-to-client.handler';
export * from './commands/handlers/update-contact.handler';

// Queries
export * from './queries/get-client-by-id.query';
export * from './queries/get-all-clients.query';
export * from './queries/get-clients-by-status.query';
export * from './queries/get-client-contacts.query';
export * from './queries/get-contact-by-id.query';
export * from './queries/get-all-contacts.query';

// Query Handlers
export * from './queries/handlers/get-client-by-id.handler';
export * from './queries/handlers/get-all-clients.handler';
export * from './queries/handlers/get-clients-by-status.handler';
export * from './queries/handlers/get-client-contacts.handler';
export * from './queries/handlers/get-contact-by-id.handler';
export * from './queries/handlers/get-all-contacts.handler';

// Integration Events
export * from './events/client-created.event';
export * from './events/client-information-updated.event';
export * from './events/client-deleted.event';

// Ports
export * from './ports/event-store.interface';
export * from './ports/client-read-repository.interface';
export * from './ports/contact-read-repository.interface';
export * from './ports/aggregate-repository.interface';
export * from './ports/injection-tokens';

// Read Models
export * from './read-models/client.read-model';
export * from './read-models/contact.read-model';

export function application(): string {
  return 'application';
}
