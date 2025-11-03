import { Component, ChangeDetectionStrategy, inject, input, output, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Subject, takeUntil } from 'rxjs';
import { CreateClientDto } from '@angular-nest-starter/shared-types';
import { ClientsService } from './clients.service';
import { updateClient, updateClientSuccess, updateClientFailure } from './store/clients.actions';
import { selectClientsError } from './store/clients.selectors';
import { ClientStatus, Client } from './client.types';
import { CLIENT_STATUSES, DEFAULT_CLIENT_STATUS } from './client.constants';
import { CLIENT_UI_TEXT, CLIENT_FORM_LABELS, SUCCESS_MESSAGE_DISMISS_DURATION_MS } from './client-display.constants';
import { FormState } from '../shared/form-state';
import { ValidationErrorComponent } from '../shared/validation-error.component';

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
  imports: [CommonModule, ReactiveFormsModule, ValidationErrorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./clients-common.scss', './client-form.component.scss'],
  template: `
    <div class="client-form">
      <h2>{{ mode() === 'create' ? uiText.ADD_CLIENT_TITLE : uiText.EDIT_CLIENT_TITLE }}</h2>

      @if (formState.successMessage()) {
        <div class="success-message">
          {{ mode() === 'create' ? uiText.CLIENT_CREATED_SUCCESS : uiText.CLIENT_UPDATED_SUCCESS }}
        </div>
      }

      @if (formState.error()) {
        <div class="error-message">
          {{ formState.error() }}
        </div>
      }

      @if (storeError(); as errorMessage) {
        <div class="error-message">
          {{ errorMessage }}
        </div>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="companyName">{{ formLabels.COMPANY_NAME }}</label>
          <input
            id="companyName"
            type="text"
            formControlName="companyName"
            [placeholder]="formLabels.COMPANY_NAME_PLACEHOLDER"
            [class.invalid]="form.controls.companyName.invalid && form.controls.companyName.touched"
          />
          <app-validation-error
            [control]="form.controls.companyName"
            [requiredMessage]="formLabels.COMPANY_NAME_REQUIRED" />
        </div>

        <div class="form-group">
          <label for="email">{{ formLabels.EMAIL }}</label>
          <input
            id="email"
            type="email"
            formControlName="email"
            [placeholder]="formLabels.EMAIL_PLACEHOLDER"
            [class.invalid]="form.controls.email.invalid && form.controls.email.touched"
          />
          <app-validation-error
            [control]="form.controls.email"
            [requiredMessage]="formLabels.EMAIL_REQUIRED"
            [emailMessage]="formLabels.INVALID_EMAIL" />
        </div>

        <div class="form-group">
          <label for="phone">{{ formLabels.PHONE }}</label>
          <input
            id="phone"
            type="tel"
            formControlName="phone"
            [placeholder]="formLabels.PHONE_PLACEHOLDER"
          />
        </div>

        <div class="form-group">
          <label for="address">{{ formLabels.ADDRESS }}</label>
          <textarea
            id="address"
            formControlName="address"
            [placeholder]="formLabels.ADDRESS_PLACEHOLDER"
            rows="3"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="status">{{ formLabels.STATUS }}</label>
          <select id="status" formControlName="status">
            @for (status of availableStatuses; track status) {
              <option [value]="status">{{ status }}</option>
            }
          </select>
        </div>

        <div class="form-group">
          <label for="notes">{{ formLabels.NOTES }}</label>
          <textarea
            id="notes"
            formControlName="notes"
            [placeholder]="formLabels.NOTES_PLACEHOLDER"
            rows="4"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="form.invalid || formState.isSubmitting()">
            @if (formState.isSubmitting()) {
              {{ mode() === 'create' ? formLabels.SUBMITTING_BUTTON : formLabels.UPDATING_BUTTON }}
            } @else {
              {{ mode() === 'create' ? formLabels.ADD_CLIENT_BUTTON : formLabels.UPDATE_CLIENT_BUTTON }}
            }
          </button>
          <button type="button" (click)="onCancel()" [disabled]="formState.isSubmitting()">
            {{ formLabels.CANCEL_BUTTON }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class ClientFormComponent implements OnDestroy {
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

  // UI text labels
  readonly uiText = CLIENT_UI_TEXT;

  // Form labels
  readonly formLabels = CLIENT_FORM_LABELS;

  // Select error from store (for edit mode)
  storeError = this.store.selectSignal(selectClientsError);

  form = new FormGroup<ClientFormFields>({
    companyName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    phone: new FormControl('', { nonNullable: true }),
    address: new FormControl('', { nonNullable: true }),
    status: new FormControl<ClientStatus>(DEFAULT_CLIENT_STATUS, { nonNullable: true, validators: [Validators.required] }),
    notes: new FormControl('', { nonNullable: true })
  });

  formState = new FormState();

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
      this.formState.setSubmitting(false);
      this.formSucceeded.emit();
    });

    // Listen for failed update actions in edit mode
    this.actions$.pipe(
      ofType(updateClientFailure),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.formState.setSubmitting(false);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.form.valid && !this.formState.isSubmitting()) {
      this.formState.setSubmitting(true);
      this.formState.clearMessages();

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
        this.formState.setSuccess('Success', SUCCESS_MESSAGE_DISMISS_DURATION_MS);
        this.formState.setSubmitting(false);
        this.form.reset({ status: DEFAULT_CLIENT_STATUS });
        setTimeout(() => {
          this.formSucceeded.emit();
        }, SUCCESS_MESSAGE_DISMISS_DURATION_MS);
      },
      error: (error) => {
        this.formState.setError(error.message || 'Failed to create client');
        this.formState.setSubmitting(false);
      }
    });
  }

  private handleUpdate(formValue: ReturnType<typeof this.form.getRawValue>): void {
    const clientData = this.client();
    if (!clientData) {
      this.formState.setError('Client data not found');
      this.formState.setSubmitting(false);
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
      this.form.reset({ status: DEFAULT_CLIENT_STATUS });
      this.formState.reset();
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
