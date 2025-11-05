import { Component, ChangeDetectionStrategy, inject, OnInit, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CommunicationsService } from './communications.service';
import { CommunicationReadModel, CommunicationType, COMMUNICATION_TYPE_VALUES } from '@angular-nest-starter/shared-types';

@Component({
  selector: 'app-communications-list',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './communications-list.component.scss',
  template: `
    <div class="communications-list-container">
      <div class="communications-list-header">
        <h1>Communication History</h1>
        <button type="button" class="add-communication-button" (click)="onAddCommunication()">
          Add Communication
        </button>
      </div>

      <div class="filters-section">
        <div class="filter-group filter-group-search">
          <label for="search-filter" class="filter-label">Search:</label>
          <input
            type="text"
            id="search-filter"
            class="filter-search-input"
            placeholder="Search by subject or notes..."
            [value]="searchText()"
            (input)="onSearchTextChange($event)">
        </div>

        <div class="filter-group">
          <label for="client-filter" class="filter-label">Filter by Client:</label>
          <select
            id="client-filter"
            class="filter-select"
            [value]="selectedClientId()"
            (change)="onClientFilterChange($event)">
            <option value="">All Clients</option>
            @for (client of mockClients; track client.id) {
              <option [value]="client.id">{{ client.name }}</option>
            }
          </select>
        </div>

        <div class="filter-group">
          <label for="type-filter" class="filter-label">Filter by Type:</label>
          <select
            id="type-filter"
            class="filter-select"
            [value]="selectedType()"
            (change)="onTypeFilterChange($event)">
            <option value="">All Types</option>
            @for (type of communicationTypes; track type) {
              <option [value]="type">{{ type }}</option>
            }
          </select>
        </div>

        <div class="filter-group filter-group-checkbox">
          <label class="checkbox-label">
            <input
              type="checkbox"
              id="follow-up-filter"
              class="filter-checkbox"
              [checked]="requiresFollowUp()"
              (change)="onFollowUpFilterChange($event)">
            <span class="checkbox-text">Show only items requiring follow-up</span>
          </label>
        </div>

        <div class="filter-group">
          <label for="from-date-filter" class="filter-label">From Date:</label>
          <input
            type="date"
            id="from-date-filter"
            class="filter-date-input"
            [value]="fromDate()"
            (change)="onFromDateChange($event)">
        </div>

        <div class="filter-group">
          <label for="to-date-filter" class="filter-label">To Date:</label>
          <input
            type="date"
            id="to-date-filter"
            class="filter-date-input"
            [value]="toDate()"
            (change)="onToDateChange($event)">
        </div>

        @if (hasActiveFilters()) {
          <div class="filter-group filter-group-clear">
            <button type="button" class="clear-filters-button" (click)="clearFilters()">
              Clear Filters
            </button>
          </div>
        }
      </div>

      @if (loading()) {
        <div class="loading">Loading communications...</div>
      }

      @if (error()) {
        <div class="error">
          <p>Failed to load communications: {{ error() }}</p>
          <button type="button" (click)="loadCommunications()">Retry</button>
        </div>
      }

      @if (!loading() && !error()) {
        @if (communications().length === 0) {
          <div class="empty-state">
            @if (hasActiveFilters()) {
              <p>No communications match your filters.</p>
              <p class="empty-state-hint">Try adjusting your search criteria or <button type="button" class="inline-link-button" (click)="clearFilters()">clear all filters</button>.</p>
            } @else {
              <p>No communications recorded yet.</p>
              <button type="button" (click)="onAddCommunication()">Add First Communication</button>
            }
          </div>
        } @else {
          <div class="results-header">
            <div class="communications-count">
              {{ communications().length }} {{ communications().length === 1 ? 'communication' : 'communications' }}
            </div>

            <div class="sort-controls">
              <label for="sort-select" class="sort-label">Sort by:</label>
              <select
                id="sort-select"
                class="sort-select"
                [value]="sortBy()"
                (change)="onSortChange($event)">
                <option value="date-desc">Date (Newest First)</option>
                <option value="date-asc">Date (Oldest First)</option>
                <option value="client">Client (A-Z)</option>
                <option value="type">Type (A-Z)</option>
              </select>
            </div>
          </div>

          <div class="communications-grid">
            @for (comm of sortedCommunications(); track comm.id) {
              <div class="communication-card"
                   [class.overdue-follow-up]="comm.followUpRequired && isFollowUpOverdue(comm.followUpDate)"
                   tabindex="0"
                   role="button"
                   (click)="viewCommunication(comm.id)"
                   (keydown.enter)="viewCommunication(comm.id)"
                   (keydown.space)="viewCommunication(comm.id)">
                <div class="card-header">
                  <span class="type-badge" [class]="getTypeBadgeClass(comm.type)">
                    {{ comm.type }}
                  </span>
                  <span class="date">{{ formatDate(comm.communicationDate) }}</span>
                </div>

                <h3 class="subject">{{ comm.subject }}</h3>

                <div class="card-details">
                  @if (comm.clientId) {
                    <div class="detail-item">
                      <span class="label">Client:</span>
                      <span class="value">{{ comm.clientId }}</span>
                    </div>
                  }

                  @if (comm.followUpRequired) {
                    <div class="follow-up-indicator">
                      <span class="follow-up-badge"
                            [class.overdue]="isFollowUpOverdue(comm.followUpDate)">
                        @if (isFollowUpOverdue(comm.followUpDate)) {
                          Overdue Follow-up
                        } @else {
                          Follow-up Required
                        }
                      </span>
                      @if (comm.followUpDate) {
                        <span class="follow-up-date"
                              [class.overdue]="isFollowUpOverdue(comm.followUpDate)">
                          {{ formatDate(comm.followUpDate) }}
                        </span>
                      }
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        }
      }
    </div>
  `
})
export class CommunicationsListComponent implements OnInit {
  private router = inject(Router);
  private communicationsService = inject(CommunicationsService);

