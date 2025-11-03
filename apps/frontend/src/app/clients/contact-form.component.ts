import { Component, ChangeDetectionStrategy, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ClientsService } from './clients.service';
import { FormState } from '../shared/form-state';
import { createContactFormGroup } from './contact-form-builder';

interface AddContactDto {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
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

        @if (formState.error()) {
          <div class="error-message">
            {{ formState.error() }}
          </div>
        }

        <div class="form-actions">
          <button
            type="submit"
            class="submit-button"
            [disabled]="form.invalid || formState.isSubmitting()"
          >
            @if (formState.isSubmitting()) {
              Adding Contact...
            } @else {
              Add Contact
            }
          </button>
          <button
            type="button"
            class="cancel-button"
            (click)="onCancel()"
            [disabled]="formState.isSubmitting()"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  `
})
export class ContactFormComponent {
  private clientsService = inject(ClientsService);

  // Input: clientId is required to associate the contact with a client
  clientId = input.required<string>();

  // Output events
  contactAdded = output<void>();
  formCancelled = output<void>();

  // Form state
  formState = new FormState();

  // Reactive form with typed controls
  form = createContactFormGroup();

  onSubmit(): void {
    if (this.form.invalid) {
      // Mark all fields as touched to show validation errors
      Object.values(this.form.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    this.formState.setSubmitting(true);
    this.formState.clearMessages();

    const formValue = this.form.getRawValue();
    const payload: AddContactDto = {
      name: formValue.name,
      // Only include optional fields if they have values
      ...(formValue.role && { role: formValue.role }),
      ...(formValue.email && { email: formValue.email }),
      ...(formValue.phone && { phone: formValue.phone })
    };

    this.clientsService.addContactToClient(this.clientId(), payload).subscribe({
      next: () => {
        this.formState.setSubmitting(false);
        this.form.reset();
        this.contactAdded.emit();
      },
      error: (err) => {
        this.formState.setSubmitting(false);
        this.formState.setError(
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
