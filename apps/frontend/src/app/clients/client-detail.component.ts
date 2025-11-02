import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadClients } from './store/clients.actions';
import { selectClientById, selectClientsLoading, selectClientsError } from './store/clients.selectors';
import { EditClientFormComponent } from './edit-client-form.component';
import { ChangeStatusFormComponent } from './change-status-form.component';

@Component({
  selector: 'app-client-detail',
  imports: [CommonModule, EditClientFormComponent, ChangeStatusFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
          <app-edit-client-form
            [clientId]="clientData.id"
            (editCancelled)="toggleEditMode()"
            (editSucceeded)="handleEditSuccess()"
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
              <span class="status-badge" [class]="'status-' + clientData.status.toLowerCase()">
                {{ clientData.status }}
              </span>
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
                  <span class="detail-value">{{ clientData.createdAt | date:'medium' }}</span>
                </div>
              </div>
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .client-detail {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
    }

    .detail-header {
      margin-bottom: 2rem;
    }

    .header-title-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .back-button {
      background: none;
      border: none;
      color: #007bff;
      cursor: pointer;
      font-size: 0.95rem;
      padding: 0.5rem 0;
      margin-bottom: 1rem;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      transition: color 0.2s;
    }

    .back-button:hover {
      color: #0056b3;
      text-decoration: underline;
    }

    h2 {
      margin: 0;
      color: #333;
      font-size: 1.75rem;
    }

    .action-buttons {
      display: flex;
      gap: 0.75rem;
    }

    .edit-button {
      padding: 0.6rem 1.5rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .edit-button:hover {
      background-color: #0056b3;
    }

    .change-status-button {
      padding: 0.6rem 1.5rem;
      background-color: #6c757d;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .change-status-button:hover {
      background-color: #5a6268;
    }

    .loading-message {
      padding: 2rem;
      text-align: center;
      color: #666;
      font-size: 1.1rem;
    }

    .error-message {
      padding: 1rem;
      margin-bottom: 1.5rem;
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      color: #721c24;
      font-weight: 500;
    }

    .detail-card {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 2rem;
    }

    .detail-header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 2px solid #eee;
    }

    .detail-header-section h3 {
      margin: 0;
      color: #333;
      font-size: 1.5rem;
    }

    .status-badge {
      padding: 0.5rem 1rem;
      border-radius: 16px;
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-active {
      background-color: #d4edda;
      color: #155724;
    }

    .status-inactive {
      background-color: #f8d7da;
      color: #721c24;
    }

    .status-pending {
      background-color: #fff3cd;
      color: #856404;
    }

    .detail-section {
      margin-bottom: 2rem;
    }

    .detail-section:last-child {
      margin-bottom: 0;
    }

    h4 {
      margin: 0 0 1rem 0;
      color: #555;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .detail-label {
      font-weight: 600;
      color: #666;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-value {
      color: #333;
      font-size: 1rem;
      word-break: break-word;
    }

    .notes-content {
      color: #333;
      line-height: 1.6;
      margin: 0;
      white-space: pre-wrap;
    }
  `]
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
    this.router.navigate(['/clients']);
  }

  toggleEditMode(): void {
    this.isEditing.update(value => !value);
  }

  handleEditSuccess(): void {
    // Exit edit mode and reload clients to show updated data
    this.isEditing.set(false);
    this.store.dispatch(loadClients());
  }

  toggleStatusChangeMode(): void {
    this.isChangingStatus.update(value => !value);
  }

  handleStatusChangeSuccess(): void {
    // Exit status change mode and reload clients to show updated data
    this.isChangingStatus.set(false);
    this.store.dispatch(loadClients());
  }
}
