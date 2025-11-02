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
import { CLIENT_STATUSES, FILTER_ALL_CLIENTS } from './client.constants';
import { CLIENT_ROUTES } from './client-routes.constants';
import { STANDARD_DATE_FORMAT, CLIENT_UI_TEXT } from './client-display.constants';
import { StatusBadgeComponent } from './status-badge.component';

@Component({
  selector: 'app-client-list',
  imports: [CommonModule, StatusBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./clients-common.scss', './client-list.component.scss'],
  template: `
    <div class="client-list">
      <div class="list-header">
        <h2>{{ uiText.CLIENT_LIST }}</h2>

        <div class="header-actions">
          <button class="add-client-btn" (click)="navigateToAddClient()">
            {{ uiText.ADD_NEW_CLIENT }}
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
              <option [value]="filterAllValue">All Clients</option>
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
          @if (selectedFilter() !== filterAllValue) {
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
            } @else if (selectedFilter() === filterAllValue) {
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
                <app-status-badge [status]="client.status" />
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
                  <span class="detail-value">{{ client.createdAt | date:dateFormat }}</span>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class ClientListComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  // Available status options
  readonly availableStatuses = CLIENT_STATUSES;

  // Date format for displaying client dates
  readonly dateFormat = STANDARD_DATE_FORMAT;

  // Filter value for "all clients" option
  readonly filterAllValue = FILTER_ALL_CLIENTS;

  // UI text labels
  readonly uiText = CLIENT_UI_TEXT;

  // Select data from store using signals
  clients = this.store.selectSignal(selectAllClients);
  loading = this.store.selectSignal(selectClientsLoading);
  error = this.store.selectSignal(selectClientsError);
  hasClients = this.store.selectSignal(selectHasClients);

  // Track selected filter
  selectedFilter = signal<typeof FILTER_ALL_CLIENTS | ClientStatus>(FILTER_ALL_CLIENTS);

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
    const value = selectElement.value as typeof FILTER_ALL_CLIENTS | ClientStatus;

    this.selectedFilter.set(value);

    if (value === FILTER_ALL_CLIENTS) {
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
    this.router.navigate([CLIENT_ROUTES.detail(clientId)]);
  }

  navigateToAddClient(): void {
    this.router.navigate([CLIENT_ROUTES.ADD]);
  }
}
