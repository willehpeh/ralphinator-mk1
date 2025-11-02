import { IEvent } from '@nestjs/cqrs';

/**
 * Integration event published when a client is deleted.
 * This event is published to the event bus to trigger side effects
 * and notify other parts of the system about the client deletion.
 *
 * Unlike ClientDeletedDomainEvent (which is persisted in the event store),
 * this integration event is published for external consumption.
 */
export class ClientDeletedEvent implements IEvent {
  constructor(
    public readonly clientId: string,
    public readonly occurredOn: Date
  ) {}
}
