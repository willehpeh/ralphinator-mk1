import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateClientCommand, GetClientByIdQuery, GetAllClientsQuery, ClientReadModel } from '@angular-nest-starter/application';
import { ClientStatus } from '@angular-nest-starter/domain';
import { randomUUID } from 'crypto';

export class CreateClientDto {
  companyName!: string;
  email!: string;
  phone!: string | null;
  address!: string | null;
  status!: ClientStatus;
  notes!: string | null;
}

@Controller('clients')
export class ClientsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post()
  async createClient(@Body() dto: CreateClientDto): Promise<{ id: string }> {
    const id = randomUUID();
    const command = new CreateClientCommand(
      id,
      dto.companyName,
      dto.email,
      dto.phone,
      dto.address,
      dto.status,
      dto.notes
    );

    const clientId = await this.commandBus.execute<CreateClientCommand, string>(
      command
    );

    return { id: clientId };
  }

  @Get()
  async getAllClients(): Promise<ClientReadModel[]> {
    const query = new GetAllClientsQuery();
    const clients = await this.queryBus.execute<GetAllClientsQuery, ClientReadModel[]>(query);
    return clients;
  }

  @Get(':id')
  async getClientById(@Param('id') id: string): Promise<ClientReadModel | null> {
    const query = new GetClientByIdQuery(id);
    const client = await this.queryBus.execute<GetClientByIdQuery, ClientReadModel | null>(query);
    return client;
  }
}
