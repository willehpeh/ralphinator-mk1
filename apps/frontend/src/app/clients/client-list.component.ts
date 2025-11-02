import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { loadClients } from './store/clients.actions';
import {
  selectAllClients,
  selectClientsLoading,
  selectClientsError,
  selectHasClients
} from './store/clients.selectors';

@Component({
  selector: 'app-client-list',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="client-list">
      <h2>Client List</h2>

      @if (loading()) {
        <div class="loading-message">
          Loading clients...
        </div>
      }

      @if (error(); as errorMessage) {
        <div class="error-message">
          {{ errorMessage }}
        </div>
      }

      @if (!loading() && !hasClients()) {
        <div class="empty-state">
          <p>No clients found</p>
          <p class="empty-state-hint">Add your first client to get started</p>
        </div>
      }

      @if (hasClients()) {
        <div class="clients-grid">
          @for (client of clients(); track client.id) {
            <div class="client-card">
              <div class="client-header">
                <h3>{{ client.companyName }}</h3>
                <span class="status-badge" [class]="'status-' + client.status.toLowerCase()">
                  {{ client.status }}
                </span>
              </div>
              <div class="client-details">
                <div class="detail-row">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value">{{ client.email }}</span>
                </div>
                @if (client.phone) {
                  <div class="detail-row">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">{{ client.phone }}</span>
                  </div>
                }
                @if (client.address) {
                  <div class="detail-row">
                    <span class="detail-label">Address:</span>
                    <span class="detail-value">{{ client.address }}</span>
                  </div>
                }
                @if (client.notes) {
                  <div class="detail-row">
                    <span class="detail-label">Notes:</span>
                    <span class="detail-value">{{ client.notes }}</span>
                  </div>
                }
                <div class="detail-row">
                  <span class="detail-label">Created:</span>
                  <span class="detail-value">{{ client.createdAt | date:'short' }}</span>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .client-list {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    h2 {
      margin-bottom: 1.5rem;
      color: #333;
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

    .empty-state {
      padding: 3rem;
      text-align: center;
      color: #666;
    }

    .empty-state p {
      margin: 0.5rem 0;
      font-size: 1.1rem;
    }

    .empty-state-hint {
      color: #999;
      font-size: 0.95rem;
    }

    .clients-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .client-card {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 1.5rem;
      transition: box-shadow 0.2s;
    }

    .client-card:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .client-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }

    .client-header h3 {
      margin: 0;
      color: #333;
      font-size: 1.25rem;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
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

    .client-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .detail-row {
      display: flex;
      gap: 0.5rem;
    }

    .detail-label {
      font-weight: 500;
      color: #666;
      min-width: 70px;
    }

    .detail-value {
      color: #333;
      word-break: break-word;
    }
  `]
})
export class ClientListComponent implements OnInit {
  private store = inject(Store);

  // Select data from store using signals
  clients = this.store.selectSignal(selectAllClients);
  loading = this.store.selectSignal(selectClientsLoading);
  error = this.store.selectSignal(selectClientsError);
  hasClients = this.store.selectSignal(selectHasClients);

  ngOnInit(): void {
    // Dispatch action to load clients when component initializes
    this.store.dispatch(loadClients());
  }
}
