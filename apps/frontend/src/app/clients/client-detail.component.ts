import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadClients, deleteClient } from './store/clients.actions';
import { selectClientById, selectClientsLoading, selectClientsError } from './store/clients.selectors';
import { ClientFormComponent } from './client-form.component';
import { ChangeStatusFormComponent } from './change-status-form.component';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog.component';
import { StatusBadgeComponent } from './status-badge.component';
import { CLIENT_ROUTES } from './client-routes.constants';
import { STANDARD_DATE_FORMAT } from './client-display.constants';

@Component({
  selector: 'app-client-detail',
  imports: [CommonModule, ClientFormComponent, ChangeStatusFormComponent, ConfirmationDialogComponent, StatusBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./clients-common.scss', './client-detail.component.scss'],
  template: `
    <div class="client-detail">
      <div class="detail-header">
        <button class="back-button" (click)="navigateBack()">
          ← Back to List
        </button>
        <div class="header-title-section">
          <h2>Client Details</h2>
          @if (!isEditing() && !isChangingStatus() && client()) {
            <div class="action-buttons">
              <button class="edit-button" (click)="toggleEditMode()">
                Edit Client
              </button>
              <button class="change-status-button" (click)="toggleStatusChangeMode()">
                Change Status
              </button>
              <button class="delete-button" (click)="deleteClient()">
                Delete Client
              </button>
            </div>
          }
        </div>
      </div>

      @if (loading()) {
        <div class="loading-message">
          Loading client details...
        </div>
      }

      @if (error(); as errorMessage) {
        <div class="error-message">
          {{ errorMessage }}
        </div>
      }

      @if (!loading() && !client() && !error()) {
        <div class="error-message">
          Client not found
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
          [title]="'Delete Client'"
          [message]="'Are you sure you want to delete this client? This action cannot be undone.'"
          [confirmText]="'Delete'"
          [cancelText]="'Cancel'"
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
  private router = inject(Router);

  // Get client ID from route params
  private clientId = signal<string | null>(null);

  // Edit mode state
  isEditing = signal(false);

  // Status change mode state
  isChangingStatus = signal(false);

  // Delete confirmation dialog state
  showDeleteConfirmation = signal(false);

  // Date format for displaying client dates
  readonly dateFormat = STANDARD_DATE_FORMAT;

  // Select data from store using signals
  client = this.store.selectSignal(selectClientById(this.clientId() ?? ''));
  loading = this.store.selectSignal(selectClientsLoading);
  error = this.store.selectSignal(selectClientsError);

  ngOnInit(): void {
    // Get the client ID from route parameters
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.clientId.set(id);

      // Load clients if not already loaded
      this.store.dispatch(loadClients());
    });
  }

  navigateBack(): void {
    this.router.navigate([CLIENT_ROUTES.BASE]);
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
