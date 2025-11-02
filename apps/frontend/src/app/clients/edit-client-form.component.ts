import { Component, ChangeDetectionStrategy, inject, signal, input, output, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { updateClient } from './store/clients.actions';
import { selectClientById, selectClientsLoading, selectClientsError } from './store/clients.selectors';
import { ClientStatus } from '@angular-nest-starter/domain';

interface EditClientForm {
  companyName: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
  address: FormControl<string>;
  status: FormControl<ClientStatus>;
  notes: FormControl<string>;
}

@Component({
  selector: 'app-edit-client-form',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="edit-client-form">
      <h2>Edit Client</h2>

      @if (error(); as errorMessage) {
        <div class="error-message">
          {{ errorMessage }}
        </div>
      }

      @if (loading()) {
        <div class="loading-message">
          Loading client data...
        </div>
      }

      @if (!loading() && client()) {
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
                Updating...
              } @else {
                Update Client
              }
            </button>
            <button type="button" (click)="onCancel()" [disabled]="submitting()">
              Cancel
            </button>
          </div>
        </form>
      }
    </div>
  `,
  styles: [`
    .edit-client-form {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
    }

    h2 {
      margin-bottom: 1.5rem;
      color: #333;
    }

    .loading-message {
      padding: 1rem;
      text-align: center;
      color: #666;
      font-size: 1.1rem;
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
export class EditClientFormComponent implements OnInit {
  private store = inject(Store);

  // Input: client ID to edit
  clientId = input.required<string>();

  // Output events for parent component
  editCancelled = output<void>();
  editSucceeded = output<void>();

  // Select data from store using signals
  client = computed(() => {
    const id = this.clientId();
    return this.store.selectSignal(selectClientById(id))();
  });
  loading = this.store.selectSignal(selectClientsLoading);
  error = this.store.selectSignal(selectClientsError);

  form = new FormGroup<EditClientForm>({
    companyName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    phone: new FormControl('', { nonNullable: true }),
    address: new FormControl('', { nonNullable: true }),
    status: new FormControl<ClientStatus>('Active', { nonNullable: true, validators: [Validators.required] }),
    notes: new FormControl('', { nonNullable: true })
  });

  submitting = signal(false);

  ngOnInit(): void {
    // Populate form with existing client data when it loads
    const clientData = this.client();
    if (clientData) {
      this.form.patchValue({
        companyName: clientData.companyName,
        email: clientData.email,
        phone: clientData.phone || '',
        address: clientData.address || '',
        status: clientData.status,
        notes: clientData.notes || ''
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid && !this.submitting()) {
      this.submitting.set(true);

      const formValue = this.form.getRawValue();

      this.store.dispatch(updateClient({
        id: this.clientId(),
        companyName: formValue.companyName,
        email: formValue.email,
        phone: formValue.phone || null,
        address: formValue.address || null,
        status: formValue.status,
        notes: formValue.notes || null
      }));

      // Emit success event after a brief delay to allow the store to update
      setTimeout(() => {
        this.submitting.set(false);
        this.editSucceeded.emit();
      }, 1000);
    }
  }

  onCancel(): void {
    // Reset form to original client data
    const clientData = this.client();
    if (clientData) {
      this.form.patchValue({
        companyName: clientData.companyName,
        email: clientData.email,
        phone: clientData.phone || '',
        address: clientData.address || '',
        status: clientData.status,
        notes: clientData.notes || ''
      });
    }

    // Emit cancel event to parent
    this.editCancelled.emit();
  }
}
