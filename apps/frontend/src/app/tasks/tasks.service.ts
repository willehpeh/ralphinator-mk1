import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, UpdateTaskInput } from './task.types';
import {
  CreateTaskDto,
  CreateTaskResponse,
  ChangeTaskStatusDto
} from '@angular-nest-starter/shared-types';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/tasks';

  createTask(dto: CreateTaskDto): Observable<CreateTaskResponse> {
    return this.http.post<CreateTaskResponse>(this.apiUrl, dto);
  }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  getTasksByProjectId(projectId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`/api/projects/${projectId}/tasks`);
  }

  getTasksByClientId(clientId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`/api/clients/${clientId}/tasks`);
  }

  updateTask(id: string, input: UpdateTaskInput): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, input);
  }

  changeTaskStatus(id: string, dto: ChangeTaskStatusDto): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}/status`, dto);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
