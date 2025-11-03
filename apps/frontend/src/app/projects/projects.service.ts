import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateProjectDto, CreateProjectResponse, ProjectDto, UpdateProjectDto } from '@angular-nest-starter/shared-types';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/clients';
  private readonly projectsApiUrl = '/api/projects';

  /**
   * Create a new project for a client
   */
  createProject(dto: CreateProjectDto): Observable<CreateProjectResponse> {
    return this.http.post<CreateProjectResponse>(
      `${this.apiUrl}/${dto.clientId}/projects`,
      dto
    );
  }

  /**
   * Get all projects for a specific client
   */
  getProjectsByClientId(clientId: string): Observable<ProjectDto[]> {
    return this.http.get<ProjectDto[]>(`${this.apiUrl}/${clientId}/projects`);
  }

  /**
   * Get all projects across all clients
   */
  getAllProjects(): Observable<ProjectDto[]> {
    return this.http.get<ProjectDto[]>(this.projectsApiUrl);
  }

  /**
   * Get a single project by ID
   */
  getProjectById(projectId: string): Observable<ProjectDto> {
    return this.http.get<ProjectDto>(`${this.projectsApiUrl}/${projectId}`);
  }

  /**
   * Update an existing project
   */
  updateProject(projectId: string, dto: UpdateProjectDto): Observable<void> {
    return this.http.put<void>(`${this.projectsApiUrl}/${projectId}`, dto);
  }
}
