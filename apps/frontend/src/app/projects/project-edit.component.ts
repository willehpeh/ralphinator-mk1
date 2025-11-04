import { Component, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { UpdateProjectDto, ProjectStatus, PROJECT_STATUS_VALUES, ProjectDto } from '@angular-nest-starter/shared-types';
import { ProjectsService } from './projects.service';
import { FormState } from '../shared/form-state';
import { ValidationErrorComponent } from '../shared/validation-error.component';
import { SUCCESS_MESSAGE_DISMISS_DURATION_MS } from '../shared/ui.constants';
import { formatDateForInput } from '../shared/date-format-utils';

interface ProjectEditFormFields {
  clientId: FormControl<string>;
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
  selector: 'app-project-edit',
  imports: [CommonModule, ReactiveFormsModule, ValidationErrorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./projects-common.scss', './project-form.component.scss'],
  template: `
    <div class="project-form">
      <div class="detail-header">
        <button class="back-button" (click)="navigateBack()">
          ← Back to Project Details
        </button>
        <h2>Edit Project</h2>
      </div>

      @if (loadingProject()) {
        <div class="loading-message">
          Loading project details...
        </div>
      }

      @if (loadError(); as errorMessage) {
        <div class="error-message">
          {{ errorMessage }}
        </div>
      }

      @if (!loadingProject() && project()) {
        @if (formState.successMessage()) {
          <div class="success-message">
            Project updated successfully!
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
            <app-validation-error
              [control]="form.controls.name"
              requiredMessage="Project name is required" />
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
            <app-validation-error
              [control]="form.controls.budget"
              minMessage="Budget must be a positive number" />
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
                Updating Project...
              } @else {
                Update Project
              }
            </button>
            <button type="button" (click)="onCancel()" [disabled]="formState.isSubmitting()">
              Cancel
            </button>
          </div>
        </form>
      }
    </div>
  `
})
export class ProjectEditComponent {
  private projectsService = inject(ProjectsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Available status options
  readonly availableStatuses = PROJECT_STATUS_VALUES;

  // Loading and error states for project fetch
  loadingProject = signal(false);
  loadError = signal<string | null>(null);

  // Get project ID from route params
  private projectId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id'))
    ),
    { initialValue: null }
  );

  // Load project data reactively when projectId changes
  project = toSignal(
    toObservable(this.projectId).pipe(
      switchMap(id => {
        if (!id) {
          this.loadError.set('No project ID provided');
          return of(null);
        }

        this.loadingProject.set(true);
        this.loadError.set(null);

        return this.projectsService.getProjectById(id).pipe(
          map(project => {
            this.loadingProject.set(false);
            return project;
          }),
          catchError(err => {
            console.error('Error loading project:', err);
            this.loadError.set('Failed to load project details. Please try again later.');
            this.loadingProject.set(false);
            return of(null);
          })
        );
      })
    ),
    { initialValue: null }
  );

  form = new FormGroup<ProjectEditFormFields>({
    clientId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
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

    // Pre-populate form when project loads
    effect(() => {
      const projectData = this.project();
      if (projectData) {
        this.populateForm(projectData);
      }
    });
  }

  /**
   * Populate form with project data
   */
  private populateForm(projectData: ProjectDto): void {
    this.form.patchValue({
      clientId: projectData.clientId,
      name: projectData.name,
      status: projectData.status,
      description: projectData.description || '',
      startDate: projectData.startDate ? formatDateForInput(projectData.startDate) : '',
      expectedEndDate: projectData.expectedEndDate ? formatDateForInput(projectData.expectedEndDate) : '',
      actualEndDate: projectData.actualEndDate ? formatDateForInput(projectData.actualEndDate) : '',
      budget: projectData.budget,
      technicalNotes: projectData.technicalNotes || ''
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
      const currentProjectId = this.projectId();
      if (!currentProjectId) {
        this.formState.setError('No project ID available');
        return;
      }

      this.formState.setSubmitting(true);
      this.formState.clearMessages();

      const formValue = this.form.getRawValue();

      const dto: UpdateProjectDto = {
        clientId: formValue.clientId,
        name: formValue.name,
        status: formValue.status,
        description: formValue.description || undefined,
        startDate: formValue.startDate || undefined,
        expectedEndDate: formValue.expectedEndDate || undefined,
        actualEndDate: formValue.actualEndDate || undefined,
        budget: formValue.budget !== null ? formValue.budget : undefined,
        technicalNotes: formValue.technicalNotes || undefined
      };

      this.projectsService.updateProject(currentProjectId, dto).subscribe({
        next: () => {
          this.formState.setSuccess('Success', SUCCESS_MESSAGE_DISMISS_DURATION_MS);
          this.formState.setSubmitting(false);
          // Navigate back to project detail page after successful update
          setTimeout(() => {
            this.router.navigate(['/projects', currentProjectId]);
          }, SUCCESS_MESSAGE_DISMISS_DURATION_MS);
        },
        error: (error) => {
          this.formState.setError(error.message || 'Failed to update project');
          this.formState.setSubmitting(false);
        }
      });
    }
  }

  onCancel(): void {
    this.navigateBack();
  }

  navigateBack(): void {
    const currentProjectId = this.projectId();
    if (currentProjectId) {
      this.router.navigate(['/projects', currentProjectId]);
    } else {
      this.router.navigate(['/projects']);
    }
  }
}
