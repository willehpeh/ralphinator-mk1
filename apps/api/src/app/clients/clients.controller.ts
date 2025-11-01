import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateClientCommand } from '@angular-nest-starter/application';
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
  constructor(private readonly commandBus: CommandBus) {}

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
}
