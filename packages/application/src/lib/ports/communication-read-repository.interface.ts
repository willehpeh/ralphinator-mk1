import { CommunicationReadModel } from '../read-models/communication.read-model';
import { CommunicationType } from '@angular-nest-starter/shared-types';

export interface ICommunicationReadRepository {
  findById(id: string): Promise<CommunicationReadModel | null>;
  findAll(): Promise<CommunicationReadModel[]>;
  findRecent(limit: number): Promise<CommunicationReadModel[]>;
  findByClientId(clientId: string): Promise<CommunicationReadModel[]>;
  findByContactId(contactId: string): Promise<CommunicationReadModel[]>;
  findByProjectId(projectId: string): Promise<CommunicationReadModel[]>;
  findByType(type: CommunicationType): Promise<CommunicationReadModel[]>;
  findRequiringFollowUp(): Promise<CommunicationReadModel[]>;
  save(communication: CommunicationReadModel): Promise<void>;
  delete(id: string): Promise<void>;
}
