import { ClientDataPayload } from './client-data.payload';

export class UpdateClientCommand {
  constructor(
    public readonly id: string,
    public readonly data: ClientDataPayload
  ) {}
}
