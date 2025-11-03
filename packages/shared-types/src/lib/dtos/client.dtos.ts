import { IsString, IsEmail, IsOptional, IsIn, IsNotEmpty } from 'class-validator';
import { ClientStatus, CLIENT_STATUS_VALUES } from '@angular-nest-starter/domain';

/**
 * Base DTO containing all client data fields.
 * Used for create and update operations.
 */
export class ClientDataDto {
  @IsString()
  @IsNotEmpty()
  companyName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsOptional()
  phone!: string | null;

  @IsString()
  @IsOptional()
  address!: string | null;

  @IsIn(CLIENT_STATUS_VALUES)
  status!: ClientStatus;

  @IsString()
  @IsOptional()
  notes!: string | null;
}

/**
 * DTO for creating a new client.
 */
export class CreateClientDto extends ClientDataDto {}

/**
 * DTO for updating an existing client.
 */
export class UpdateClientDto extends ClientDataDto {}

/**
 * DTO for changing a client's status.
 */
export class ChangeClientStatusDto {
  @IsIn(CLIENT_STATUS_VALUES)
  @IsNotEmpty()
  status!: ClientStatus;
}

/**
 * Response DTO for client creation.
 */
export interface CreateClientResponse {
  id: string;
}

/**
 * Response DTO for client deletion.
 */
export interface DeleteClientResponse {
  id: string;
}