  // State signals
  communications = signal<CommunicationReadModel[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // Filter signals
  selectedClientId = signal<string>('');
  selectedType = signal<string>('');
  requiresFollowUp = signal<boolean>(false);
  fromDate = signal<string>('');
  toDate = signal<string>('');
  searchText = signal<string>('');

  // Sort signal
  sortBy = signal<string>('date-desc');

  // Mock client data (TODO: Replace with actual client data from API)
  mockClients = [
    { id: '1', name: 'Acme Corporation' },
    { id: '2', name: 'TechStart Inc' },
    { id: '3', name: 'Global Solutions LLC' },
  ];

  // Communication types for filter dropdown
  communicationTypes = COMMUNICATION_TYPE_VALUES;

  // Computed signal that consolidates all filter state
  activeFilters = computed(() => ({
    clientId: this.selectedClientId(),
    type: this.selectedType(),
    requiresFollowUp: this.requiresFollowUp(),
    fromDate: this.fromDate(),
    toDate: this.toDate(),
    searchText: this.searchText()
  }));

  // Computed signal to check if any filters are active
  hasActiveFilters = computed(() => {
    const filters = this.activeFilters();
    return !!(
      filters.clientId ||
      filters.type ||
      filters.requiresFollowUp ||
      filters.fromDate ||
      filters.toDate ||
      filters.searchText
    );
  });

  // Computed signal for sorted communications
  sortedCommunications = computed(() => {
    const comms = [...this.communications()];
    const sortOption = this.sortBy();

    switch (sortOption) {
      case 'date-asc':
        return comms.sort((a, b) =>
          new Date(a.communicationDate).getTime() - new Date(b.communicationDate).getTime()
        );
      case 'date-desc':
        return comms.sort((a, b) =>
          new Date(b.communicationDate).getTime() - new Date(a.communicationDate).getTime()
        );
      case 'client':
        return comms.sort((a, b) => {
          const clientA = a.clientId || '';
          const clientB = b.clientId || '';
          return clientA.localeCompare(clientB);
        });
      case 'type':
        return comms.sort((a, b) => a.type.localeCompare(b.type));
      default:
        return comms;
    }
  });

  constructor() {
    // Automatically reload communications when any filter changes
    effect(() => {
      const _filters = this.activeFilters();
      this.loadCommunications();
    });
  }

  ngOnInit(): void {
    this.loadCommunications();
  }

  /**
   * Builds query parameters from current filter state
   * Returns an object with only the filters that have values
   */
  private buildQueryParams(): { [key: string]: string } {
    const filters = this.activeFilters();
    const params: { [key: string]: string } = {};

    if (filters.clientId) {
      params['clientId'] = filters.clientId;
    }

    if (filters.type) {
      params['type'] = filters.type;
    }

    if (filters.requiresFollowUp) {
      params['requiresFollowUp'] = 'true';
    }

    if (filters.fromDate) {
      params['fromDate'] = filters.fromDate;
    }

    if (filters.toDate) {
      params['toDate'] = filters.toDate;
    }

    if (filters.searchText) {
      params['searchText'] = filters.searchText;
    }

    return params;
  }

  loadCommunications(): void {
    this.loading.set(true);
    this.error.set(null);

    const queryParams = this.buildQueryParams();

    this.communicationsService.getAllCommunications(queryParams).subscribe({
      next: (data) => {
        this.communications.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'An error occurred');
        this.loading.set(false);
      }
    });
  }

  onAddCommunication(): void {
    this.router.navigate(['/communications/add']);
  }

  viewCommunication(id: string): void {
    this.router.navigate(['/communications', id]);
  }

  onClientFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedClientId.set(selectElement.value);
  }

  onTypeFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedType.set(selectElement.value);
  }

  onFollowUpFilterChange(event: Event): void {
    const checkboxElement = event.target as HTMLInputElement;
    this.requiresFollowUp.set(checkboxElement.checked);
  }

  onFromDateChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.fromDate.set(inputElement.value);
  }

  onToDateChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.toDate.set(inputElement.value);
  }

  onSearchTextChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchText.set(inputElement.value);
  }

  onSortChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.sortBy.set(selectElement.value);
  }

  /**
   * Clears all active filters and resets to default state
   */
  clearFilters(): void {
    this.selectedClientId.set('');
    this.selectedType.set('');
    this.requiresFollowUp.set(false);
    this.fromDate.set('');
    this.toDate.set('');
    this.searchText.set('');
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getTypeBadgeClass(type: CommunicationType): string {
    const baseClass = 'type-';
    switch (type) {
      case 'Call':
        return baseClass + 'call';
      case 'Email':
        return baseClass + 'email';
      case 'Meeting':
        return baseClass + 'meeting';
      case 'Chat':
        return baseClass + 'chat';
      case 'Other':
        return baseClass + 'other';
      default:
        return baseClass + 'default';
    }
  }

  /**
   * Checks if a follow-up is overdue
   * Returns true if the follow-up date is in the past
   */
  isFollowUpOverdue(followUpDate: string | null | undefined): boolean {
    if (!followUpDate) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

    const followUp = new Date(followUpDate);
    followUp.setHours(0, 0, 0, 0);

    return followUp < today;
  }
}
