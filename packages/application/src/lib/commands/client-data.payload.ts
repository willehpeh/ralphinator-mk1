import { ClientStatus } from '@angular-nest-starter/shared-types';

/**
 * Shared payload for client data used by create and update commands.
 * Extracts the common properties to avoid duplication (DRY principle).
 */
export class ClientDataPayload {
  constructor(
    public readonly companyName: string,
    public readonly email: string,
    public readonly phone: string | null,
    public readonly address: string | null,
    public readonly status: ClientStatus,
    public readonly notes: string | null
  ) {}
}
