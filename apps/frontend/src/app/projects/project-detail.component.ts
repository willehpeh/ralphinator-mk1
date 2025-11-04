import { Component, ChangeDetectionStrategy, inject, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { ProjectsService } from './projects.service';
import { ProjectDto, ProjectStatus } from '@angular-nest-starter/shared-types';
import { StatusChangeDialogComponent } from '../shared/status-change-dialog.component';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog.component';
import { loadProjectTasks } from '../tasks/store/tasks.actions';
import { selectTasksByProjectId } from '../tasks/store/tasks.selectors';

@Component({
  selector: 'app-project-detail',
  imports: [CommonModule, RouterLink, StatusChangeDialogComponent, ConfirmationDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./projects-common.scss', './project-detail.component.scss'],
  template: `
    <div class="project-detail">
      <div class="detail-header">
        <button class="back-button" (click)="navigateBack()">
          ← Back to Projects
        </button>
        <h2>Project Details</h2>
      </div>

      @if (loading()) {
        <div class="loading-message">
          Loading project details...
        </div>
      }

      @if (error(); as errorMessage) {
        <div class="error-message">
          {{ errorMessage }}
        </div>
      }

      @if (!loading() && !project() && !error()) {
        <div class="error-message">
          Project not found
        </div>
      }

      @if (project(); as projectData) {
        <div class="detail-card">
          <div class="detail-header-section">
            <h3>{{ projectData.name }}</h3>
            <div class="header-actions">
              <span class="status-badge status-{{ projectData.status.toLowerCase().replace(' ', '-') }}">
                {{ projectData.status }}
              </span>
              <button class="secondary-button" (click)="openStatusChangeDialog()">
                Change Status
              </button>
              <button class="edit-button" (click)="navigateToEdit()">
                Edit Project
              </button>
              <button class="delete-button" (click)="openDeleteDialog()">
                Delete Project
              </button>
            </div>
          </div>

          @if (projectData.description) {
            <div class="detail-section">
              <h4>Description</h4>
              <p class="description-content">{{ projectData.description }}</p>
            </div>
          }

          <div class="detail-section">
            <h4>Timeline</h4>
            <div class="detail-grid">
              @if (projectData.startDate) {
                <div class="detail-item">
                  <span class="detail-label">Start Date:</span>
                  <span class="detail-value">{{ projectData.startDate | date:'mediumDate' }}</span>
                </div>
              }
              @if (projectData.expectedEndDate) {
                <div class="detail-item">
                  <span class="detail-label">Expected End Date:</span>
                  <span class="detail-value">{{ projectData.expectedEndDate | date:'mediumDate' }}</span>
                </div>
              }
              @if (projectData.actualEndDate) {
                <div class="detail-item">
                  <span class="detail-label">Actual End Date:</span>
                  <span class="detail-value">{{ projectData.actualEndDate | date:'mediumDate' }}</span>
                </div>
              }
            </div>
          </div>

          @if (projectData.budget) {
            <div class="detail-section">
              <h4>Budget</h4>
              <div class="budget-amount">{{ projectData.budget | currency }}</div>
            </div>
          }

          @if (projectData.technicalNotes) {
            <div class="detail-section">
              <h4>Technical Notes</h4>
              <p class="technical-notes-content">{{ projectData.technicalNotes }}</p>
            </div>
          }

          <div class="detail-section">
            <h4>Client Information</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">Client:</span>
                <a [routerLink]="['/clients', projectData.clientId]" class="client-link">
                  View Client Details →
                </a>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h4>Metadata</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">Project ID:</span>
                <span class="detail-value">{{ projectData.id }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Client ID:</span>
                <span class="detail-value">{{ projectData.clientId }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Created:</span>
                <span class="detail-value">{{ projectData.createdAt | date:'medium' }}</span>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <div class="section-header-with-action">
              <h4>Tasks</h4>
              <button class="secondary-button" (click)="navigateToAddTask()">
                + Add Task
              </button>
            </div>
            <div class="tasks-content">
              @for (task of projectTasks(); track task.id) {
                <div class="task-card">
                  <div class="task-card-header">
                    <h5 class="task-title">{{ task.title }}</h5>
                    <div class="task-badges">
                      <span class="status-badge status-{{ task.status.toLowerCase() }}">
                        {{ task.status }}
                      </span>
                      <span class="priority-badge priority-{{ task.priority.toLowerCase() }}">
                        {{ task.priority }}
                      </span>
                    </div>
                  </div>
                  @if (task.dueDate) {
                    <div class="task-due-date" [class.overdue]="isTaskOverdue(task)">
                      @if (isTaskOverdue(task)) {
                        <span class="overdue-badge">OVERDUE</span>
                      }
                      Due: {{ task.dueDate | date:'mediumDate' }}
                    </div>
                  }
                </div>
              } @empty {
                <div class="empty-state">
                  <p class="empty-state-message">No tasks yet. Add a task to get started.</p>
                </div>
              }
            </div>
          </div>
        </div>
      }

      @if (showStatusDialog()) {
        <app-status-change-dialog
          [currentStatus]="project()!.status"
          (statusChanged)="onStatusChanged($event)"
          (cancelled)="onStatusDialogCancelled()"
        />
      }

      @if (showDeleteDialog()) {
        <app-confirmation-dialog
          [title]="'Delete Project'"
          [message]="'Are you sure you want to delete this project? The project will be archived and removed from active views, but the complete history will be preserved.'"
          [confirmText]="'Delete'"
          [cancelText]="'Cancel'"
          (confirmed)="onDeleteConfirmed()"
          (cancelled)="onDeleteCancelled()"
        />
      }
    </div>
  `
})
export class ProjectDetailComponent {
  private projectsService = inject(ProjectsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);

  // Loading and error states
  loading = signal(false);
  error = signal<string | null>(null);
  showStatusDialog = signal(false);
  showDeleteDialog = signal(false);

  // Get project ID from route params using toSignal
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
          this.error.set('No project ID provided');
          return of(null);
        }

        this.loading.set(true);
        this.error.set(null);

        return this.projectsService.getProjectById(id).pipe(
          map(project => {
            this.loading.set(false);
            return project;
          }),
          catchError(err => {
            console.error('Error loading project:', err);
            this.error.set('Failed to load project details. Please try again later.');
            this.loading.set(false);
            return of(null);
          })
        );
      })
    ),
    { initialValue: null }
  );

  // Select tasks for this project
  projectTasks = computed(() => {
    const id = this.projectId();
    if (!id) return [];
    return this.store.selectSignal(selectTasksByProjectId(id))();
  });

  // Load project tasks whenever projectId changes
  constructor() {
    effect(() => {
      const id = this.projectId();
      if (id) {
        this.store.dispatch(loadProjectTasks({ projectId: id }));
      }
    });
  }

  navigateBack(): void {
    this.router.navigate(['/projects']);
  }

  navigateToEdit(): void {
    const id = this.projectId();
    if (id) {
      this.router.navigate(['/projects', id, 'edit']);
    }
  }

  navigateToAddTask(): void {
    const currentProject = this.project();
    if (!currentProject) return;

    this.router.navigate(['/tasks/add'], {
      queryParams: {
        projectId: currentProject.id,
        clientId: currentProject.clientId
      }
    });
  }

  openStatusChangeDialog(): void {
    this.showStatusDialog.set(true);
  }

  onStatusChanged(newStatus: ProjectStatus): void {
    const currentProject = this.project();
    if (!currentProject) return;

    this.loading.set(true);
    this.showStatusDialog.set(false);

    this.projectsService.changeProjectStatus(
      currentProject.clientId,
      currentProject.id,
      { status: newStatus }
    ).subscribe({
      next: (updatedProject) => {
        this.loading.set(false);
        // Reload the project to get the latest data
        window.location.reload();
      },
      error: (err) => {
        console.error('Error changing project status:', err);
        this.error.set('Failed to change project status. Please try again.');
        this.loading.set(false);
      }
    });
  }

  onStatusDialogCancelled(): void {
    this.showStatusDialog.set(false);
  }

  openDeleteDialog(): void {
    this.showDeleteDialog.set(true);
  }

  onDeleteConfirmed(): void {
    const currentProject = this.project();
    if (!currentProject) return;

    this.loading.set(true);
    this.showDeleteDialog.set(false);

    this.projectsService.deleteProject(
      currentProject.clientId,
      currentProject.id
    ).subscribe({
      next: () => {
        this.loading.set(false);
        // Navigate to projects list after successful deletion
        this.router.navigate(['/projects']);
      },
      error: (err) => {
        console.error('Error deleting project:', err);
        this.error.set('Failed to delete project. Please try again.');
        this.loading.set(false);
      }
    });
  }

  onDeleteCancelled(): void {
    this.showDeleteDialog.set(false);
  }

  isTaskOverdue(task: any): boolean {
    if (!task.dueDate) return false;
    if (task.status === 'Completed' || task.status === 'Cancelled') return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
  }
}
