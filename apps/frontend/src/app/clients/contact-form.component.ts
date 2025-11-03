import { Component, ChangeDetectionStrategy, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ClientsService } from './clients.service';
import { FormState } from '../shared/form-state';
import { createContactFormGroup } from './contact-form-builder';
import { CONTACT_FORM_LABELS, CLIENT_ERROR_MESSAGES } from './client-display.constants';
import { ValidationErrorComponent } from '../shared/validation-error.component';

interface AddContactDto {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
}

@Component({
  selector: 'app-contact-form',
  imports: [CommonModule, ReactiveFormsModule, ValidationErrorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./clients-common.scss'],
  template: `
    <div class="form-container">
      <h3>{{ labels.ADD_CONTACT_TITLE }}</h3>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="form-field">
          <label for="name">{{ labels.NAME }}</label>
          <input
            id="name"
            type="text"
            formControlName="name"
            [class.invalid]="form.controls.name.invalid && form.controls.name.touched"
            [placeholder]="labels.NAME_PLACEHOLDER"
          />
          <app-validation-error
            [control]="form.controls.name"
            [requiredMessage]="labels.NAME_REQUIRED" />
        </div>

        <div class="form-field">
          <label for="role">{{ labels.ROLE }}</label>
          <input
            id="role"
            type="text"
            formControlName="role"
            [placeholder]="labels.ROLE_PLACEHOLDER"
          />
        </div>

        <div class="form-field">
          <label for="email">{{ labels.EMAIL }}</label>
          <input
            id="email"
            type="email"
            formControlName="email"
            [class.invalid]="form.controls.email.invalid && form.controls.email.touched"
            [placeholder]="labels.EMAIL_PLACEHOLDER"
          />
          <app-validation-error
            [control]="form.controls.email"
            [emailMessage]="labels.INVALID_EMAIL" />
        </div>

        <div class="form-field">
          <label for="phone">{{ labels.PHONE }}</label>
          <input
            id="phone"
            type="tel"
            formControlName="phone"
            [placeholder]="labels.PHONE_PLACEHOLDER"
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
              {{ labels.ADDING_CONTACT_BUTTON }}
            } @else {
              {{ labels.ADD_CONTACT_BUTTON }}
            }
          </button>
          <button
            type="button"
            class="cancel-button"
            (click)="onCancel()"
            [disabled]="formState.isSubmitting()"
          >
            {{ labels.CANCEL_BUTTON }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class ContactFormComponent {
  private clientsService = inject(ClientsService);

  // Constants for labels and messages
  protected readonly labels = CONTACT_FORM_LABELS;

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
          err.error?.message || CLIENT_ERROR_MESSAGES.ADD_CONTACT_FAILED
        );
      }
    });
  }

  onCancel(): void {
    this.form.reset();
    this.formCancelled.emit();
  }
}
