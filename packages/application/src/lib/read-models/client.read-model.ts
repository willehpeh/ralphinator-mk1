import { ClientStatus } from '@angular-nest-starter/shared-types';

/**
 * Read model for client queries
 * Optimized DTO for read operations
 */
export class ClientReadModel {
  constructor(
    public readonly id: string,
    public readonly companyName: string,
    public readonly email: string,
    public readonly phone: string | null,
    public readonly address: string | null,
    public readonly status: ClientStatus,
    public readonly notes: string | null,
    public readonly createdAt: Date
  ) {}
}
