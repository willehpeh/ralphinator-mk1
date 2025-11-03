import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ClientNavigationService } from './client-navigation.service';
import { STANDARD_DATE_FORMAT, CLIENT_UI_TEXT } from './client-display.constants';

interface ContactDetail {
  contactId: string;
  clientId: string;
  name: string;
  role: string | null;
  email: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-contact-detail',
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./clients-common.scss'],
  styles: [`
    .contact-detail {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    .detail-header {
      margin-bottom: 2rem;
    }

    .back-button {
      background: none;
      border: none;
      color: #2563eb;
      cursor: pointer;
      font-size: 0.875rem;
      padding: 0.5rem 0;
      margin-bottom: 1rem;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .back-button:hover {
      color: #1d4ed8;
      text-decoration: underline;
    }

    .header-title-section h2 {
      font-size: 1.875rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }

    .detail-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .contact-header {
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .contact-name {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }

    .contact-role {
      font-size: 1rem;
      color: #6b7280;
      font-style: italic;
      margin: 0;
    }

    .detail-section {
      margin-bottom: 2rem;
    }

    .detail-section:last-child {
      margin-bottom: 0;
    }

    .detail-section h4 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 1rem 0;
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
      font-size: 0.875rem;
      font-weight: 500;
      color: #6b7280;
    }

    .detail-value {
      font-size: 1rem;
      color: #1f2937;
    }

    .detail-link {
      color: #2563eb;
      text-decoration: none;
    }

    .detail-link:hover {
      text-decoration: underline;
    }

    .client-link-section {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 1rem;
    }

    .client-link-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #6b7280;
      margin-bottom: 0.5rem;
    }

    .client-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #2563eb;
      text-decoration: none;
      font-size: 1rem;
    }

    .client-link:hover {
      text-decoration: underline;
    }

    .loading-message, .error-message {
      text-align: center;
      padding: 3rem 2rem;
      font-size: 1rem;
    }

    .loading-message {
      color: #6b7280;
    }

    .error-message {
      color: #dc2626;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
    }
  `],
  template: `
    <div class="contact-detail">
      <div class="detail-header">
        <button class="back-button" (click)="navigateBack()">
          ← Back to Client
        </button>
        <div class="header-title-section">
          <h2>Contact Details</h2>
        </div>
      </div>

      @if (loading()) {
        <div class="loading-message">
          Loading contact details...
        </div>
      }

      @if (error(); as errorMessage) {
        <div class="error-message">
          {{ errorMessage }}
        </div>
      }

      @if (!loading() && !error() && contact(); as contactData) {
        <div class="detail-card">
          <div class="contact-header">
            <h3 class="contact-name">{{ contactData.name }}</h3>
            @if (contactData.role) {
              <p class="contact-role">{{ contactData.role }}</p>
            }
          </div>

          <div class="detail-section">
            <h4>Contact Information</h4>
            <div class="detail-grid">
              @if (contactData.email) {
                <div class="detail-item">
                  <span class="detail-label">Email:</span>
                  <a [href]="'mailto:' + contactData.email" class="detail-value detail-link">
                    {{ contactData.email }}
                  </a>
                </div>
              }
              @if (contactData.phone) {
                <div class="detail-item">
                  <span class="detail-label">Phone:</span>
                  <a [href]="'tel:' + contactData.phone" class="detail-value detail-link">
                    {{ contactData.phone }}
                  </a>
                </div>
              }
            </div>
          </div>

          <div class="detail-section">
            <h4>Associated Client</h4>
            <div class="client-link-section">
              <div class="client-link-label">Client Company</div>
              <a [routerLink]="['/clients', contactData.clientId]" class="client-link">
                View Client Details →
              </a>
            </div>
          </div>

          <div class="detail-section">
            <h4>Metadata</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">Contact ID:</span>
                <span class="detail-value">{{ contactData.contactId }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Created:</span>
                <span class="detail-value">{{ contactData.createdAt | date:dateFormat }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Last Updated:</span>
                <span class="detail-value">{{ contactData.updatedAt | date:dateFormat }}</span>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class ContactDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private navigation = inject(ClientNavigationService);

  // Get contact ID from route params
  private contactId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id'))
    ),
    { initialValue: null }
  );

  // Contact data state
  contact = signal<ContactDetail | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  // Date format for displaying timestamps
  readonly dateFormat = STANDARD_DATE_FORMAT;

  ngOnInit(): void {
    this.loadContact();
  }

  private loadContact(): void {
    const id = this.contactId();
    if (id) {
      this.loading.set(true);
      this.error.set(null);

      this.http.get<ContactDetail>(`/api/contacts/${id}`).subscribe({
        next: (contact) => {
          this.contact.set(contact);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Failed to load contact:', err);
          this.error.set('Failed to load contact details. The contact may not exist.');
          this.loading.set(false);
        }
      });
    }
  }

  navigateBack(): void {
    const contact = this.contact();
    if (contact) {
      // Navigate back to the client detail page
      this.navigation.toClientDetail(contact.clientId);
    } else {
      // Fallback to client list
      this.navigation.toClientList();
    }
  }
}
