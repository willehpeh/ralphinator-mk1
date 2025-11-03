import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

interface ContactEditForm {
  name: FormControl<string>;
  role: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
}

@Component({
  selector: 'app-contact-detail',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
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

    .edit-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
    }

    .form-label.required::after {
      content: ' *';
      color: #dc2626;
    }

    .form-input {
      padding: 0.625rem 0.875rem;
      font-size: 1rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }

    .form-input:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .form-input:disabled {
      background-color: #f9fafb;
      cursor: not-allowed;
    }

    .form-input.error {
      border-color: #dc2626;
    }

    .form-input.error:focus {
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }

    .form-help-text {
      font-size: 0.875rem;
      color: #6b7280;
      margin-top: 0.25rem;
    }

    .form-error {
      font-size: 0.875rem;
      color: #dc2626;
      margin-top: 0.25rem;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .btn {
      padding: 0.625rem 1.25rem;
      font-size: 1rem;
      font-weight: 500;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      transition: all 0.15s ease-in-out;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-primary {
      background-color: #2563eb;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #1d4ed8;
    }

    .btn-primary:disabled {
      background-color: #93c5fd;
      cursor: not-allowed;
      opacity: 0.6;
    }

    .btn-secondary {
      background-color: white;
      color: #374151;
      border: 1px solid #d1d5db;
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: #f9fafb;
      border-color: #9ca3af;
    }

    .btn-secondary:disabled {
      background-color: #f9fafb;
      cursor: not-allowed;
      opacity: 0.6;
    }

    .header-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 1rem;
    }

    .success-message {
      background-color: #d1fae5;
      border: 1px solid #6ee7b7;
      border-radius: 6px;
      padding: 1rem;
      margin-bottom: 1.5rem;
      color: #065f46;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .success-icon {
      font-weight: bold;
      font-size: 1rem;
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
        @if (!loading() && !error() && contact() && !isEditMode()) {
          <div class="header-actions">
            <button class="btn btn-primary" (click)="enterEditMode()">
              Edit Contact
            </button>
          </div>
        }
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
        @if (successMessage(); as message) {
          <div class="success-message">
            <span class="success-icon">✓</span>
            <span>{{ message }}</span>
          </div>
        }
        <div class="detail-card">
          @if (isEditMode()) {
            <!-- Edit Mode: Form -->
            <form [formGroup]="editForm" class="edit-form">
              <div class="form-group">
                <label class="form-label required" for="name">Name</label>
                <input
                  id="name"
                  type="text"
                  formControlName="name"
                  class="form-input"
                  [class.error]="editForm.controls.name.invalid && editForm.controls.name.touched"
                  placeholder="Enter contact name"
                />
                @if (editForm.controls.name.invalid && editForm.controls.name.touched) {
                  <span class="form-error">Name is required</span>
                }
              </div>

              <div class="form-group">
                <label class="form-label" for="role">Role</label>
                <input
                  id="role"
                  type="text"
                  formControlName="role"
                  class="form-input"
                  placeholder="Enter role (e.g., CTO, Product Manager)"
                />
                <span class="form-help-text">Optional - Contact's position or role</span>
              </div>

              <div class="form-group">
                <label class="form-label" for="email">Email</label>
                <input
                  id="email"
                  type="email"
                  formControlName="email"
                  class="form-input"
                  [class.error]="editForm.controls.email.invalid && editForm.controls.email.touched"
                  placeholder="contact@example.com"
                />
                @if (editForm.controls.email.invalid && editForm.controls.email.touched) {
                  <span class="form-error">Please enter a valid email address</span>
                }
                <span class="form-help-text">Optional - Contact's email address</span>
              </div>

              <div class="form-group">
                <label class="form-label" for="phone">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  formControlName="phone"
                  class="form-input"
                  placeholder="+1 (555) 123-4567"
                />
                <span class="form-help-text">Optional - Contact's phone number</span>
              </div>

              <div class="action-buttons">
                <button
                  type="button"
                  class="btn btn-primary"
                  [disabled]="editForm.invalid || saving()"
                  (click)="saveContact()"
                >
                  @if (saving()) {
                    Saving...
                  } @else {
                    Save Changes
                  }
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  [disabled]="saving()"
                  (click)="cancelEdit()"
                >
                  Cancel
                </button>
              </div>
            </form>
          } @else {
            <!-- View Mode: Read-only display -->
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
          }
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
      map(params => params.get('contactId'))
    ),
    { initialValue: null }
  );

  // Contact data state
  contact = signal<ContactDetail | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  // Edit mode state
  isEditMode = signal(false);
  saving = signal(false);
  successMessage = signal<string | null>(null);

  // Edit form
  editForm = new FormGroup<ContactEditForm>({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    role: new FormControl('', { nonNullable: true }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.email]
    }),
    phone: new FormControl('', { nonNullable: true })
  });

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

  enterEditMode(): void {
    const contact = this.contact();
    if (contact) {
      // Populate form with current contact data
      this.editForm.patchValue({
        name: contact.name,
        role: contact.role || '',
        email: contact.email || '',
        phone: contact.phone || ''
      });
    }
    this.isEditMode.set(true);
  }

  cancelEdit(): void {
    this.isEditMode.set(false);
    // Reset form to original values
    this.editForm.reset();
  }

  saveContact(): void {
    if (this.editForm.invalid || this.saving()) {
      return;
    }

    const contactId = this.contactId();
    if (!contactId) {
      return;
    }

    const formValue = this.editForm.value;
    const updateData = {
      name: formValue.name!,
      role: formValue.role || null,
      email: formValue.email || null,
      phone: formValue.phone || null
    };

    this.saving.set(true);

    this.http.put<ContactDetail>(`/api/contacts/${contactId}`, updateData).subscribe({
      next: (updatedContact) => {
        this.contact.set(updatedContact);
        this.isEditMode.set(false);
        this.editForm.reset();
        this.saving.set(false);

        // Show success message
        this.successMessage.set('Contact updated successfully!');

        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          this.successMessage.set(null);
        }, 3000);
      },
      error: (err) => {
        console.error('Failed to update contact:', err);
        this.error.set('Failed to update contact. Please try again.');
        this.saving.set(false);
      }
    });
  }
}
