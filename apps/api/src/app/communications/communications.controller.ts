import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  GetAllCommunicationsQuery,
  GetCommunicationsByClientIdQuery,
  GetCommunicationsByContactIdQuery,
  GetCommunicationsByProjectIdQuery,
  GetCommunicationsByTypeQuery,
  GetCommunicationsRequiringFollowUpQuery,
  CommunicationReadModel
} from '@angular-nest-starter/application';
import { CommunicationType } from '@angular-nest-starter/shared-types';

@Controller('communications')
export class CommunicationsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async getAllCommunications(
    @Query('clientId') clientId?: string,
    @Query('contactId') contactId?: string,
    @Query('projectId') projectId?: string,
    @Query('type') type?: CommunicationType,
    @Query('requiresFollowUp') requiresFollowUp?: string,
  ): Promise<CommunicationReadModel[]> {
    // Filter by clientId if provided
    if (clientId) {
      const query = new GetCommunicationsByClientIdQuery(clientId);
      return await this.queryBus.execute<GetCommunicationsByClientIdQuery, CommunicationReadModel[]>(query);
    }

    // Filter by contactId if provided
    if (contactId) {
      const query = new GetCommunicationsByContactIdQuery(contactId);
      return await this.queryBus.execute<GetCommunicationsByContactIdQuery, CommunicationReadModel[]>(query);
    }

    // Filter by projectId if provided
    if (projectId) {
      const query = new GetCommunicationsByProjectIdQuery(projectId);
      return await this.queryBus.execute<GetCommunicationsByProjectIdQuery, CommunicationReadModel[]>(query);
    }

    // Filter by type if provided
    if (type) {
      const query = new GetCommunicationsByTypeQuery(type);
      return await this.queryBus.execute<GetCommunicationsByTypeQuery, CommunicationReadModel[]>(query);
    }

    // Filter by follow-up requirement if provided
    if (requiresFollowUp === 'true') {
      const query = new GetCommunicationsRequiringFollowUpQuery();
      return await this.queryBus.execute<GetCommunicationsRequiringFollowUpQuery, CommunicationReadModel[]>(query);
    }

    // No filters - return all communications
    const query = new GetAllCommunicationsQuery();
    return await this.queryBus.execute<GetAllCommunicationsQuery, CommunicationReadModel[]>(query);
  }
}
