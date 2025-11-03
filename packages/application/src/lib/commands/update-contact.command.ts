import { ContactData } from '@angular-nest-starter/domain';

export class UpdateContactCommand {
  constructor(
    public readonly clientId: string,
    public readonly contactData: ContactData
  ) {}
}
