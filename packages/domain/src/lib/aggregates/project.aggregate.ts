import { EventSourcedAggregate } from '../base/event-sourced-aggregate';
import { DomainEvent } from '../base/domain-event';
import { ProjectStatus } from '@angular-nest-starter/shared-types';
import { PROJECT_EVENT_TYPES } from '../constants/project-event-types';
import { DOMAIN_ERRORS } from '../constants/domain-errors';
import { ProjectCreatedDomainEvent } from '../events/project-created.domain-event';
import { ProjectDetailsUpdatedDomainEvent } from '../events/project-details-updated.domain-event';
import { ProjectStatusChangedDomainEvent } from '../events/project-status-changed.domain-event';
import { ProjectDeletedDomainEvent } from '../events/project-deleted.domain-event';
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
  private deleted = false;

  constructor() {
    super();
    // Register event handlers for all project events
    this.registerEventHandlers({
      [PROJECT_EVENT_TYPES.CREATED]: this.onProjectCreated.bind(this),
      [PROJECT_EVENT_TYPES.DETAILS_UPDATED]: this.onProjectDetailsUpdated.bind(this),
      [PROJECT_EVENT_TYPES.STATUS_CHANGED]: this.onProjectStatusChanged.bind(this),
      [PROJECT_EVENT_TYPES.DELETED]: this.onProjectDeleted.bind(this),
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
   * Marks the project as deleted (soft delete)
   * The project remains in the event store but will be excluded from active views
   */
  delete(): void {
    const id = this.ensureInitialized();
    this.applyEvent(new ProjectDeletedDomainEvent(id));
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
   * Helper method to update project fields from ProjectData
   * Used by event handlers to apply state changes consistently
   *
   * @param projectData - Value object containing project information
   */
  private updateProjectFields(projectData: ProjectData): void {
    this.clientId = projectData.clientId;
    this.name = projectData.name;
    this.status = projectData.status;
    this.description = projectData.description;
    this.startDate = projectData.startDate
      ? projectData.startDate.toISOString()
      : null;
    this.expectedEndDate = projectData.expectedEndDate
      ? projectData.expectedEndDate.toISOString()
      : null;
    this.actualEndDate = projectData.actualEndDate
      ? projectData.actualEndDate.toISOString()
      : null;
    this.budget = projectData.budget;
    this.technicalNotes = projectData.technicalNotes;
  }

  /**
   * Event handler for ProjectCreatedDomainEvent
   * Initializes the aggregate state when a new project is created
   */
  private onProjectCreated(event: ProjectCreatedDomainEvent): void {
    this.id = event.aggregateId;
    this.updateProjectFields(event.projectData);
  }

  /**
   * Event handler for ProjectDetailsUpdatedDomainEvent
   * Updates the aggregate state when project details are modified
   */
  private onProjectDetailsUpdated(event: ProjectDetailsUpdatedDomainEvent): void {
    this.updateProjectFields(event.projectData);
  }

  /**
   * Event handler for ProjectStatusChangedDomainEvent
   * Updates the project status when a status change event is replayed
   */
  private onProjectStatusChanged(event: ProjectStatusChangedDomainEvent): void {
    this.status = event.newStatus;
  }

  /**
   * Event handler for ProjectDeletedDomainEvent
   * Marks the project as deleted when the delete event is replayed
   */
  private onProjectDeleted(_event: ProjectDeletedDomainEvent): void {
    this.deleted = true;
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

  isDeleted(): boolean {
    this.ensureInitialized();
    return this.deleted;
  }
}
