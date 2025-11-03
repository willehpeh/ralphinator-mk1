import { Body, Controller, Delete, Get, Param, Patch, Post, Put, NotFoundException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateClientCommand, UpdateClientCommand, ChangeClientStatusCommand, DeleteClientCommand, GetClientByIdQuery, GetAllClientsQuery, GetClientsByStatusQuery, ClientReadModel, ClientDataPayload, AddContactToClientCommand } from '@angular-nest-starter/application';
import { ClientDataDto, CreateClientDto, UpdateClientDto, ChangeClientStatusDto, ClientStatus, AddContactDto, AddContactResponse } from '@angular-nest-starter/shared-types';
import { randomUUID } from 'crypto';
import { CLIENT_CONTROLLER_ERROR_MESSAGES } from './clients-controller.constants';

@Controller('clients')
export class ClientsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  /**
   * Helper method to fetch a client by ID after a mutation command.
   * Throws a NotFoundException if the client is not found.
   *
   * @param clientId - The ID of the client to fetch
   * @param operation - Description of the operation for error message (e.g., 'update', 'status change')
   * @returns The client read model
   * @throws NotFoundException if the client is not found after the mutation
   */
  private async fetchClientAfterMutation(
    clientId: string,
    operation: string
  ): Promise<ClientReadModel> {
    const query = new GetClientByIdQuery(clientId);
    const client = await this.queryBus.execute<GetClientByIdQuery, ClientReadModel | null>(query);

    if (!client) {
      throw new NotFoundException(
        CLIENT_CONTROLLER_ERROR_MESSAGES.CLIENT_NOT_FOUND_AFTER_MUTATION(clientId, operation)
      );
    }

    return client;
  }

  /**
   * Helper method to create ClientDataPayload from DTO.
   * Centralizes the mapping logic to avoid duplication across endpoints.
   *
   * @param dto - The client data DTO (CreateClientDto or UpdateClientDto)
   * @returns A new ClientDataPayload instance
   */
  private createClientDataPayload(dto: ClientDataDto): ClientDataPayload {
    return new ClientDataPayload(
      dto.companyName,
      dto.email,
      dto.phone,
      dto.address,
      dto.status,
      dto.notes
    );
  }

  @Post()
  async createClient(@Body() dto: CreateClientDto): Promise<{ id: string }> {
    const id = randomUUID();
    const data = this.createClientDataPayload(dto);
    const command = new CreateClientCommand(id, data);

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
    const data = this.createClientDataPayload(dto);
    const command = new UpdateClientCommand(id, data);

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

  @Delete(':id')
  async deleteClient(@Param('id') id: string): Promise<{ id: string }> {
    const command = new DeleteClientCommand(id);

    const clientId = await this.commandBus.execute<DeleteClientCommand, string>(
      command
    );

    return { id: clientId };
  }

  @Post(':id/contacts')
  async addContactToClient(
    @Param('id') clientId: string,
    @Body() dto: AddContactDto
  ): Promise<AddContactResponse> {
    const contactId = randomUUID();
    const command = new AddContactToClientCommand(
      clientId,
      contactId,
      dto.name,
      dto.role ?? null,
      dto.email ?? null,
      dto.phone ?? null
    );

    await this.commandBus.execute<AddContactToClientCommand, string>(command);

    return { contactId, clientId };
  }
}
