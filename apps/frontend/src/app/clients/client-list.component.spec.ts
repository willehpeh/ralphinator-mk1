import { describe, it, expect, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ClientListComponent } from './client-list.component';
import { loadClients } from './store/clients.actions';
import {
  selectAllClients,
  selectClientsLoading,
  selectClientsError,
  selectHasClients,
} from './store/clients.selectors';
import { Client } from './store/clients.actions';

describe('ClientListComponent', () => {
  const mockClients: Client[] = [
    {
      id: '1',
      companyName: 'Acme Corp',
      email: 'contact@acme.com',
      phone: '555-0100',
      address: '123 Main St',
      status: 'ACTIVE',
      notes: 'Primary client',
      createdAt: '2025-01-01T00:00:00Z',
    },
    {
      id: '2',
      companyName: 'Tech Solutions',
      email: 'info@techsolutions.com',
      phone: null,
      address: null,
      status: 'PENDING',
      notes: null,
      createdAt: '2025-01-02T00:00:00Z',
    },
  ];

  describe('Loading State', () => {
    it('should display loading message when loading is true', () => {
      TestBed.configureTestingModule({
        imports: [ClientListComponent],
        providers: [
          provideMockStore({
            selectors: [
              { selector: selectAllClients, value: [] },
              { selector: selectClientsLoading, value: true },
              { selector: selectClientsError, value: null },
              { selector: selectHasClients, value: false },
            ],
          }),
        ],
      });

      const fixture = TestBed.createComponent(ClientListComponent);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Loading clients...');
    });
  });

  describe('Error State', () => {
    it('should display error message when error exists', () => {
      const errorMessage = 'Failed to load clients';

      TestBed.configureTestingModule({
        imports: [ClientListComponent],
        providers: [
          provideMockStore({
            selectors: [
              { selector: selectAllClients, value: [] },
              { selector: selectClientsLoading, value: false },
              { selector: selectClientsError, value: errorMessage },
              { selector: selectHasClients, value: false },
            ],
          }),
        ],
      });

      const fixture = TestBed.createComponent(ClientListComponent);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain(errorMessage);
    });
  });

  describe('Empty State', () => {
    it('should display empty state message when no clients exist', () => {
      TestBed.configureTestingModule({
        imports: [ClientListComponent],
        providers: [
          provideMockStore({
            selectors: [
              { selector: selectAllClients, value: [] },
              { selector: selectClientsLoading, value: false },
              { selector: selectClientsError, value: null },
              { selector: selectHasClients, value: false },
            ],
          }),
        ],
      });

      const fixture = TestBed.createComponent(ClientListComponent);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('No clients found');
      expect(compiled.textContent).toContain('Add your first client to get started');
    });
  });

  describe('Client List Display', () => {
    it('should display list of clients when clients exist', () => {
      TestBed.configureTestingModule({
        imports: [ClientListComponent],
        providers: [
          provideMockStore({
            selectors: [
              { selector: selectAllClients, value: mockClients },
              { selector: selectClientsLoading, value: false },
              { selector: selectClientsError, value: null },
              { selector: selectHasClients, value: true },
            ],
          }),
        ],
      });

      const fixture = TestBed.createComponent(ClientListComponent);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;

      // Check that both client names are displayed
      expect(compiled.textContent).toContain('Acme Corp');
      expect(compiled.textContent).toContain('Tech Solutions');

      // Check that emails are displayed
      expect(compiled.textContent).toContain('contact@acme.com');
      expect(compiled.textContent).toContain('info@techsolutions.com');

      // Check that statuses are displayed
      expect(compiled.textContent).toContain('ACTIVE');
      expect(compiled.textContent).toContain('PENDING');
    });

    it('should display optional fields when present', () => {
      TestBed.configureTestingModule({
        imports: [ClientListComponent],
        providers: [
          provideMockStore({
            selectors: [
              { selector: selectAllClients, value: [mockClients[0]] },
              { selector: selectClientsLoading, value: false },
              { selector: selectClientsError, value: null },
              { selector: selectHasClients, value: true },
            ],
          }),
        ],
      });

      const fixture = TestBed.createComponent(ClientListComponent);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;

      // Check that optional fields are displayed for first client
      expect(compiled.textContent).toContain('555-0100');
      expect(compiled.textContent).toContain('123 Main St');
      expect(compiled.textContent).toContain('Primary client');
    });

    it('should not display optional fields when absent', () => {
      TestBed.configureTestingModule({
        imports: [ClientListComponent],
        providers: [
          provideMockStore({
            selectors: [
              { selector: selectAllClients, value: [mockClients[1]] },
              { selector: selectClientsLoading, value: false },
              { selector: selectClientsError, value: null },
              { selector: selectHasClients, value: true },
            ],
          }),
        ],
      });

      const fixture = TestBed.createComponent(ClientListComponent);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;

      // Verify optional fields are not displayed when null
      expect(compiled.textContent).not.toContain('Phone:');
      expect(compiled.textContent).not.toContain('Address:');
      expect(compiled.textContent).not.toContain('Notes:');
    });
  });

  describe('Component Initialization', () => {
    it('should dispatch loadClients action on initialization', () => {
      TestBed.configureTestingModule({
        imports: [ClientListComponent],
        providers: [
          provideMockStore({
            selectors: [
              { selector: selectAllClients, value: [] },
              { selector: selectClientsLoading, value: false },
              { selector: selectClientsError, value: null },
              { selector: selectHasClients, value: false },
            ],
          }),
        ],
      });

      const fixture = TestBed.createComponent(ClientListComponent);
      const store = TestBed.inject(MockStore);
      const dispatchSpy = vi.spyOn(store, 'dispatch');

      // Trigger ngOnInit by detecting changes
      fixture.detectChanges();

      expect(dispatchSpy).toHaveBeenCalledWith(loadClients());
    });
  });

  describe('Status Badge Styling', () => {
    it('should apply correct CSS class for ACTIVE status', () => {
      const activeClient: Client = { ...mockClients[0], status: 'ACTIVE' };

      TestBed.configureTestingModule({
        imports: [ClientListComponent],
        providers: [
          provideMockStore({
            selectors: [
              { selector: selectAllClients, value: [activeClient] },
              { selector: selectClientsLoading, value: false },
              { selector: selectClientsError, value: null },
              { selector: selectHasClients, value: true },
            ],
          }),
        ],
      });

      const fixture = TestBed.createComponent(ClientListComponent);
      fixture.detectChanges();

      const statusBadge = fixture.nativeElement.querySelector('.status-active');
      expect(statusBadge).toBeDefined();
    });

    it('should apply correct CSS class for INACTIVE status', () => {
      const inactiveClient: Client = { ...mockClients[0], status: 'INACTIVE' };

      TestBed.configureTestingModule({
        imports: [ClientListComponent],
        providers: [
          provideMockStore({
            selectors: [
              { selector: selectAllClients, value: [inactiveClient] },
              { selector: selectClientsLoading, value: false },
              { selector: selectClientsError, value: null },
              { selector: selectHasClients, value: true },
            ],
          }),
        ],
      });

      const fixture = TestBed.createComponent(ClientListComponent);
      fixture.detectChanges();

      const statusBadge = fixture.nativeElement.querySelector('.status-inactive');
      expect(statusBadge).toBeDefined();
    });

    it('should apply correct CSS class for PENDING status', () => {
      const pendingClient: Client = { ...mockClients[1], status: 'PENDING' };

      TestBed.configureTestingModule({
        imports: [ClientListComponent],
        providers: [
          provideMockStore({
            selectors: [
              { selector: selectAllClients, value: [pendingClient] },
              { selector: selectClientsLoading, value: false },
              { selector: selectClientsError, value: null },
              { selector: selectHasClients, value: true },
            ],
          }),
        ],
      });

      const fixture = TestBed.createComponent(ClientListComponent);
      fixture.detectChanges();

      const statusBadge = fixture.nativeElement.querySelector('.status-pending');
      expect(statusBadge).toBeDefined();
    });
  });
});
