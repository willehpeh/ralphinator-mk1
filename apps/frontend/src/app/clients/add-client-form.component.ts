import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientsService } from './clients.service';

interface AddClientForm {
  companyName: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
  address: FormControl<string>;
  status: FormControl<'Active' | 'Inactive' | 'Prospect' | 'Past Client'>;
  notes: FormControl<string>;
}

@Component({
  selector: 'app-add-client-form',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="add-client-form">
      <h2>Add New Client</h2>

      @if (submitSuccess()) {
        <div class="success-message">
          Client created successfully!
        </div>
      }

      @if (submitError()) {
        <div class="error-message">
          {{ submitError() }}
        </div>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="companyName">Company Name *</label>
          <input
            id="companyName"
            type="text"
            formControlName="companyName"
            placeholder="Enter company name"
          />
        </div>

        <div class="form-group">
          <label for="email">Email *</label>
          <input
            id="email"
            type="email"
            formControlName="email"
            placeholder="contact@example.com"
          />
        </div>

        <div class="form-group">
          <label for="phone">Phone</label>
          <input
            id="phone"
            type="tel"
            formControlName="phone"
            placeholder="+1-555-0123"
          />
        </div>

        <div class="form-group">
          <label for="address">Address</label>
          <textarea
            id="address"
            formControlName="address"
            placeholder="123 Main St, City, State ZIP"
            rows="3"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="status">Status *</label>
          <select id="status" formControlName="status">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Prospect">Prospect</option>
            <option value="Past Client">Past Client</option>
          </select>
        </div>

        <div class="form-group">
          <label for="notes">Notes</label>
          <textarea
            id="notes"
            formControlName="notes"
            placeholder="Additional notes about the client"
            rows="4"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="form.invalid || submitting()">
            @if (submitting()) {
              Submitting...
            } @else {
              Add Client
            }
          </button>
          <button type="button" (click)="onCancel()" [disabled]="submitting()">
            Cancel
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .add-client-form {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
    }

    h2 {
      margin-bottom: 1.5rem;
      color: #333;
    }

    .success-message {
      padding: 1rem;
      margin-bottom: 1.5rem;
      background-color: #d4edda;
      border: 1px solid #c3e6cb;
      border-radius: 4px;
      color: #155724;
      font-weight: 500;
    }

    .error-message {
      padding: 1rem;
      margin-bottom: 1.5rem;
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      color: #721c24;
      font-weight: 500;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #555;
    }

    input,
    textarea,
    select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    input:focus,
    textarea:focus,
    select:focus {
      outline: none;
      border-color: #007bff;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    button[type="submit"] {
      background-color: #007bff;
      color: white;
    }

    button[type="submit"]:hover:not(:disabled) {
      background-color: #0056b3;
    }

    button[type="submit"]:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    button[type="button"] {
      background-color: #6c757d;
      color: white;
    }

    button[type="button"]:hover:not(:disabled) {
      background-color: #545b62;
    }

    button[type="button"]:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  `]
})
export class AddClientFormComponent {
  private clientsService = inject(ClientsService);

  form = new FormGroup<AddClientForm>({
    companyName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    phone: new FormControl('', { nonNullable: true }),
    address: new FormControl('', { nonNullable: true }),
    status: new FormControl<'Active' | 'Inactive' | 'Prospect' | 'Past Client'>('Active', { nonNullable: true, validators: [Validators.required] }),
    notes: new FormControl('', { nonNullable: true })
  });

  submitting = signal(false);
  submitSuccess = signal(false);
  submitError = signal<string | null>(null);

  onSubmit(): void {
    if (this.form.valid && !this.submitting()) {
      this.submitting.set(true);
      this.submitError.set(null);

      const formValue = this.form.getRawValue();
      const dto = {
        companyName: formValue.companyName,
        email: formValue.email,
        phone: formValue.phone || null,
        address: formValue.address || null,
        status: formValue.status,
        notes: formValue.notes || null
      };

      this.clientsService.createClient(dto).subscribe({
        next: (response) => {
          console.log('Client created successfully:', response);
          this.submitSuccess.set(true);
          this.submitting.set(false);
          this.form.reset({ status: 'Active' });
          setTimeout(() => this.submitSuccess.set(false), 3000);
        },
        error: (error) => {
          console.error('Error creating client:', error);
          this.submitError.set(error.message || 'Failed to create client');
          this.submitting.set(false);
        }
      });
    }
  }

  onCancel(): void {
    this.form.reset({ status: 'Active' });
    this.submitSuccess.set(false);
    this.submitError.set(null);
  }
}
