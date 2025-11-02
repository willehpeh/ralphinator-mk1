import { Component, ChangeDetectionStrategy, inject, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { changeClientStatus } from './store/clients.actions';
import { selectClientById, selectClientsError } from './store/clients.selectors';
import { ClientStatus } from './client.types';
import { CLIENT_STATUSES } from './client.constants';

interface StatusForm {
  status: FormControl<ClientStatus>;
}

@Component({
  selector: 'app-change-status-form',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./clients-common.scss', './change-status-form.component.scss'],
  template: `
    <div class="card">
      <div class="card-header">
        <h3>Change Client Status</h3>
      </div>
      <p class="form-description">
        Select a new status for this client. The change will be saved immediately.
      </p>

      @if (storeError(); as errorMessage) {
        <div class="error-message">
          {{ errorMessage }}
        </div>
      }

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
              class="btn btn-cancel"
              (click)="onCancel()"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="form.invalid || !form.dirty"
            >
              Save Status
            </button>
          </div>
        </form>
      }
    </div>
  `
})
export class ChangeStatusFormComponent {
  private store = inject(Store);

  // Inputs
  clientId = input.required<string>();

  // Outputs
  statusChanged = output<void>();
  changeCancelled = output<void>();

  // Available status options
  readonly availableStatuses = CLIENT_STATUSES;

  // Select error from store
  storeError = this.store.selectSignal(selectClientsError);

  // Get client from store
  client = computed(() => {
    const id = this.clientId();
    return this.store.selectSignal(selectClientById(id))();
  });

  // Form
  form = new FormGroup<StatusForm>({
    status: new FormControl<ClientStatus>('Active', {
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
