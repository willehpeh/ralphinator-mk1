import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetAllCommunicationsQuery, CommunicationReadModel } from '@angular-nest-starter/application';

@Controller('communications')
export class CommunicationsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async getAllCommunications(): Promise<CommunicationReadModel[]> {
    const query = new GetAllCommunicationsQuery();
    const communications = await this.queryBus.execute<GetAllCommunicationsQuery, CommunicationReadModel[]>(query);
    return communications;
  }
}
