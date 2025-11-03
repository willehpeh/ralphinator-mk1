import { EventSourcedAggregate } from '../base/event-sourced-aggregate';
import { DomainEvent } from '../base/domain-event';
import { ProjectStatus } from '@angular-nest-starter/shared-types';
import { PROJECT_EVENT_TYPES } from '../constants/project-event-types';
import { DOMAIN_ERRORS } from '../constants/domain-errors';
import { ProjectCreatedDomainEvent } from '../events/project-created.domain-event';

/**
 * Project aggregate root
 * Manages the lifecycle and state of a project within the system
 */
export class ProjectAggregate extends EventSourcedAggregate {
  private id?: string;
  private clientId?: string;
  private name?: string;
  private status?: ProjectStatus;
  private description: string | null = null;
  private startDate: string | null = null;
  private expectedEndDate: string | null = null;
  private actualEndDate: string | null = null;
  private budget: number | null = null;
  private technicalNotes: string | null = null;

  constructor() {
    super();
    // Register event handlers for all project events
    this.registerEventHandlers({
      [PROJECT_EVENT_TYPES.CREATED]: this.onProjectCreated.bind(this),
    } as unknown as Record<string, (event: DomainEvent) => void>);
  }

  /**
   * Factory method to create a new Project aggregate
   *
   * @param id - Unique identifier for the project
   * @param clientId - The client this project belongs to
   * @param name - Project name
   * @param status - Initial project status
   * @param description - Optional project description
   * @param startDate - Optional start date (ISO string)
   * @param expectedEndDate - Optional expected end date (ISO string)
   * @param actualEndDate - Optional actual end date (ISO string)
   * @param budget - Optional budget amount
   * @param technicalNotes - Optional technical notes
   * @returns A new ProjectAggregate instance with ProjectCreatedDomainEvent applied
   */
  static create(
    id: string,
    clientId: string,
    name: string,
    status: ProjectStatus,
    description: string | null = null,
    startDate: string | null = null,
    expectedEndDate: string | null = null,
    actualEndDate: string | null = null,
    budget: number | null = null,
    technicalNotes: string | null = null
  ): ProjectAggregate {
    const project = new ProjectAggregate();
    project.applyEvent(
      new ProjectCreatedDomainEvent(
        id,
        clientId,
        name,
        status,
        description,
        startDate,
        expectedEndDate,
        actualEndDate,
        budget,
        technicalNotes
      )
    );
    return project;
  }

  /**
   * Ensures that the aggregate has been initialized (created).
   * Throws an error if the aggregate ID is not set.
   *
   * @throws Error if the aggregate has not been created
   * @returns The aggregate ID
   */
  private ensureInitialized(): string {
    if (!this.id) {
      throw new Error(DOMAIN_ERRORS.PROJECT_NOT_INITIALIZED);
    }
    return this.id;
  }

  /**
   * Generic helper method to get a field value after ensuring initialization.
   * Reduces boilerplate in getter methods by centralizing the initialization check
   * and non-null assertion pattern.
   *
   * @param field - The field value to return
   * @returns The field value (non-null)
   * @throws Error if the aggregate has not been created
   */
  private getInitializedField<T>(field: T | undefined): T {
    this.ensureInitialized();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return field!;
  }

  /**
   * Event handler for ProjectCreatedDomainEvent
   * Initializes the aggregate state when a new project is created
   */
  private onProjectCreated(event: ProjectCreatedDomainEvent): void {
    this.id = event.aggregateId;
    this.clientId = event.clientId;
    this.name = event.name;
    this.status = event.status;
    this.description = event.description;
    this.startDate = event.startDate;
    this.expectedEndDate = event.expectedEndDate;
    this.actualEndDate = event.actualEndDate;
    this.budget = event.budget;
    this.technicalNotes = event.technicalNotes;
  }

  // Getters for accessing aggregate state
  // All getters ensure the aggregate is initialized before returning values
  getId(): string {
    return this.ensureInitialized();
  }

  getClientId(): string {
    return this.getInitializedField(this.clientId);
  }

  getName(): string {
    return this.getInitializedField(this.name);
  }

  getStatus(): ProjectStatus {
    return this.getInitializedField(this.status);
  }

  getDescription(): string | null {
    this.ensureInitialized();
    return this.description;
  }

  getStartDate(): string | null {
    this.ensureInitialized();
    return this.startDate;
  }

  getExpectedEndDate(): string | null {
    this.ensureInitialized();
    return this.expectedEndDate;
  }

  getActualEndDate(): string | null {
    this.ensureInitialized();
    return this.actualEndDate;
  }

  getBudget(): number | null {
    this.ensureInitialized();
    return this.budget;
  }

  getTechnicalNotes(): string | null {
    this.ensureInitialized();
    return this.technicalNotes;
  }
}
