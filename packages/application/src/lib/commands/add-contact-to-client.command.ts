export class AddContactToClientCommand {
  constructor(
    public readonly clientId: string,
    public readonly contactId: string,
    public readonly name: string,
    public readonly role: string | null,
    public readonly email: string | null,
    public readonly phone: string | null
  ) {}
}
