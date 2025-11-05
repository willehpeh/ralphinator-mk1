import { EventSourcedAggregate } from '../base/event-sourced-aggregate';
import { DomainEvent } from '../base/domain-event';
import { CommunicationType } from '@angular-nest-starter/shared-types';
import { COMMUNICATION_EVENT_TYPES } from '../constants/communication-event-types';
import { DOMAIN_ERRORS } from '../constants/domain-errors';
import { CommunicationCreatedDomainEvent } from '../events/communication-created.domain-event';
import { CommunicationData } from '../value-objects/communication-data.value-object';

export class CommunicationAggregate extends EventSourcedAggregate {
  private id?: string;
  private type?: CommunicationType;
  private subject?: string;
  private communicationDate?: Date;
  private notes?: string;
  private clientId?: string;
  private contactId: string | null = null;
  private projectId: string | null = null;
  private followUpRequired?: boolean;
  private followUpDate: Date | null = null;

  constructor() {
    super();
    // Register event handlers for all communication events
    // Type assertion needed because handlers have heterogeneous event types
    this.registerEventHandlers({
      [COMMUNICATION_EVENT_TYPES.CREATED]: this.onCommunicationCreated.bind(this),
    } as unknown as Record<string, (event: DomainEvent) => void>);
  }

  /**
   * Factory method to create a new Communication aggregate
   *
   * @param id - Unique identifier for the communication
   * @param communicationData - Value object containing all communication information
   * @returns A new CommunicationAggregate instance with CommunicationCreatedDomainEvent applied
   */
  static create(
    id: string,
    communicationData: CommunicationData
  ): CommunicationAggregate {
    const communication = new CommunicationAggregate();
    communication.applyEvent(
      new CommunicationCreatedDomainEvent(id, communicationData)
    );
    return communication;
  }

  /**
   * Override base ensureInitialized to provide communication-specific error message
   */
  protected override ensureInitialized(): string {
    if (!this.id) {
      throw new Error(DOMAIN_ERRORS.COMMUNICATION_NOT_INITIALIZED);
    }
    return this.id;
  }

  /**
   * Helper method to update communication fields from CommunicationData value object
   * Used by event handlers to apply state changes consistently
   *
   * @param communicationData - Value object containing communication information
   */
  private updateCommunicationFields(communicationData: CommunicationData): void {
    this.type = communicationData.type;
    this.subject = communicationData.subject;
    this.communicationDate = communicationData.communicationDate;
    this.notes = communicationData.notes;
    this.clientId = communicationData.clientId;
    this.contactId = communicationData.contactId;
    this.projectId = communicationData.projectId;
    this.followUpRequired = communicationData.followUpRequired;
    this.followUpDate = communicationData.followUpDate;
  }

  /**
   * Event handler for CommunicationCreatedDomainEvent
   * Initializes the aggregate state when a new communication is created
   */
  private onCommunicationCreated(event: CommunicationCreatedDomainEvent): void {
    this.id = event.aggregateId;
    this.updateCommunicationFields(event.communicationData);
  }

  // Getters for accessing aggregate state
  // All getters ensure the aggregate is initialized before returning values
  getId(): string {
    return this.ensureInitialized();
  }

  getType(): CommunicationType {
    return this.getInitializedField(this.type);
  }

  getSubject(): string {
    return this.getInitializedField(this.subject);
  }

  getCommunicationDate(): Date {
    return this.getInitializedField(this.communicationDate);
  }

  getNotes(): string {
    return this.getInitializedField(this.notes);
  }

  getClientId(): string {
    return this.getInitializedField(this.clientId);
  }

  getContactId(): string | null {
    return this.getInitializedField(this.contactId);
  }

  getProjectId(): string | null {
    return this.getInitializedField(this.projectId);
  }

  getFollowUpRequired(): boolean {
    return this.getInitializedField(this.followUpRequired);
  }

  getFollowUpDate(): Date | null {
    return this.getInitializedField(this.followUpDate);
  }
}
