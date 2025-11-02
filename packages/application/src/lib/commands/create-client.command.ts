import { ClientDataPayload } from './client-data.payload';

export class CreateClientCommand {
  constructor(
    public readonly id: string,
    public readonly data: ClientDataPayload
  ) {}
}
