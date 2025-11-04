import { Component, ChangeDetectionStrategy, inject, OnInit, computed, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of, combineLatest } from 'rxjs';
import { Store } from '@ngrx/store';
import { loadClients, deleteClient } from './store/clients.actions';
import { selectClientById, selectClientsLoading, selectClientsError } from './store/clients.selectors';
import { ClientFormComponent } from './client-form.component';
import { ChangeStatusFormComponent } from './change-status-form.component';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog.component';
import { StatusBadgeComponent } from './status-badge.component';
import { ContactFormComponent } from './contact-form.component';
import { ContactListComponent } from './contact-list.component';
import { ClientNavigationService } from './client-navigation.service';
import { ClientsService } from './clients.service';
import { STANDARD_DATE_FORMAT } from '../shared/ui.constants';
import { CLIENT_UI_TEXT } from './client-display.constants';
import { Contact } from './client.types';
import { ProjectFormComponent } from '../projects/project-form.component';
import { ProjectsService } from '../projects/projects.service';
import { ProjectDto } from '@angular-nest-starter/shared-types';
import { TasksService } from '../tasks/tasks.service';
import { Task } from '../tasks/task.types';

@Component({
  selector: 'app-client-detail',
  imports: [CommonModule, ClientFormComponent, ChangeStatusFormComponent, ConfirmationDialogComponent, StatusBadgeComponent, ContactFormComponent, ContactListComponent, ProjectFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./clients-common.scss', './client-detail.component.scss'],
  template: `
    <div class="client-detail">
      <div class="detail-header">
        <button class="back-button" (click)="navigateBack()">
          {{ uiText.BACK_TO_LIST }}
        </button>
        <div class="header-title-section">
          <h2>{{ uiText.CLIENT_DETAILS }}</h2>
          @if (!isEditing() && !isChangingStatus() && client()) {
            <div class="action-buttons">
              <button class="edit-button" (click)="toggleEditMode()">
                {{ uiText.EDIT_CLIENT }}
              </button>
              <button class="change-status-button" (click)="toggleStatusChangeMode()">
                {{ uiText.CHANGE_STATUS }}
              </button>
              <button class="delete-button" (click)="deleteClient()">
                {{ uiText.DELETE_CLIENT }}
              </button>
            </div>
          }
        </div>
      </div>

      @if (loading()) {
        <div class="loading-message">
          {{ uiText.LOADING_CLIENT_DETAILS }}
        </div>
      }

      @if (error(); as errorMessage) {
        <div class="error-message">
          {{ errorMessage }}
        </div>
      }

      @if (!loading() && !client() && !error()) {
        <div class="error-message">
          {{ uiText.CLIENT_NOT_FOUND }}
        </div>
      }

      @if (client(); as clientData) {
        @if (isEditing()) {
          <app-client-form
            [mode]="'edit'"
            [client]="clientData"
            (formCancelled)="toggleEditMode()"
            (formSucceeded)="handleEditSuccess()"
          />
        } @else if (isChangingStatus()) {
          <app-change-status-form
            [clientId]="clientData.id"
            (statusChanged)="handleStatusChangeSuccess()"
            (changeCancelled)="toggleStatusChangeMode()"
          />
        } @else {
          <div class="detail-card">
            <div class="detail-header-section">
              <h3>{{ clientData.companyName }}</h3>
              <app-status-badge [status]="clientData.status" />
            </div>

            <div class="detail-section">
              <h4>Contact Information</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value">{{ clientData.email }}</span>
                </div>
                @if (clientData.phone) {
                  <div class="detail-item">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">{{ clientData.phone }}</span>
                  </div>
                }
                @if (clientData.address) {
                  <div class="detail-item">
                    <span class="detail-label">Address:</span>
                    <span class="detail-value">{{ clientData.address }}</span>
                  </div>
                }
              </div>
            </div>

            @if (clientData.notes) {
              <div class="detail-section">
                <h4>Notes</h4>
                <p class="notes-content">{{ clientData.notes }}</p>
              </div>
            }

            <div class="detail-section">
              <div class="section-header">
                <h4>Contacts</h4>
                @if (!isAddingContact()) {
                  <button class="add-contact-button" (click)="toggleAddContactMode()">
                    Add Contact
                  </button>
                }
              </div>

              @if (isAddingContact()) {
                <app-contact-form
                  [clientId]="clientData.id"
                  (contactAdded)="handleContactAdded()"
                  (formCancelled)="toggleAddContactMode()"
                />
              } @else {
                <app-contact-list [contacts]="contacts()" />
              }
            </div>

            <div class="detail-section">
              <div class="section-header">
                <h4>Projects</h4>
                @if (!isAddingProject()) {
                  <button class="add-project-button" (click)="toggleAddProjectMode()">
                    Add Project
                  </button>
                }
              </div>

              @if (isAddingProject()) {
                <app-project-form
                  [clientId]="clientData.id"
                  (formSucceeded)="handleProjectAdded()"
                  (formCancelled)="toggleAddProjectMode()"
                />
              } @else {
                @if (projects().length > 0) {
                  <div class="projects-list">
                    @for (project of projects(); track project.id) {
                      <div class="project-card">
                        <div class="project-header">
                          <h5>{{ project.name }}</h5>
                          <span class="project-status status-{{ project.status.toLowerCase().replace(' ', '-') }}">
                            {{ project.status }}
                          </span>
                        </div>
                        @if (project.description) {
                          <p class="project-description">{{ project.description }}</p>
                        }
                        <div class="project-meta">
                          @if (project.startDate) {
                            <span>Start: {{ project.startDate | date:'shortDate' }}</span>
                          }
                          @if (project.expectedEndDate) {
                            <span>Expected End: {{ project.expectedEndDate | date:'shortDate' }}</span>
                          }
                          @if (project.budget) {
                            <span>Budget: {{ project.budget | currency }}</span>
                          }
                        </div>
                      </div>
                    }
                  </div>
                } @else {
                  <p class="empty-state">No projects yet. Add a project to get started.</p>
                }
              }
            </div>

            <div class="detail-section">
              <div class="section-header">
                <h4>Action Items</h4>
              </div>

              @if (tasks().length > 0) {
                <div class="tasks-list">
                  @for (task of tasks(); track task.id) {
                    <div class="task-card">
                      <div class="task-header">
                        <h5 class="task-title">{{ task.title }}</h5>
                        <div class="task-badges">
                          <span
                            class="priority-badge"
                            [class.priority-urgent]="task.priority === 'Urgent'"
                            [class.priority-high]="task.priority === 'High'"
                            [class.priority-medium]="task.priority === 'Medium'"
                            [class.priority-low]="task.priority === 'Low'">
                            {{ task.priority }}
                          </span>
                          <span
                            class="status-badge"
                            [class.status-todo]="task.status === 'Todo'"
                            [class.status-in-progress]="task.status === 'InProgress'"
                            [class.status-completed]="task.status === 'Completed'"
                            [class.status-cancelled]="task.status === 'Cancelled'">
                            {{ formatTaskStatus(task.status) }}
                          </span>
                        </div>
                      </div>
                      @if (task.notes) {
                        <p class="task-notes">{{ task.notes }}</p>
                      }
                      <div class="task-metadata">
                        @if (task.dueDate) {
                          <div class="task-meta-item" [class.overdue]="isTaskOverdue(task.dueDate)">
                            <span class="meta-label">Due Date:</span>
                            <span class="meta-value">{{ formatTaskDate(task.dueDate) }}</span>
                            @if (isTaskOverdue(task.dueDate)) {
                              <span class="overdue-badge">OVERDUE</span>
                            }
                          </div>
                        }
                        @if (task.projectId) {
                          <div class="task-meta-item">
                            <span class="meta-label">Project:</span>
                            <span class="meta-value">{{ task.projectId }}</span>
                          </div>
                        }
                      </div>
                      <div class="task-actions">
                        <button class="view-task-button" (click)="viewTaskDetails(task.id)">
                          View Details
                        </button>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <p class="empty-state">No action items for this client. Tasks will appear here as they are created.</p>
              }
            </div>

            <div class="detail-section">
              <h4>Metadata</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Client ID:</span>
                  <span class="detail-value">{{ clientData.id }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Created:</span>
                  <span class="detail-value">{{ clientData.createdAt | date:dateFormat }}</span>
                </div>
              </div>
            </div>
          </div>
        }
      }

      @if (showDeleteConfirmation()) {
        <app-confirmation-dialog
          [title]="uiText.DELETE_CONFIRMATION_TITLE"
          [message]="uiText.DELETE_CONFIRMATION_MESSAGE"
          [confirmText]="uiText.DELETE_CONFIRM_BUTTON"
          [cancelText]="uiText.DELETE_CANCEL_BUTTON"
          (confirmed)="confirmDelete()"
          (cancelled)="cancelDelete()"
        />
      }
    </div>
  `
})
export class ClientDetailComponent {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private navigation = inject(ClientNavigationService);
  private clientsService = inject(ClientsService);
  private projectsService = inject(ProjectsService);
  private tasksService = inject(TasksService);

  constructor() {
    // Load clients on component initialization
    this.store.dispatch(loadClients());
  }

  // Get client ID from route params using toSignal to avoid manual subscription cleanup
  private clientId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id'))
    ),
    { initialValue: null }
  );

  // Edit mode state
  isEditing = signal(false);

  // Status change mode state
  isChangingStatus = signal(false);

  // Add contact mode state
  isAddingContact = signal(false);

  // Add project mode state
  isAddingProject = signal(false);

  // Delete confirmation dialog state
  showDeleteConfirmation = signal(false);

  // Signal to trigger reloading of contacts
  private contactsReloadTrigger = signal(0);

  // Signal to trigger reloading of projects
  private projectsReloadTrigger = signal(0);

  // Signal to trigger reloading of tasks
  private tasksReloadTrigger = signal(0);

  // Contacts loaded from service using toSignal
  // Combines clientId and reload trigger to reactively fetch contacts
  contacts = toSignal(
    combineLatest([
      toObservable(this.clientId),
      toObservable(this.contactsReloadTrigger)
    ]).pipe(
      switchMap(([id]) => {
        if (!id) {
          return of([]);
        }
        return this.clientsService.getContactsByClient(id).pipe(
          catchError(error => {
            console.error('Failed to load contacts:', error);
            return of([]);
          })
        );
      })
    ),
    { initialValue: [] }
  );

  // Projects loaded from service using toSignal
  // Combines clientId and reload trigger to reactively fetch projects
  projects = toSignal(
    combineLatest([
      toObservable(this.clientId),
      toObservable(this.projectsReloadTrigger)
    ]).pipe(
      switchMap(([id]) => {
        if (!id) {
          return of([]);
        }
        return this.projectsService.getProjectsByClientId(id).pipe(
          catchError(error => {
            console.error('Failed to load projects:', error);
            return of([]);
          })
        );
      })
    ),
    { initialValue: [] }
  );

  // Tasks loaded from service using toSignal
  // Combines clientId and reload trigger to reactively fetch tasks
  tasks = toSignal(
    combineLatest([
      toObservable(this.clientId),
      toObservable(this.tasksReloadTrigger)
    ]).pipe(
      switchMap(([id]) => {
        if (!id) {
          return of([]);
        }
        return this.tasksService.getTasksByClientId(id).pipe(
          catchError(error => {
            console.error('Failed to load tasks:', error);
            return of([]);
          })
        );
      })
    ),
    { initialValue: [] }
  );

  // Date format for displaying client dates
  readonly dateFormat = STANDARD_DATE_FORMAT;

  // UI text labels
  readonly uiText = CLIENT_UI_TEXT;

  // Select data from store using computed signal that updates when clientId changes
  client = computed(() => {
    const id = this.clientId();
    return id ? this.store.selectSignal(selectClientById(id))() : null;
  });

  loading = this.store.selectSignal(selectClientsLoading);
  error = this.store.selectSignal(selectClientsError);

  navigateBack(): void {
    this.navigation.toClientList();
  }

  /**
   * Helper method to create a toggle function for a signal
   * Reduces duplication by centralizing the toggle logic
   */
  private toggle(s: WritableSignal<boolean>): void {
    s.update(value => !value);
  }

  toggleEditMode(): void {
    this.toggle(this.isEditing);
  }

  handleEditSuccess(): void {
    // Exit edit mode (store is automatically updated with the returned client data)
    this.isEditing.set(false);
  }

  toggleStatusChangeMode(): void {
    this.toggle(this.isChangingStatus);
  }

  handleStatusChangeSuccess(): void {
    // Exit status change mode (store is automatically updated with the returned client data)
    this.isChangingStatus.set(false);
  }

  toggleAddContactMode(): void {
    this.toggle(this.isAddingContact);
  }

  handleContactAdded(): void {
    // Exit add contact mode
    this.isAddingContact.set(false);
    // Trigger contacts reload by incrementing the trigger signal
    this.contactsReloadTrigger.update(v => v + 1);
  }

  toggleAddProjectMode(): void {
    this.toggle(this.isAddingProject);
  }

  handleProjectAdded(): void {
    // Exit add project mode
    this.isAddingProject.set(false);
    // Trigger projects reload by incrementing the trigger signal
    this.projectsReloadTrigger.update(v => v + 1);
  }

  deleteClient(): void {
    // Show confirmation dialog
    this.showDeleteConfirmation.set(true);
  }

  confirmDelete(): void {
    // Hide confirmation dialog
    this.showDeleteConfirmation.set(false);

    // Dispatch delete action
    const id = this.clientId();
    if (id) {
      this.store.dispatch(deleteClient({ id }));
    }
  }

  cancelDelete(): void {
    // Hide confirmation dialog
    this.showDeleteConfirmation.set(false);
  }

  // Task helper methods
  formatTaskStatus(status: string): string {
    // Convert 'InProgress' to 'In Progress', etc.
    return status.replace(/([A-Z])/g, ' $1').trim();
  }

  isTaskOverdue(dueDate: Date | null): boolean {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  }

  formatTaskDate(date: Date | null): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  viewTaskDetails(taskId: string): void {
    this.router.navigate(['/tasks', taskId]);
  }
}
