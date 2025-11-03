export class RemoveContactCommand {
  constructor(
    public readonly clientId: string,
    public readonly contactId: string
  ) {}
}
