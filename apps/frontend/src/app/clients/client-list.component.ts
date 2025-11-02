import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadClients, filterClientsByStatus, filterClientsByName } from './store/clients.actions';
import {
  selectAllClients,
  selectClientsLoading,
  selectClientsError,
  selectHasClients
} from './store/clients.selectors';
import { ClientStatus } from './client.types';
import { CLIENT_STATUSES } from './client.constants';

@Component({
  selector: 'app-client-list',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './clients-common.scss',
  template: `
    <div class="client-list">
      <div class="list-header">
        <h2>Client List</h2>

        <div class="header-actions">
          <button class="add-client-btn" (click)="navigateToAddClient()">
            Add New Client
          </button>

          <div class="search-controls">
            <label for="search-input">Search:</label>
            <input
              id="search-input"
              type="text"
              placeholder="Search by company name..."
              class="search-input"
              (input)="onSearchChange($event)" />
          </div>

          <div class="filter-controls">
            <label for="status-filter">Filter by Status:</label>
            <select
              id="status-filter"
              (change)="onFilterChange($event)"
              [value]="selectedFilter()">
              <option value="all">All Clients</option>
              @for (status of availableStatuses; track status) {
                <option [value]="status">{{ status }}</option>
              }
            </select>
          </div>
        </div>
      </div>

      @if (!loading() && hasClients()) {
        <div class="client-count">
          Showing {{ clientCount() }} {{ clientCount() === 1 ? 'client' : 'clients' }}
          @if (searchTerm()) {
            matching "{{ searchTerm() }}"
          }
          @if (selectedFilter() !== 'all') {
            with status "{{ selectedFilter() }}"
          }
        </div>
      }

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
          <p class="empty-state-hint">
            @if (searchTerm()) {
              No clients found matching your search "{{ searchTerm() }}". Try a different search term.
            } @else if (selectedFilter() === 'all') {
              Add your first client to get started
            } @else {
              No clients found with status "{{ selectedFilter() }}". Try a different filter.
            }
          </p>
        </div>
      }

      @if (hasClients()) {
        <div class="clients-grid">
          @for (client of clients(); track client.id) {
            <div
              class="client-card"
              role="button"
              tabindex="0"
              (click)="navigateToDetail(client.id)"
              (keydown.enter)="navigateToDetail(client.id)"
              (keydown.space)="navigateToDetail(client.id)">
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

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    h2 {
      margin: 0;
      color: #333;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .add-client-btn {
      padding: 0.75rem 1.5rem;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .add-client-btn:hover {
      background-color: #45a049;
    }

    .search-controls {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .search-controls label {
      font-weight: 500;
      color: #555;
      font-size: 0.95rem;
    }

    .search-input {
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: white;
      color: #333;
      font-size: 0.95rem;
      min-width: 250px;
      transition: border-color 0.2s;
    }

    .search-input:hover {
      border-color: #4CAF50;
    }

    .search-input:focus {
      outline: none;
      border-color: #4CAF50;
      box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
    }

    .search-input::placeholder {
      color: #999;
    }

    .filter-controls {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .filter-controls label {
      font-weight: 500;
      color: #555;
      font-size: 0.95rem;
    }

    .filter-controls select {
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: white;
      color: #333;
      font-size: 0.95rem;
      cursor: pointer;
      transition: border-color 0.2s;
    }

    .filter-controls select:hover {
      border-color: #4CAF50;
    }

    .filter-controls select:focus {
      outline: none;
      border-color: #4CAF50;
      box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
    }

    .client-count {
      padding: 0.75rem 1rem;
      background-color: #f5f5f5;
      border-left: 3px solid #4CAF50;
      color: #555;
      font-size: 0.95rem;
      margin-bottom: 1rem;
      border-radius: 4px;
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
      transition: all 0.2s;
      cursor: pointer;
    }

    .client-card:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border-color: #4CAF50;
      transform: translateY(-2px);
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

    .client-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .detail-label {
      min-width: 70px;
    }
  `]
})
export class ClientListComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  // Available status options
  readonly availableStatuses = CLIENT_STATUSES;

  // Select data from store using signals
  clients = this.store.selectSignal(selectAllClients);
  loading = this.store.selectSignal(selectClientsLoading);
  error = this.store.selectSignal(selectClientsError);
  hasClients = this.store.selectSignal(selectHasClients);

  // Track selected filter
  selectedFilter = signal<'all' | ClientStatus>('all');

  // Track search term
  searchTerm = signal<string>('');

  // Compute client count
  clientCount = computed(() => this.clients().length);

  ngOnInit(): void {
    // Dispatch action to load clients when component initializes
    this.store.dispatch(loadClients());
  }

  onFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value as 'all' | ClientStatus;

    this.selectedFilter.set(value);

    if (value === 'all') {
      // Load all clients
      this.store.dispatch(loadClients());
    } else {
      // Filter clients by selected status
      this.store.dispatch(filterClientsByStatus({ status: value }));
    }
  }

  onSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchTerm = inputElement.value;
    this.searchTerm.set(searchTerm);
    this.store.dispatch(filterClientsByName({ searchTerm }));
  }

  navigateToDetail(clientId: string): void {
    this.router.navigate(['/clients', clientId]);
  }

  navigateToAddClient(): void {
    this.router.navigate(['/clients/add']);
  }
}
