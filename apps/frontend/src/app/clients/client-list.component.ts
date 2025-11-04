import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { ClientNavigationService } from './client-navigation.service';
import { STANDARD_DATE_FORMAT } from '../shared/ui.constants';
import { CLIENT_UI_TEXT } from './client-display.constants';
import { StatusBadgeComponent } from './status-badge.component';
import { extractSelectValue, extractInputValue } from '../shared/form-event-utils';

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
              [placeholder]="uiText.SEARCH_PLACEHOLDER"
              class="search-input"
              (input)="onSearchChange($event)" />
          </div>

          <div class="filter-controls">
            <label for="status-filter">Filter by Status:</label>
            <select
              id="status-filter"
              (change)="onFilterChange($event)"
              [value]="selectedFilter()">
              <option [value]="filterAllValue">{{ uiText.ALL_CLIENTS_FILTER }}</option>
              @for (status of availableStatuses; track status) {
                <option [value]="status">{{ status }}</option>
              }
            </select>
          </div>
        </div>
      </div>

      @if (!loading() && hasClients()) {
        <div class="client-count">
          {{ uiText.SHOWING_PREFIX }} {{ clientCount() }} {{ clientCount() === 1 ? uiText.CLIENT_SINGULAR : uiText.CLIENT_PLURAL }}
          @if (searchTerm()) {
            {{ uiText.MATCHING_PREFIX }} "{{ searchTerm() }}"
          }
          @if (selectedFilter() !== filterAllValue) {
            {{ uiText.WITH_STATUS_PREFIX }} "{{ selectedFilter() }}"
          }
        </div>
      }

      @if (loading()) {
        <div class="loading-message">
          {{ uiText.LOADING_CLIENTS }}
        </div>
      }

      @if (error(); as errorMessage) {
        <div class="error-message">
          {{ errorMessage }}
        </div>
      }

      @if (!loading() && !hasClients()) {
        <div class="empty-state">
          <p>{{ uiText.NO_CLIENTS_FOUND }}</p>
          <p class="empty-state-hint">
            @if (searchTerm()) {
              {{ uiText.NO_CLIENTS_MATCHING_SEARCH }} "{{ searchTerm() }}". {{ uiText.NO_SEARCH_RESULTS }}
            } @else if (selectedFilter() === filterAllValue) {
              {{ uiText.ADD_FIRST_CLIENT }}
            } @else {
              {{ uiText.NO_CLIENTS_WITH_STATUS }} "{{ selectedFilter() }}". {{ uiText.NO_FILTER_RESULTS }}
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
                  <span class="detail-label">{{ uiText.LABEL_EMAIL }}</span>
                  <span class="detail-value">{{ client.email }}</span>
                </div>
                @if (client.phone) {
                  <div class="detail-row">
                    <span class="detail-label">{{ uiText.LABEL_PHONE }}</span>
                    <span class="detail-value">{{ client.phone }}</span>
                  </div>
                }
                @if (client.address) {
                  <div class="detail-row">
                    <span class="detail-label">{{ uiText.LABEL_ADDRESS }}</span>
                    <span class="detail-value">{{ client.address }}</span>
                  </div>
                }
                @if (client.notes) {
                  <div class="detail-row">
                    <span class="detail-label">{{ uiText.LABEL_NOTES }}</span>
                    <span class="detail-value">{{ client.notes }}</span>
                  </div>
                }
                <div class="detail-row">
                  <span class="detail-label">{{ uiText.LABEL_CREATED }}</span>
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
  private navigation = inject(ClientNavigationService);

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
    const value = extractSelectValue(event) as typeof FILTER_ALL_CLIENTS | ClientStatus;

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
    const searchTerm = extractInputValue(event);
    this.searchTerm.set(searchTerm);
    this.store.dispatch(filterClientsByName({ searchTerm }));
  }

  navigateToDetail(clientId: string): void {
    this.navigation.toClientDetail(clientId);
  }

  navigateToAddClient(): void {
    this.navigation.toAddClient();
  }
}
