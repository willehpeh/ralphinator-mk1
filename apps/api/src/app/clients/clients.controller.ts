import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateClientCommand, UpdateClientCommand, ChangeClientStatusCommand, DeleteClientCommand, GetClientByIdQuery, GetAllClientsQuery, GetClientsByStatusQuery, ClientReadModel, ClientDataPayload, AddContactToClientCommand, GetClientContactsQuery, ContactReadModel, GetTasksByClientIdQuery, TaskReadModel } from '@angular-nest-starter/application';
import { ClientDataDto, CreateClientDto, UpdateClientDto, ChangeClientStatusDto, ClientStatus, AddContactDto, AddContactResponse } from '@angular-nest-starter/shared-types';
import { ContactData } from '@angular-nest-starter/domain';
import { randomUUID } from 'crypto';
import { fetchEntityAfterMutation } from '../shared/controller-utilities';

@Controller('clients')
export class ClientsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

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
    return fetchEntityAfterMutation(
      this.queryBus,
      GetClientByIdQuery,
      [clientId],
      'Client',
      clientId,
      'update'
    );
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
    return fetchEntityAfterMutation(
      this.queryBus,
      GetClientByIdQuery,
      [clientId],
      'Client',
      clientId,
      'status change'
    );
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
    const contactData = ContactData.fromDto(contactId, dto);

    const command = new AddContactToClientCommand(clientId, contactData);

    await this.commandBus.execute<AddContactToClientCommand, string>(command);

    return { contactId, clientId };
  }

  @Get(':id/contacts')
  async getClientContacts(@Param('id') clientId: string): Promise<ContactReadModel[]> {
    const query = new GetClientContactsQuery(clientId);
    const contacts = await this.queryBus.execute<GetClientContactsQuery, ContactReadModel[]>(query);
    return contacts;
  }

  @Get(':id/tasks')
  async getClientTasks(@Param('id') clientId: string): Promise<TaskReadModel[]> {
    const query = new GetTasksByClientIdQuery(clientId);
    const tasks = await this.queryBus.execute<GetTasksByClientIdQuery, TaskReadModel[]>(query);
    return tasks;
  }
}
