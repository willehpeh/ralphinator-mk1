import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
          <button type="submit" [disabled]="form.invalid">
            Add Client
          </button>
          <button type="button" (click)="onCancel()">
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

    button[type="button"]:hover {
      background-color: #545b62;
    }
  `]
})
export class AddClientFormComponent {
  form = new FormGroup<AddClientForm>({
    companyName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    phone: new FormControl('', { nonNullable: true }),
    address: new FormControl('', { nonNullable: true }),
    status: new FormControl<'Active' | 'Inactive' | 'Prospect' | 'Past Client'>('Active', { nonNullable: true, validators: [Validators.required] }),
    notes: new FormControl('', { nonNullable: true })
  });

  onSubmit(): void {
    if (this.form.valid) {
      // TODO: Implement submit logic in next task
      console.log('Form submitted:', this.form.value);
    }
  }

  onCancel(): void {
    // TODO: Implement cancel logic in next task
    this.form.reset({ status: 'Active' });
  }
}
