import { ContactData } from '@angular-nest-starter/domain';

export class AddContactToClientCommand {
  constructor(
    public readonly clientId: string,
    public readonly contactData: ContactData
  ) {}
}
