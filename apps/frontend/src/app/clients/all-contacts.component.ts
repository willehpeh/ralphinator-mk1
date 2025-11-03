import { Component, ChangeDetectionStrategy, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientsService } from './clients.service';
import { ContactWithClient } from './client.types';

@Component({
  selector: 'app-all-contacts',
  imports: [CommonModule, RouterLink, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./clients-common.scss'],
  styles: [`
    .contacts-page {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .page-header {
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .page-header h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
    }

    .page-subtitle {
      margin: 0;
      color: #6b7280;
      font-size: 1rem;
    }

    .contacts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .contact-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
      display: block;
      text-decoration: none;
      color: inherit;
      cursor: pointer;
    }

    .contact-card:hover {
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
      transform: translateY(-4px);
      border-color: #3b82f6;
    }

    .contact-header {
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #f3f4f6;
    }

    .contact-name {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }

    .contact-role {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
      font-style: italic;
    }

    .contact-details {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .contact-detail {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      font-size: 0.875rem;
      color: #4b5563;
    }

    .contact-icon {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
      color: #6b7280;
    }

    .contact-link {
      color: #3b82f6;
      text-decoration: none;
      word-break: break-all;
    }

    .contact-link:hover {
      text-decoration: underline;
    }

    .client-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.375rem 0.75rem;
      background-color: #f3f4f6;
      border-radius: 6px;
      font-size: 0.8125rem;
      color: #4b5563;
      font-weight: 500;
    }

    .client-icon {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #6b7280;
    }

    .empty-state-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 1rem;
      color: #d1d5db;
    }

    .empty-state h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
    }

    .empty-state p {
      margin: 0;
      font-size: 1rem;
      color: #6b7280;
    }

    .no-results-state {
      text-align: center;
      padding: 3rem 2rem;
      background-color: #f9fafb;
      border-radius: 12px;
      border: 2px dashed #d1d5db;
    }

    .no-results-icon {
      width: 48px;
      height: 48px;
      margin: 0 auto 1rem;
      color: #9ca3af;
    }

    .no-results-state h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #374151;
    }

    .no-results-state p {
      margin: 0;
      font-size: 0.9375rem;
      color: #6b7280;
      line-height: 1.5;
    }

    .clear-search-btn {
      margin-top: 1.25rem;
      padding: 0.625rem 1.25rem;
      background-color: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.9375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .clear-search-btn:hover {
      background-color: #2563eb;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);
    }

    .clear-search-btn:active {
      transform: translateY(0);
    }

    .loading-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #6b7280;
      font-size: 1.125rem;
    }

    .error-state {
      text-align: center;
      padding: 2rem;
      background-color: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      color: #991b1b;
    }

    .contact-count {
      margin-bottom: 1.5rem;
      padding: 1rem;
      background-color: #f9fafb;
      border-radius: 8px;
      font-size: 0.875rem;
      color: #4b5563;
      font-weight: 500;
    }

    .search-section {
      margin-bottom: 2rem;
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      flex-wrap: wrap;
    }

    .search-input-wrapper {
      position: relative;
      flex: 1;
      min-width: 300px;
      max-width: 600px;
    }

    .sort-controls {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .sort-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #4b5563;
    }

    .sort-buttons {
      display: flex;
      gap: 0.5rem;
      background-color: #f3f4f6;
      border-radius: 8px;
      padding: 0.25rem;
    }

    .sort-button {
      padding: 0.5rem 1rem;
      background-color: transparent;
      color: #6b7280;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .sort-button:hover {
      background-color: rgba(255, 255, 255, 0.6);
      color: #374151;
    }

    .sort-button.active {
      background-color: white;
      color: #3b82f6;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      color: #9ca3af;
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: 0.875rem 1rem 0.875rem 3rem;
      border: 2px solid #e5e7eb;
      border-radius: 10px;
      font-size: 1rem;
      transition: all 0.2s ease;
      outline: none;
    }

    .search-input:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .search-input::placeholder {
      color: #9ca3af;
    }
  `],
  template: `
    <div class="contacts-page">
      <div class="page-header">
        <h1>All Contacts</h1>
        <p class="page-subtitle">View and manage all contacts across all clients</p>
      </div>

      @if (loading()) {
        <div class="loading-state">
          Loading contacts...
        </div>
      }

      @if (error(); as errorMessage) {
        <div class="error-state">
          <strong>Error:</strong> {{ errorMessage }}
        </div>
      }

      @if (!loading() && contacts().length === 0) {
        <div class="empty-state">
          <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2>No Contacts Yet</h2>
          <p>Start by adding contacts to your clients to see them here.</p>
        </div>
      }

      @if (!loading() && contacts().length > 0) {
        <div class="search-section">
          <div class="search-input-wrapper">
            <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              class="search-input"
              placeholder="Search by name, role, email, or client name..."
              [ngModel]="searchQuery()"
              (ngModelChange)="searchQuery.set($event)"
            />
          </div>

          <div class="sort-controls">
            <span class="sort-label">Sort by:</span>
            <div class="sort-buttons">
              <button
                class="sort-button"
                [class.active]="sortBy() === 'name'"
                (click)="sortBy.set('name')"
              >
                Name
              </button>
              <button
                class="sort-button"
                [class.active]="sortBy() === 'client'"
                (click)="sortBy.set('client')"
              >
                Client
              </button>
              <button
                class="sort-button"
                [class.active]="sortBy() === 'role'"
                (click)="sortBy.set('role')"
              >
                Role
              </button>
            </div>
          </div>
        </div>

        @if (filteredContacts().length === 0 && searchQuery().trim()) {
          <div class="no-results-state">
            <svg class="no-results-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3>No contacts found</h3>
            <p>No contacts match your search criteria "{{ searchQuery() }}".</p>
            <p>Try adjusting your search or clearing the filter.</p>
            <button class="clear-search-btn" (click)="clearSearch()">
              Clear Search
            </button>
          </div>
        }

        @if (filteredContacts().length > 0) {
          <div class="contact-count">
            Showing {{ filteredContacts().length }} {{ filteredContacts().length === 1 ? 'contact' : 'contacts' }}
          </div>

          <div class="contacts-grid">
            @for (contact of filteredContacts(); track contact.contactId) {
              <a
                [routerLink]="['/clients', contact.clientId, 'contacts', contact.contactId]"
                class="contact-card"
              >
                <div class="contact-header">
                  <h3 class="contact-name">{{ contact.name }}</h3>
                  @if (contact.role) {
                    <p class="contact-role">{{ contact.role }}</p>
                  }
                </div>

                <div class="contact-details">
                  @if (contact.email) {
                    <div class="contact-detail">
                      <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span class="contact-link">{{ contact.email }}</span>
                    </div>
                  }

                  @if (contact.phone) {
                    <div class="contact-detail">
                      <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span class="contact-link">{{ contact.phone }}</span>
                    </div>
                  }
                </div>

                <div class="client-badge">
                  <svg class="client-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>{{ contact.clientName }}</span>
                </div>
              </a>
            }
          </div>
        }
      }
    </div>
  `
})
export class AllContactsComponent implements OnInit {
  private clientsService = inject(ClientsService);

  // Component state using signals
  contacts = signal<ContactWithClient[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  searchQuery = signal<string>('');
  sortBy = signal<'name' | 'client' | 'role'>('name');

  // Computed filtered and sorted contacts
  filteredContacts = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const allContacts = this.contacts();
    const sortField = this.sortBy();

    // Filter first
    let filtered = allContacts;
    if (query) {
      filtered = allContacts.filter(contact => {
        const matchesName = contact.name.toLowerCase().includes(query);
        const matchesRole = contact.role?.toLowerCase().includes(query) ?? false;
        const matchesEmail = contact.email?.toLowerCase().includes(query) ?? false;
        const matchesClientName = contact.clientName.toLowerCase().includes(query);

        return matchesName || matchesRole || matchesEmail || matchesClientName;
      });
    }

    // Then sort
    return [...filtered].sort((a, b) => {
      if (sortField === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortField === 'client') {
        return a.clientName.localeCompare(b.clientName);
      } else { // role
        const roleA = a.role ?? '';
        const roleB = b.role ?? '';
        return roleA.localeCompare(roleB);
      }
    });
  });

  ngOnInit(): void {
    this.loadContacts();
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  private loadContacts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.clientsService.getAllContacts().subscribe({
      next: (contacts) => {
        this.contacts.set(contacts);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load contacts. Please try again later.');
        this.loading.set(false);
        console.error('Error loading contacts:', err);
      }
    });
  }
}
