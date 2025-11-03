import { Component, ChangeDetectionStrategy, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { loadClients, deleteClient } from './store/clients.actions';
import { selectClientById, selectClientsLoading, selectClientsError } from './store/clients.selectors';
import { ClientFormComponent } from './client-form.component';
import { ChangeStatusFormComponent } from './change-status-form.component';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog.component';
import { StatusBadgeComponent } from './status-badge.component';
import { ContactFormComponent } from './contact-form.component';
import { ClientNavigationService } from './client-navigation.service';
import { STANDARD_DATE_FORMAT, CLIENT_UI_TEXT } from './client-display.constants';

@Component({
  selector: 'app-client-detail',
  imports: [CommonModule, ClientFormComponent, ChangeStatusFormComponent, ConfirmationDialogComponent, StatusBadgeComponent, ContactFormComponent],
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
                <p class="empty-state">No contacts yet. Click "Add Contact" to create the first contact for this client.</p>
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
export class ClientDetailComponent implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private navigation = inject(ClientNavigationService);

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

  // Delete confirmation dialog state
  showDeleteConfirmation = signal(false);

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

  ngOnInit(): void {
    // Load clients if not already loaded
    this.store.dispatch(loadClients());
  }

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
    // TODO: Reload contacts list when contact list component is implemented
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
