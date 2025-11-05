// Commands
export * from './commands/client-data.payload';
export * from './commands/create-client.command';
export * from './commands/update-client.command';
export * from './commands/change-client-status.command';
export * from './commands/delete-client.command';
export * from './commands/add-contact-to-client.command';
export * from './commands/update-contact.command';
export * from './commands/remove-contact.command';
export * from './commands/project-data.payload';
export * from './commands/create-project.command';
export * from './commands/update-project-details.command';
export * from './commands/change-project-status.command';
export * from './commands/delete-project.command';
export * from './commands/task-data.payload';
export * from './commands/create-task.command';
export * from './commands/update-task-details.command';
export * from './commands/change-task-status.command';
export * from './commands/delete-task.command';
export * from './commands/communication-data.payload';
export * from './commands/create-communication.command';

// Command Handlers
export * from './commands/handlers/create-client.handler';
export * from './commands/handlers/update-client.handler';
export * from './commands/handlers/change-client-status.handler';
export * from './commands/handlers/delete-client.handler';
export * from './commands/handlers/add-contact-to-client.handler';
export * from './commands/handlers/update-contact.handler';
export * from './commands/handlers/remove-contact.handler';
export * from './commands/handlers/create-project.handler';
export * from './commands/handlers/update-project-details.handler';
export * from './commands/handlers/change-project-status.handler';
export * from './commands/handlers/delete-project.handler';
export * from './commands/handlers/create-task.handler';
export * from './commands/handlers/update-task-details.handler';
export * from './commands/handlers/change-task-status.handler';
export * from './commands/handlers/delete-task.handler';
export * from './commands/handlers/create-communication.handler';

// Queries
export * from './queries/get-client-by-id.query';
export * from './queries/get-all-clients.query';
export * from './queries/get-clients-by-status.query';
export * from './queries/get-client-contacts.query';
export * from './queries/get-contact-by-id.query';
export * from './queries/get-all-contacts.query';
export * from './queries/get-projects-by-client-id.query';
export * from './queries/get-all-projects.query';
export * from './queries/get-project-by-id.query';
export * from './queries/get-task-by-id.query';
export * from './queries/get-tasks-by-project-id.query';
export * from './queries/get-tasks-by-client-id.query';
export * from './queries/get-all-communications.query';
export * from './queries/get-communications-by-client-id.query';
export * from './queries/get-communications-by-contact-id.query';
export * from './queries/get-communications-by-project-id.query';
export * from './queries/get-communications-requiring-follow-up.query';

// Query Handlers
export * from './queries/handlers/get-client-by-id.handler';
export * from './queries/handlers/get-all-clients.handler';
export * from './queries/handlers/get-clients-by-status.handler';
export * from './queries/handlers/get-client-contacts.handler';
export * from './queries/handlers/get-contact-by-id.handler';
export * from './queries/handlers/get-all-contacts.handler';
export * from './queries/handlers/get-projects-by-client-id.handler';
export * from './queries/handlers/get-all-projects.handler';
export * from './queries/handlers/get-project-by-id.handler';
export * from './queries/handlers/get-task-by-id.handler';
export * from './queries/handlers/get-tasks-by-project-id.handler';
export * from './queries/handlers/get-tasks-by-client-id.handler';
export * from './queries/handlers/get-all-communications.handler';
export * from './queries/handlers/get-communications-by-client-id.handler';
export * from './queries/handlers/get-communications-by-contact-id.handler';
export * from './queries/handlers/get-communications-by-project-id.handler';
export * from './queries/handlers/get-communications-requiring-follow-up.handler';

// Integration Events
export * from './events/client-created.event';
export * from './events/client-information-updated.event';
export * from './events/client-deleted.event';

// Ports
export * from './ports/event-store.interface';
export * from './ports/client-read-repository.interface';
export * from './ports/contact-read-repository.interface';
export * from './ports/project-read-repository.interface';
export * from './ports/task-read-repository.interface';
export * from './ports/communication-read-repository.interface';
export * from './ports/aggregate-repository.interface';
export * from './ports/injection-tokens';

// Read Models
export * from './read-models/client.read-model';
export * from './read-models/contact.read-model';
export * from './read-models/project.read-model';
export * from './read-models/task.read-model';
export * from './read-models/communication.read-model';

export function application(): string {
  return 'application';
}
