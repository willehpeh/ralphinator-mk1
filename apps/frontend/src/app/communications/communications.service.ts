import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommunicationReadModel } from '@angular-nest-starter/shared-types';

@Injectable({
  providedIn: 'root'
})
export class CommunicationsService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/communications';

  getAllCommunications(queryParams?: { [key: string]: string }): Observable<CommunicationReadModel[]> {
    return this.http.get<CommunicationReadModel[]>(this.apiUrl, { params: queryParams || {} });
  }
}
