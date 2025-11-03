import { Component, ChangeDetectionStrategy, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface ContactForm {
  name: FormControl<string>;
  role: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
}

interface AddContactDto {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
}

interface AddContactResponse {
  contactId: string;
  clientId: string;
}

@Component({
  selector: 'app-contact-form',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./clients-common.scss'],
  template: `
    <div class="form-container">
      <h3>Add Contact Person</h3>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="form-field">
          <label for="name">Name *</label>
          <input
            id="name"
            type="text"
            formControlName="name"
            [class.invalid]="form.controls.name.invalid && form.controls.name.touched"
            placeholder="Enter contact name"
          />
          @if (form.controls.name.invalid && form.controls.name.touched) {
            <div class="validation-error">
              @if (form.controls.name.errors?.['required']) {
                <span>Contact name is required</span>
              }
            </div>
          }
        </div>

        <div class="form-field">
          <label for="role">Role / Title</label>
          <input
            id="role"
            type="text"
            formControlName="role"
            placeholder="e.g., CEO, Project Manager"
          />
        </div>

        <div class="form-field">
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            formControlName="email"
            [class.invalid]="form.controls.email.invalid && form.controls.email.touched"
            placeholder="contact@company.com"
          />
          @if (form.controls.email.invalid && form.controls.email.touched) {
            <div class="validation-error">
              @if (form.controls.email.errors?.['email']) {
                <span>Please enter a valid email address</span>
              }
            </div>
          }
        </div>

        <div class="form-field">
          <label for="phone">Phone</label>
          <input
            id="phone"
            type="tel"
            formControlName="phone"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        @if (error()) {
          <div class="error-message">
            {{ error() }}
          </div>
        }

        <div class="form-actions">
          <button
            type="submit"
            class="submit-button"
            [disabled]="form.invalid || isSubmitting()"
          >
            @if (isSubmitting()) {
              Adding Contact...
            } @else {
              Add Contact
            }
          </button>
          <button
            type="button"
            class="cancel-button"
            (click)="onCancel()"
            [disabled]="isSubmitting()"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  `
})
export class ContactFormComponent {
  private http = inject(HttpClient);

  // Input: clientId is required to associate the contact with a client
  clientId = input.required<string>();

  // Output events
  contactAdded = output<void>();
  formCancelled = output<void>();

  // Form state
  isSubmitting = signal(false);
  error = signal<string | null>(null);

  // Reactive form with typed controls
  form = new FormGroup<ContactForm>({
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

  onSubmit(): void {
    if (this.form.invalid) {
      // Mark all fields as touched to show validation errors
      Object.values(this.form.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    this.isSubmitting.set(true);
    this.error.set(null);

    const formValue = this.form.getRawValue();
    const payload: AddContactDto = {
      name: formValue.name,
      // Only include optional fields if they have values
      ...(formValue.role && { role: formValue.role }),
      ...(formValue.email && { email: formValue.email }),
      ...(formValue.phone && { phone: formValue.phone })
    };

    this.http.post<AddContactResponse>(
      `/api/clients/${this.clientId()}/contacts`,
      payload
    ).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.form.reset();
        this.contactAdded.emit();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.error.set(
          err.error?.message || 'Failed to add contact. Please try again.'
        );
      }
    });
  }

  onCancel(): void {
    this.form.reset();
    this.formCancelled.emit();
  }
}
