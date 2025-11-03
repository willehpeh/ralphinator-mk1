import { IsString, IsOptional, IsIn, IsNotEmpty, IsNumber, Min, IsDateString } from 'class-validator';
import { ProjectStatus, PROJECT_STATUS_VALUES } from '../types/project-status.type';

/**
 * Base DTO containing all project data fields.
 * Used for create and update operations.
 */
export class ProjectDataDto {
  @IsString()
  @IsNotEmpty()
  clientId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsIn(PROJECT_STATUS_VALUES)
  status!: ProjectStatus;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsDateString()
  @IsOptional()
  startDate?: string | null;

  @IsDateString()
  @IsOptional()
  expectedEndDate?: string | null;

  @IsDateString()
  @IsOptional()
  actualEndDate?: string | null;

  @IsNumber()
  @Min(0)
  @IsOptional()
  budget?: number | null;

  @IsString()
  @IsOptional()
  technicalNotes?: string | null;
}

/**
 * DTO for creating a new project.
 */
export class CreateProjectDto extends ProjectDataDto {}

/**
 * DTO for updating an existing project.
 */
export class UpdateProjectDto extends ProjectDataDto {}

/**
 * Response DTO for project creation.
 */
export interface CreateProjectResponse {
  id: string;
  clientId: string;
}

/**
 * Response DTO for project retrieval.
 * Matches the ProjectReadModel structure.
 */
export interface ProjectDto {
  id: string;
  clientId: string;
  name: string;
  status: ProjectStatus;
  description: string | null;
  startDate: Date | null;
  expectedEndDate: Date | null;
  actualEndDate: Date | null;
  budget: number | null;
  technicalNotes: string | null;
  createdAt: Date;
}
