import { Controller, Get, Param, Put, Body } from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { GetContactByIdQuery, GetAllContactsQuery, ContactReadModel, UpdateContactCommand } from '@angular-nest-starter/application';
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
}
