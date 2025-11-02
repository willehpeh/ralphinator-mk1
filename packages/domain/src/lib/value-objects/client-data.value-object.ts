import { ClientStatus } from '../types/client-status.type';
import { Email } from './email.value-object';

/**
 * Value object encapsulating client information.
 * Used to reduce parameter duplication across domain events and aggregates.
 */
export class ClientData {
  constructor(
    public readonly companyName: string,
    public readonly email: Email,
    public readonly phone: string | null,
    public readonly address: string | null,
    public readonly status: ClientStatus,
    public readonly notes: string | null
  ) {}

  /**
   * Factory method to create ClientData from payload objects.
   * Reduces duplication in command handlers.
   *
   * @param payload - Object containing client data properties
   * @returns New ClientData instance
   */
  static fromPayload(payload: {
    companyName: string;
    email: Email;
    phone: string | null;
    address: string | null;
    status: ClientStatus;
    notes: string | null;
  }): ClientData {
    return new ClientData(
      payload.companyName,
      payload.email,
      payload.phone,
      payload.address,
      payload.status,
      payload.notes
    );
  }
}
