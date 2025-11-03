import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Contact {
  contactId: string;
  clientId: string;
  name: string;
  role: string | null;
  email: string | null;
  phone: string | null;
}

@Component({
  selector: 'app-contact-list',
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./clients-common.scss'],
  styles: [`
    .contacts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .contact-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 1.25rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
      display: block;
      text-decoration: none;
      color: inherit;
      cursor: pointer;
    }

    .contact-card:hover {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
      border-color: #2563eb;
    }

    .contact-name {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }

    .contact-role {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0 0 1rem 0;
      font-style: italic;
    }

    .contact-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .contact-detail {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #4b5563;
    }

    .contact-icon {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    .contact-link {
      color: #2563eb;
      text-decoration: none;
    }

    .contact-link:hover {
      text-decoration: underline;
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #6b7280;
      font-size: 0.875rem;
    }
  `],
  template: `
    @if (contacts().length === 0) {
      <div class="empty-state">
        No contacts added yet. Add a contact to get started.
      </div>
    } @else {
      <div class="contacts-grid">
        @for (contact of contacts(); track contact.contactId) {
          <a
            [routerLink]="['/clients', contact.clientId, 'contacts', contact.contactId]"
            class="contact-card"
          >
            <h4 class="contact-name">{{ contact.name }}</h4>

            @if (contact.role) {
              <p class="contact-role">{{ contact.role }}</p>
            }

            <div class="contact-details">
              @if (contact.email) {
                <div class="contact-detail">
                  <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span class="contact-link">
                    {{ contact.email }}
                  </span>
                </div>
              }

              @if (contact.phone) {
                <div class="contact-detail">
                  <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span class="contact-link">
                    {{ contact.phone }}
                  </span>
                </div>
              }
            </div>
          </a>
        }
      </div>
    }
  `
})
export class ContactListComponent {
  // Input: array of contacts to display
  contacts = input.required<Contact[]>();
}
