import { Component, ChangeDetectionStrategy, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
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
import { STANDARD_DATE_FORMAT, CLIENT_UI_TEXT } from './client-display.constants';
import { Contact } from './client.types';
import { ProjectFormComponent } from '../projects/project-form.component';
import { ProjectsService } from '../projects/projects.service';
import { ProjectDto } from '@angular-nest-starter/shared-types';

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
  private navigation = inject(ClientNavigationService);
  private clientsService = inject(ClientsService);
  private projectsService = inject(ProjectsService);

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

  toggleEditMode(): void {
    this.isEditing.update(value => !value);
  }

  handleEditSuccess(): void {
    // Exit edit mode (store is automatically updated with the returned client data)
    this.isEditing.set(false);
  }

  toggleStatusChangeMode(): void {
    this.isChangingStatus.update(value => !value);
  }

  handleStatusChangeSuccess(): void {
    // Exit status change mode (store is automatically updated with the returned client data)
    this.isChangingStatus.set(false);
  }

  toggleAddContactMode(): void {
    this.isAddingContact.update(value => !value);
  }

  handleContactAdded(): void {
    // Exit add contact mode
    this.isAddingContact.set(false);
    // Trigger contacts reload by incrementing the trigger signal
    this.contactsReloadTrigger.update(v => v + 1);
  }

  toggleAddProjectMode(): void {
    this.isAddingProject.update(value => !value);
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
}
