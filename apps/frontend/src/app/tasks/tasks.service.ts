import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './task.types';
import {
  CreateTaskDto,
  CreateTaskResponse
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
}
