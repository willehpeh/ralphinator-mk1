import { IEvent } from '@nestjs/cqrs';
import { ClientStatus } from '@angular-nest-starter/domain';

/**
 * Integration event published when a new client is created.
 * This event is published to the event bus to trigger side effects
 * and notify other parts of the system about the client creation.
 *
 * Unlike ClientCreatedDomainEvent (which is persisted in the event store),
 * this integration event is published for external consumption.
 */
export class ClientCreatedEvent implements IEvent {
  constructor(
    public readonly clientId: string,
    public readonly companyName: string,
    public readonly email: string,
    public readonly phone: string | null,
    public readonly address: string | null,
    public readonly status: ClientStatus,
    public readonly notes: string | null,
    public readonly occurredOn: Date
  ) {}
}
