import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProjectsService } from './projects.service';
import { ProjectDto } from '@angular-nest-starter/shared-types';

@Component({
  selector: 'app-project-detail',
  imports: [CommonModule],
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
            <span class="status-badge status-{{ projectData.status.toLowerCase().replace(' ', '-') }}">
              {{ projectData.status }}
            </span>
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
        </div>
      }
    </div>
  `
})
export class ProjectDetailComponent {
  private projectsService = inject(ProjectsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Loading and error states
  loading = signal(false);
  error = signal<string | null>(null);

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

  navigateBack(): void {
    this.router.navigate(['/projects']);
  }
}
