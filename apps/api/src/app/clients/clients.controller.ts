import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateClientCommand, UpdateClientCommand, ChangeClientStatusCommand, GetClientByIdQuery, GetAllClientsQuery, GetClientsByStatusQuery, ClientReadModel } from '@angular-nest-starter/application';
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

export class UpdateClientDto {
  companyName!: string;
  email!: string;
  phone!: string | null;
  address!: string | null;
  status!: ClientStatus;
  notes!: string | null;
}

export class ChangeClientStatusDto {
  status!: ClientStatus;
}

@Controller('clients')
export class ClientsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  /**
   * Helper method to fetch a client by ID after a mutation command.
   * Throws an error if the client is not found.
   *
   * @param clientId - The ID of the client to fetch
   * @param operation - Description of the operation for error message (e.g., 'update', 'status change')
   * @returns The client read model
   */
  private async fetchClientAfterMutation(
    clientId: string,
    operation: string
  ): Promise<ClientReadModel> {
    const query = new GetClientByIdQuery(clientId);
    const client = await this.queryBus.execute<GetClientByIdQuery, ClientReadModel | null>(query);

    if (!client) {
      throw new Error(`Client ${clientId} not found after ${operation}`);
    }

    return client;
  }

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

  @Get('status/:status')
  async getClientsByStatus(@Param('status') status: ClientStatus): Promise<ClientReadModel[]> {
    const query = new GetClientsByStatusQuery(status);
    const clients = await this.queryBus.execute<GetClientsByStatusQuery, ClientReadModel[]>(query);
    return clients;
  }

  @Get(':id')
  async getClientById(@Param('id') id: string): Promise<ClientReadModel | null> {
    const query = new GetClientByIdQuery(id);
    const client = await this.queryBus.execute<GetClientByIdQuery, ClientReadModel | null>(query);
    return client;
  }

  @Put(':id')
  async updateClient(
    @Param('id') id: string,
    @Body() dto: UpdateClientDto
  ): Promise<ClientReadModel> {
    const command = new UpdateClientCommand(
      id,
      dto.companyName,
      dto.email,
      dto.phone,
      dto.address,
      dto.status,
      dto.notes
    );

    const clientId = await this.commandBus.execute<UpdateClientCommand, string>(
      command
    );

    // Return the updated client to avoid unnecessary refetch
    return this.fetchClientAfterMutation(clientId, 'update');
  }

  @Patch(':id/status')
  async changeClientStatus(
    @Param('id') id: string,
    @Body() dto: ChangeClientStatusDto
  ): Promise<ClientReadModel> {
    const command = new ChangeClientStatusCommand(id, dto.status);

    const clientId = await this.commandBus.execute<ChangeClientStatusCommand, string>(
      command
    );

    // Return the updated client to avoid unnecessary refetch
    return this.fetchClientAfterMutation(clientId, 'status change');
  }
}
