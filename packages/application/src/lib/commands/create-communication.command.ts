import { CommunicationDataPayload } from './communication-data.payload';

export class CreateCommunicationCommand {
  constructor(
    public readonly id: string,
    public readonly data: CommunicationDataPayload
  ) {}
}
