import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';

/**
 * DTO for adding a contact to a client.
 */
export class AddContactDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  role?: string | null;

  @IsEmail()
  @IsOptional()
  email?: string | null;

  @IsString()
  @IsOptional()
  phone?: string | null;
}

/**
 * DTO for updating a contact's information.
 */
export class UpdateContactDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  role?: string | null;

  @IsEmail()
  @IsOptional()
  email?: string | null;

  @IsString()
  @IsOptional()
  phone?: string | null;
}

/**
 * Response DTO for contact creation.
 */
export interface AddContactResponse {
  contactId: string;
  clientId: string;
}
