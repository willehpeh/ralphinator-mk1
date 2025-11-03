import { Component, ChangeDetectionStrategy, inject, input, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CreateProjectDto, ProjectStatus, PROJECT_STATUS_VALUES } from '@angular-nest-starter/shared-types';
import { ProjectsService } from './projects.service';
import { FormState } from '../shared/form-state';

interface ProjectFormFields {
  name: FormControl<string>;
  status: FormControl<ProjectStatus>;
  description: FormControl<string>;
  startDate: FormControl<string>;
  expectedEndDate: FormControl<string>;
  actualEndDate: FormControl<string>;
  budget: FormControl<number | null>;
  technicalNotes: FormControl<string>;
}

@Component({
  selector: 'app-project-form',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./projects-common.scss', './project-form.component.scss'],
  template: `
    <div class="project-form">
      <h2>{{ formTitle }}</h2>

      @if (formState.successMessage()) {
        <div class="success-message">
          Project created successfully!
        </div>
      }

      @if (formState.error()) {
        <div class="error-message">
          {{ formState.error() }}
        </div>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name">Project Name <span class="required">*</span></label>
          <input
            id="name"
            type="text"
            formControlName="name"
            placeholder="Enter project name"
            [class.invalid]="form.controls.name.invalid && form.controls.name.touched"
          />
          @if (form.controls.name.invalid && form.controls.name.touched) {
            <div class="validation-error">
              @if (form.controls.name.hasError('required')) {
                Project name is required
              }
            </div>
          }
        </div>

        <div class="form-group">
          <label for="status">Status <span class="required">*</span></label>
          <select id="status" formControlName="status">
            @for (status of availableStatuses; track status) {
              <option [value]="status">{{ status }}</option>
            }
          </select>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            formControlName="description"
            placeholder="Enter project description"
            rows="3"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="startDate">Start Date</label>
            <input
              id="startDate"
              type="date"
              formControlName="startDate"
              [class.invalid]="form.controls.startDate.invalid && form.controls.startDate.touched"
            />
            @if (form.controls.startDate.invalid && form.controls.startDate.touched) {
              <div class="validation-error">
                @if (form.hasError('startAfterExpected')) {
                  Start date cannot be after expected end date
                }
              </div>
            }
          </div>

          <div class="form-group">
            <label for="expectedEndDate">Expected End Date</label>
            <input
              id="expectedEndDate"
              type="date"
              formControlName="expectedEndDate"
              [class.invalid]="form.controls.expectedEndDate.invalid && form.controls.expectedEndDate.touched"
            />
          </div>
        </div>

        @if (shouldShowActualEndDate()) {
          <div class="form-group">
            <label for="actualEndDate">Actual End Date</label>
            <input
              id="actualEndDate"
              type="date"
              formControlName="actualEndDate"
              [class.invalid]="form.controls.actualEndDate.invalid && form.controls.actualEndDate.touched"
            />
            @if (form.controls.actualEndDate.invalid && form.controls.actualEndDate.touched) {
              <div class="validation-error">
                @if (form.hasError('expectedAfterActual')) {
                  Expected end date cannot be after actual end date
                }
              </div>
            }
          </div>
        }

        <div class="form-group">
          <label for="budget">Budget ($)</label>
          <input
            id="budget"
            type="number"
            formControlName="budget"
            placeholder="Enter budget amount"
            min="0"
            step="0.01"
            [class.invalid]="form.controls.budget.invalid && form.controls.budget.touched"
          />
          @if (form.controls.budget.invalid && form.controls.budget.touched) {
            <div class="validation-error">
              @if (form.controls.budget.hasError('min')) {
                Budget must be a positive number
              }
            </div>
          }
        </div>

        <div class="form-group">
          <label for="technicalNotes">Technical Notes</label>
          <textarea
            id="technicalNotes"
            formControlName="technicalNotes"
            placeholder="Enter technical implementation notes"
            rows="4"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="form.invalid || formState.isSubmitting()">
            @if (formState.isSubmitting()) {
              Adding Project...
            } @else {
              Add Project
            }
          </button>
          <button type="button" (click)="onCancel()" [disabled]="formState.isSubmitting()">
            Cancel
          </button>
        </div>
      </form>
    </div>
  `
})
export class ProjectFormComponent {
  private projectsService = inject(ProjectsService);

  // Inputs
  clientId = input.required<string>();

  // Outputs
  formCancelled = output<void>();
  formSucceeded = output<void>();

  // Available status options
  readonly availableStatuses = PROJECT_STATUS_VALUES;

  // Form title
  readonly formTitle = 'Add New Project';

  form = new FormGroup<ProjectFormFields>({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    status: new FormControl<ProjectStatus>('Planning', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
    startDate: new FormControl('', { nonNullable: true }),
    expectedEndDate: new FormControl('', { nonNullable: true }),
    actualEndDate: new FormControl('', { nonNullable: true }),
    budget: new FormControl<number | null>(null, { validators: [Validators.min(0)] }),
    technicalNotes: new FormControl('', { nonNullable: true })
  }, { validators: [this.dateRangeValidator.bind(this)] });

  formState = new FormState();

  constructor() {
    // Watch for status changes to handle actual end date conditional validation
    effect(() => {
      const status = this.form.controls.status.value;
      if (!this.shouldShowActualEndDateForStatus(status)) {
        this.form.controls.actualEndDate.setValue('');
      }
    });
  }

  /**
   * Custom validator to ensure date ranges are valid
   */
  private dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = control.get('startDate')?.value;
    const expectedEndDate = control.get('expectedEndDate')?.value;
    const actualEndDate = control.get('actualEndDate')?.value;

    // Check if start date is after expected end date
    if (startDate && expectedEndDate && startDate > expectedEndDate) {
      return { startAfterExpected: true };
    }

    // Check if expected end date is after actual end date
    if (expectedEndDate && actualEndDate && expectedEndDate > actualEndDate) {
      return { expectedAfterActual: true };
    }

    return null;
  }

  /**
   * Determines if actual end date should be shown based on current status
   */
  shouldShowActualEndDate(): boolean {
    return this.shouldShowActualEndDateForStatus(this.form.controls.status.value);
  }

  /**
   * Determines if actual end date should be shown for a given status
   */
  private shouldShowActualEndDateForStatus(status: ProjectStatus): boolean {
    return status === 'Completed' || status === 'Cancelled';
  }

  onSubmit(): void {
    if (this.form.valid && !this.formState.isSubmitting()) {
      this.formState.setSubmitting(true);
      this.formState.clearMessages();

      const formValue = this.form.getRawValue();
      const currentClientId = this.clientId();

      const dto: CreateProjectDto = {
        clientId: currentClientId,
        name: formValue.name,
        status: formValue.status,
        description: formValue.description || undefined,
        startDate: formValue.startDate || undefined,
        expectedEndDate: formValue.expectedEndDate || undefined,
        actualEndDate: formValue.actualEndDate || undefined,
        budget: formValue.budget !== null ? formValue.budget : undefined,
        technicalNotes: formValue.technicalNotes || undefined
      };

      this.projectsService.createProject(dto).subscribe({
        next: () => {
          this.formState.setSuccess('Success', 2000);
          this.formState.setSubmitting(false);
          this.form.reset({ status: 'Planning' });
          setTimeout(() => {
            this.formSucceeded.emit();
          }, 2000);
        },
        error: (error) => {
          this.formState.setError(error.message || 'Failed to create project');
          this.formState.setSubmitting(false);
        }
      });
    }
  }

  onCancel(): void {
    this.form.reset({ status: 'Planning' });
    this.formState.reset();
    this.formCancelled.emit();
  }
}
