import { Injectable } from '@nestjs/common';
import { ICommunicationReadRepository, CommunicationReadModel } from '@angular-nest-starter/application';
import { CommunicationType } from '@angular-nest-starter/shared-types';
import { BaseInMemoryReadRepository } from './base-in-memory-read-repository';

/**
 * In-memory implementation of ICommunicationReadRepository
 *
 * This implementation stores communication read models in memory using a Map.
 * It is suitable for development and testing purposes only.
 *
 * **IMPORTANT**: Data is lost when the application restarts.
 * For production use, implement a persistent repository using PostgreSQL,
 * MongoDB, or another database.
 *
 * @extends {BaseInMemoryReadRepository<CommunicationReadModel>}
 * @implements {ICommunicationReadRepository}
 */
@Injectable()
export class InMemoryCommunicationReadRepository
  extends BaseInMemoryReadRepository<CommunicationReadModel>
  implements ICommunicationReadRepository
{
  // CRUD methods (findById, findAll, save, delete) are inherited from BaseInMemoryReadRepository

  /**
   * Find all communications with the most recent first
   * @returns Promise resolving to array of communications sorted by date descending
   */
  async findAll(): Promise<CommunicationReadModel[]> {
    const communications = Array.from(this.items.values());
    return communications.sort((a, b) =>
      new Date(b.communicationDate).getTime() - new Date(a.communicationDate).getTime()
    );
  }

  /**
   * Find the most recent N communications
   *
   * @param limit - Maximum number of communications to return
   * @returns Promise resolving to array of most recent communications, sorted by date descending
   */
  async findRecent(limit: number): Promise<CommunicationReadModel[]> {
    const communications = Array.from(this.items.values());
    const sorted = communications.sort((a, b) =>
      new Date(b.communicationDate).getTime() - new Date(a.communicationDate).getTime()
    );
    return sorted.slice(0, limit);
  }

  /**
   * Find all communications associated with a specific client
   *
   * @param clientId - The unique identifier of the client
   * @returns Promise resolving to array of communications for the client, sorted by date descending
   */
  async findByClientId(clientId: string): Promise<CommunicationReadModel[]> {
    const communications = Array.from(this.items.values()).filter(
      (communication) => communication.clientId === clientId
    );
    return communications.sort((a, b) =>
      new Date(b.communicationDate).getTime() - new Date(a.communicationDate).getTime()
    );
  }

  /**
   * Find all communications associated with a specific contact
   *
   * @param contactId - The unique identifier of the contact
   * @returns Promise resolving to array of communications for the contact, sorted by date descending
   */
  async findByContactId(contactId: string): Promise<CommunicationReadModel[]> {
    const communications = Array.from(this.items.values()).filter(
      (communication) => communication.contactId === contactId
    );
    return communications.sort((a, b) =>
      new Date(b.communicationDate).getTime() - new Date(a.communicationDate).getTime()
    );
  }

  /**
   * Find all communications associated with a specific project
   *
   * @param projectId - The unique identifier of the project
   * @returns Promise resolving to array of communications for the project, sorted by date descending
   */
  async findByProjectId(projectId: string): Promise<CommunicationReadModel[]> {
    const communications = Array.from(this.items.values()).filter(
      (communication) => communication.projectId === projectId
    );
    return communications.sort((a, b) =>
      new Date(b.communicationDate).getTime() - new Date(a.communicationDate).getTime()
    );
  }

  /**
   * Find all communications of a specific type
   *
   * @param type - The communication type to filter by
   * @returns Promise resolving to array of communications of the specified type, sorted by date descending
   */
  async findByType(type: CommunicationType): Promise<CommunicationReadModel[]> {
    const communications = Array.from(this.items.values()).filter(
      (communication) => communication.type === type
    );
    return communications.sort((a, b) =>
      new Date(b.communicationDate).getTime() - new Date(a.communicationDate).getTime()
    );
  }

  /**
   * Find all communications that require follow-up
   *
   * @returns Promise resolving to array of communications requiring follow-up, sorted by date descending
   */
  async findRequiringFollowUp(): Promise<CommunicationReadModel[]> {
    const communications = Array.from(this.items.values()).filter(
      (communication) => communication.followUpRequired && !communication.followUpCompleted
    );
    return communications.sort((a, b) =>
      new Date(b.communicationDate).getTime() - new Date(a.communicationDate).getTime()
    );
  }
}
