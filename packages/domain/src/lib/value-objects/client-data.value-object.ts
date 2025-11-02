import { ClientStatus } from '../types/client-status.type';

/**
 * Value object encapsulating client information.
 * Used to reduce parameter duplication across domain events and aggregates.
 */
export class ClientData {
  constructor(
    public readonly companyName: string,
    public readonly email: string,
    public readonly phone: string | null,
    public readonly address: string | null,
    public readonly status: ClientStatus,
    public readonly notes: string | null
  ) {}
}
