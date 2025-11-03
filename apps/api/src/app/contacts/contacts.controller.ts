import { Controller, Get, Param, Put, Body, Delete } from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { GetContactByIdQuery, GetAllContactsQuery, ContactReadModel, UpdateContactCommand, RemoveContactCommand } from '@angular-nest-starter/application';
import { UpdateContactDto } from '@angular-nest-starter/shared-types';

@Controller('contacts')
export class ContactsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @Get()
  async getAllContacts(): Promise<ContactReadModel[]> {
    const query = new GetAllContactsQuery();
    const contacts = await this.queryBus.execute<GetAllContactsQuery, ContactReadModel[]>(query);
    return contacts;
  }

  @Get(':id')
  async getContactById(@Param('id') id: string): Promise<ContactReadModel | null> {
    const query = new GetContactByIdQuery(id);
    const contact = await this.queryBus.execute<GetContactByIdQuery, ContactReadModel | null>(query);
    return contact;
  }

  @Put(':id')
  async updateContact(@Param('id') id: string, @Body() dto: UpdateContactDto): Promise<void> {
    const command = new UpdateContactCommand(
      id,
      dto.clientId,
      dto.name,
      dto.role,
      dto.email,
      dto.phone
    );
    await this.commandBus.execute(command);
  }

  @Delete(':id')
  async deleteContact(@Param('id') id: string): Promise<void> {
    // First, get the contact to retrieve its clientId
    const query = new GetContactByIdQuery(id);
    const contact = await this.queryBus.execute<GetContactByIdQuery, ContactReadModel | null>(query);

    if (!contact) {
      throw new Error('Contact not found');
    }

    const command = new RemoveContactCommand(contact.clientId, id);
    await this.commandBus.execute(command);
  }
}
