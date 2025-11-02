import { Component, ChangeDetectionStrategy, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { changeClientStatus } from './store/clients.actions';
import { selectClientById } from './store/clients.selectors';

interface StatusForm {
  status: FormControl<string>;
}

type ClientStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

@Component({
  selector: 'app-change-status-form',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="change-status-form">
      <h3>Change Client Status</h3>
      <p class="form-description">
        Select a new status for this client. The change will be saved immediately.
      </p>

      @if (client(); as clientData) {
        <div class="current-status">
          <span class="label">Current Status:</span>
          <span class="status-badge" [class]="'status-' + clientData.status.toLowerCase()">
            {{ clientData.status }}
          </span>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="status">New Status</label>
            <select
              id="status"
              formControlName="status"
              class="form-control"
              [class.invalid]="form.controls.status.invalid && form.controls.status.touched"
            >
              <option value="" disabled>Select a status</option>
              @for (status of availableStatuses; track status) {
                <option [value]="status">{{ status }}</option>
              }
            </select>
            @if (form.controls.status.invalid && form.controls.status.touched) {
              <div class="error-message">
                Please select a status
              </div>
            }
          </div>

          <div class="form-actions">
            <button
              type="button"
              class="cancel-button"
              (click)="onCancel()"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="submit-button"
              [disabled]="form.invalid || !form.dirty"
            >
              Save Status
            </button>
          </div>
        </form>
      }
    </div>
  `,
  styles: [`
    .change-status-form {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 2rem;
    }

    h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 1.3rem;
    }

    .form-description {
      margin: 0 0 1.5rem 0;
      color: #666;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .current-status {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 4px;
    }

    .current-status .label {
      font-weight: 600;
      color: #666;
      font-size: 0.9rem;
    }

    .status-badge {
      padding: 0.4rem 0.9rem;
      border-radius: 14px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-active {
      background-color: #d4edda;
      color: #155724;
    }

    .status-inactive {
      background-color: #f8d7da;
      color: #721c24;
    }

    .status-pending {
      background-color: #fff3cd;
      color: #856404;
    }

    form {
      margin-top: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #555;
      font-size: 0.95rem;
    }

    .form-control {
      width: 100%;
      padding: 0.6rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 0.95rem;
      transition: border-color 0.2s;
      background-color: white;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
    }

    .form-control.invalid {
      border-color: #dc3545;
    }

    .error-message {
      margin-top: 0.5rem;
      color: #dc3545;
      font-size: 0.85rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #eee;
    }

    .cancel-button {
      padding: 0.6rem 1.5rem;
      background-color: #6c757d;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .cancel-button:hover {
      background-color: #5a6268;
    }

    .submit-button {
      padding: 0.6rem 1.5rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .submit-button:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .submit-button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  `]
})
export class ChangeStatusFormComponent {
  private store = inject(Store);

  // Inputs
  clientId = input.required<string>();

  // Outputs
  statusChanged = output<void>();
  changeCancelled = output<void>();

  // Available status options
  availableStatuses: ClientStatus[] = ['ACTIVE', 'INACTIVE', 'PENDING'];

  // Get client from store
  client = this.store.selectSignal(selectClientById(this.clientId()));

  // Form
  form = new FormGroup<StatusForm>({
    status: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const newStatus = this.form.value.status as ClientStatus;

    // Dispatch the change status action
    this.store.dispatch(changeClientStatus({
      id: this.clientId(),
      status: newStatus
    }));

    // Emit success event
    this.statusChanged.emit();
  }

  onCancel(): void {
    this.changeCancelled.emit();
  }
}
