import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetContactByIdQuery, ContactReadModel } from '@angular-nest-starter/application';

@Controller('contacts')
export class ContactsController {
  constructor(
    private readonly queryBus: QueryBus
  ) {}

  @Get(':id')
  async getContactById(@Param('id') id: string): Promise<ContactReadModel | null> {
    const query = new GetContactByIdQuery(id);
    const contact = await this.queryBus.execute<GetContactByIdQuery, ContactReadModel | null>(query);
    return contact;
  }
}
