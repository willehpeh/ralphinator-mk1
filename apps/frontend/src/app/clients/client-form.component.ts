import { Component, ChangeDetectionStrategy, inject, signal, input, output, OnInit, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Subject, takeUntil } from 'rxjs';
import { ClientsService, CreateClientDto } from './clients.service';
import { updateClient, updateClientSuccess, updateClientFailure } from './store/clients.actions';
import { selectClientsError } from './store/clients.selectors';
import { ClientStatus, Client } from './client.types';
import { CLIENT_STATUSES } from './client.constants';

const SUCCESS_MESSAGE_DISMISS_DURATION_MS = 3000;

interface ClientFormFields {
  companyName: FormControl<string>;
  email: FormControl<string>;
  phone: FormControl<string>;
  address: FormControl<string>;
  status: FormControl<ClientStatus>;
  notes: FormControl<string>;
}

@Component({
  selector: 'app-client-form',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./clients-common.scss', './client-form.component.scss'],
  template: `
    <div class="client-form">
      <h2>{{ mode() === 'create' ? 'Add New Client' : 'Edit Client' }}</h2>

      @if (submitSuccess()) {
        <div class="success-message">
          {{ mode() === 'create' ? 'Client created successfully!' : 'Client updated successfully!' }}
        </div>
      }

      @if (submitError()) {
        <div class="error-message">
          {{ submitError() }}
        </div>
      }

      @if (storeError(); as errorMessage) {
        <div class="error-message">
          {{ errorMessage }}
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
            @for (status of availableStatuses; track status) {
              <option [value]="status">{{ status }}</option>
            }
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
              {{ mode() === 'create' ? 'Submitting...' : 'Updating...' }}
            } @else {
              {{ mode() === 'create' ? 'Add Client' : 'Update Client' }}
            }
          </button>
          <button type="button" (click)="onCancel()" [disabled]="submitting()">
            Cancel
          </button>
        </div>
      </form>
    </div>
  `
})
export class ClientFormComponent implements OnInit, OnDestroy {
  private clientsService = inject(ClientsService);
  private store = inject(Store);
  private actions$ = inject(Actions);
  private destroy$ = new Subject<void>();

  // Inputs
  mode = input.required<'create' | 'edit'>();
  client = input<Client>();

  // Outputs
  formCancelled = output<void>();
  formSucceeded = output<void>();

  // Available status options
  readonly availableStatuses = CLIENT_STATUSES;

  // Select error from store (for edit mode)
  storeError = this.store.selectSignal(selectClientsError);

  form = new FormGroup<ClientFormFields>({
    companyName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    phone: new FormControl('', { nonNullable: true }),
    address: new FormControl('', { nonNullable: true }),
    status: new FormControl<ClientStatus>('Active', { nonNullable: true, validators: [Validators.required] }),
    notes: new FormControl('', { nonNullable: true })
  });

  submitting = signal(false);
  submitSuccess = signal(false);
  submitError = signal<string | null>(null);

  constructor() {
    // Watch for client changes in edit mode and populate form
    effect(() => {
      const currentMode = this.mode();
      const clientData = this.client();

      if (currentMode === 'edit' && clientData) {
        this.populateFormWithClientData(clientData);
      }
    });

    // Listen for successful update actions in edit mode
    this.actions$.pipe(
      ofType(updateClientSuccess),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.submitting.set(false);
      this.formSucceeded.emit();
    });

    // Listen for failed update actions in edit mode
    this.actions$.pipe(
      ofType(updateClientFailure),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.submitting.set(false);
    });
  }

  ngOnInit(): void {
    // Initial form population for edit mode
    const clientData = this.client();
    if (this.mode() === 'edit' && clientData) {
      this.populateFormWithClientData(clientData);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.form.valid && !this.submitting()) {
      this.submitting.set(true);
      this.submitError.set(null);

      const formValue = this.form.getRawValue();

      if (this.mode() === 'create') {
        this.handleCreate(formValue);
      } else {
        this.handleUpdate(formValue);
      }
    }
  }

  private populateFormWithClientData(clientData: Client): void {
    this.form.patchValue({
      companyName: clientData.companyName,
      email: clientData.email,
      phone: clientData.phone ?? '',
      address: clientData.address ?? '',
      status: clientData.status,
      notes: clientData.notes ?? ''
    });
  }

  private handleCreate(formValue: ReturnType<typeof this.form.getRawValue>): void {
    const dto: CreateClientDto = {
      companyName: formValue.companyName,
      email: formValue.email,
      phone: formValue.phone || undefined,
      address: formValue.address || undefined,
      status: formValue.status,
      notes: formValue.notes || undefined
    };

    this.clientsService.createClient(dto).subscribe({
      next: () => {
        this.submitSuccess.set(true);
        this.submitting.set(false);
        this.form.reset({ status: 'Active' });
        setTimeout(() => {
          this.submitSuccess.set(false);
          this.formSucceeded.emit();
        }, SUCCESS_MESSAGE_DISMISS_DURATION_MS);
      },
      error: (error) => {
        this.submitError.set(error.message || 'Failed to create client');
        this.submitting.set(false);
      }
    });
  }

  private handleUpdate(formValue: ReturnType<typeof this.form.getRawValue>): void {
    const clientData = this.client();
    if (!clientData) {
      this.submitError.set('Client data not found');
      this.submitting.set(false);
      return;
    }

    // Dispatch update action - success/failure will be handled by the Actions stream listeners
    this.store.dispatch(updateClient({
      id: clientData.id,
      companyName: formValue.companyName,
      email: formValue.email,
      phone: formValue.phone || null,
      address: formValue.address || null,
      status: formValue.status,
      notes: formValue.notes || null
    }));
  }

  onCancel(): void {
    if (this.mode() === 'create') {
      this.form.reset({ status: 'Active' });
      this.submitSuccess.set(false);
      this.submitError.set(null);
    } else {
      // Reset form to original client data in edit mode
      const clientData = this.client();
      if (clientData) {
        this.populateFormWithClientData(clientData);
      }
    }

    this.formCancelled.emit();
  }
}
