import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsService } from './projects.service';
import { ProjectDto, PROJECT_STATUS_VALUES, ProjectStatus } from '@angular-nest-starter/shared-types';

@Component({
  selector: 'app-projects-list',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./projects-common.scss', './projects-list.component.scss'],
  template: `
    <div class="projects-list">
      <div class="list-header">
        <h2>All Projects</h2>
      </div>

      <div class="filters-section">
        <div class="filter-group">
          <label for="status-filter" class="filter-label">Filter by Status:</label>
          <select id="status-filter" class="filter-select">
            <option value="">All Statuses</option>
            @for (status of statusOptions; track status) {
              <option [value]="status">{{ status }}</option>
            }
          </select>
        </div>
      </div>

      @if (loading()) {
        <div class="loading-message">
          Loading projects...
        </div>
      }

      @if (error(); as errorMessage) {
        <div class="error-message">
          {{ errorMessage }}
        </div>
      }

      @if (!loading() && projects().length === 0) {
        <div class="empty-state">
          <p>No projects found</p>
          <p class="empty-state-hint">
            There are no projects in the system yet. Create your first project to get started.
          </p>
        </div>
      }

      @if (projects().length > 0) {
        <div class="project-count">
          Showing {{ projects().length }} {{ projects().length === 1 ? 'project' : 'projects' }}
        </div>

        <div class="projects-grid">
          @for (project of projects(); track project.id) {
            <div class="project-card">
              <div class="project-header">
                <h3>{{ project.name }}</h3>
                <span class="status-badge status-{{ project.status.toLowerCase() }}">
                  {{ project.status }}
                </span>
              </div>
              <div class="project-details">
                @if (project.description) {
                  <div class="detail-row">
                    <span class="detail-label">Description:</span>
                    <span class="detail-value">{{ project.description }}</span>
                  </div>
                }
                @if (project.startDate) {
                  <div class="detail-row">
                    <span class="detail-label">Start Date:</span>
                    <span class="detail-value">{{ project.startDate | date:'mediumDate' }}</span>
                  </div>
                }
                @if (project.expectedEndDate) {
                  <div class="detail-row">
                    <span class="detail-label">Expected End:</span>
                    <span class="detail-value">{{ project.expectedEndDate | date:'mediumDate' }}</span>
                  </div>
                }
                @if (project.budget) {
                  <div class="detail-row">
                    <span class="detail-label">Budget:</span>
                    <span class="detail-value">{{ project.budget | currency }}</span>
                  </div>
                }
                <div class="detail-row">
                  <span class="detail-label">Created:</span>
                  <span class="detail-value">{{ project.createdAt | date:'mediumDate' }}</span>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class ProjectsListComponent implements OnInit {
  private projectsService = inject(ProjectsService);

  // Available status options for filtering
  readonly statusOptions = PROJECT_STATUS_VALUES;

  // Signals for component state
  projects = signal<ProjectDto[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProjects();
  }

  private loadProjects(): void {
    this.loading.set(true);
    this.error.set(null);

    this.projectsService.getAllProjects().subscribe({
      next: (projects) => {
        this.projects.set(projects);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading projects:', err);
        this.error.set('Failed to load projects. Please try again later.');
        this.loading.set(false);
      }
    });
  }
}
