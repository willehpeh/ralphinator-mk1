import { EventSourcedAggregate } from '../base/event-sourced-aggregate';
import { DomainEvent } from '../base/domain-event';
import { ProjectStatus } from '@angular-nest-starter/shared-types';
import { PROJECT_EVENT_TYPES } from '../constants/project-event-types';
import { DOMAIN_ERRORS } from '../constants/domain-errors';
import { ProjectCreatedDomainEvent } from '../events/project-created.domain-event';
import { ProjectDetailsUpdatedDomainEvent } from '../events/project-details-updated.domain-event';
import { ProjectStatusChangedDomainEvent } from '../events/project-status-changed.domain-event';
import { ProjectData } from '../value-objects/project-data.value-object';

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
      [PROJECT_EVENT_TYPES.DETAILS_UPDATED]: this.onProjectDetailsUpdated.bind(this),
      [PROJECT_EVENT_TYPES.STATUS_CHANGED]: this.onProjectStatusChanged.bind(this),
    } as unknown as Record<string, (event: DomainEvent) => void>);
  }

  /**
   * Factory method to create a new Project aggregate
   *
   * @param id - Unique identifier for the project
   * @param projectData - Value object containing project data
   * @returns A new ProjectAggregate instance with ProjectCreatedDomainEvent applied
   */
  static create(id: string, projectData: ProjectData): ProjectAggregate {
    const project = new ProjectAggregate();
    project.applyEvent(new ProjectCreatedDomainEvent(id, projectData));
    return project;
  }

  /**
   * Updates project details
   *
   * @param projectData - Value object containing updated project data
   */
  updateDetails(projectData: ProjectData): void {
    this.ensureInitialized();
    this.applyEvent(new ProjectDetailsUpdatedDomainEvent(this.id!, projectData));
  }

  /**
   * Changes the status of the project
   *
   * @param newStatus - The new status to assign to the project
   * @throws {Error} If new status is the same as current status
   */
  changeStatus(newStatus: ProjectStatus): void {
    const id = this.ensureInitialized();
    const currentStatus = this.getStatus();

    if (currentStatus === newStatus) {
      throw new Error(DOMAIN_ERRORS.PROJECT_STATUS_UNCHANGED);
    }

    this.applyEvent(
      new ProjectStatusChangedDomainEvent(id, currentStatus, newStatus)
    );
  }

  /**
   * Override base ensureInitialized to provide project-specific error message
   */
  protected override ensureInitialized(): string {
    if (!this.id) {
      throw new Error(DOMAIN_ERRORS.PROJECT_NOT_INITIALIZED);
    }
    return this.id;
  }

  /**
   * Event handler for ProjectCreatedDomainEvent
   * Initializes the aggregate state when a new project is created
   */
  private onProjectCreated(event: ProjectCreatedDomainEvent): void {
    this.id = event.aggregateId;
    this.clientId = event.projectData.clientId;
    this.name = event.projectData.name;
    this.status = event.projectData.status;
    this.description = event.projectData.description;
    this.startDate = event.projectData.startDate
      ? event.projectData.startDate.toISOString()
      : null;
    this.expectedEndDate = event.projectData.expectedEndDate
      ? event.projectData.expectedEndDate.toISOString()
      : null;
    this.actualEndDate = event.projectData.actualEndDate
      ? event.projectData.actualEndDate.toISOString()
      : null;
    this.budget = event.projectData.budget;
    this.technicalNotes = event.projectData.technicalNotes;
  }

  /**
   * Event handler for ProjectDetailsUpdatedDomainEvent
   * Updates the aggregate state when project details are modified
   */
  private onProjectDetailsUpdated(event: ProjectDetailsUpdatedDomainEvent): void {
    this.clientId = event.projectData.clientId;
    this.name = event.projectData.name;
    this.status = event.projectData.status;
    this.description = event.projectData.description;
    this.startDate = event.projectData.startDate
      ? event.projectData.startDate.toISOString()
      : null;
    this.expectedEndDate = event.projectData.expectedEndDate
      ? event.projectData.expectedEndDate.toISOString()
      : null;
    this.actualEndDate = event.projectData.actualEndDate
      ? event.projectData.actualEndDate.toISOString()
      : null;
    this.budget = event.projectData.budget;
    this.technicalNotes = event.projectData.technicalNotes;
  }

  /**
   * Event handler for ProjectStatusChangedDomainEvent
   * Updates the project status when a status change event is replayed
   */
  private onProjectStatusChanged(event: ProjectStatusChangedDomainEvent): void {
    this.status = event.newStatus;
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
