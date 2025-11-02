import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from './store/clients.actions';

export interface CreateClientDto {
  companyName: string;
  email: string;
  phone?: string;
  address?: string;
  status: 'Active' | 'Inactive' | 'Prospect' | 'Past Client';
  notes?: string;
}

export interface CreateClientResponse {
  id: string;
}

export interface UpdateClientDto {
  companyName: string;
  email: string;
  phone?: string;
  address?: string;
  status: 'Active' | 'Inactive' | 'Prospect' | 'Past Client';
  notes?: string;
}

export interface UpdateClientResponse {
  id: string;
}

export interface ChangeClientStatusDto {
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
}

export interface ChangeClientStatusResponse {
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/clients';

  createClient(dto: CreateClientDto): Observable<CreateClientResponse> {
    return this.http.post<CreateClientResponse>(this.apiUrl, dto);
  }

  updateClient(id: string, dto: UpdateClientDto): Observable<UpdateClientResponse> {
    return this.http.put<UpdateClientResponse>(`${this.apiUrl}/${id}`, dto);
  }

  changeClientStatus(id: string, dto: ChangeClientStatusDto): Observable<ChangeClientStatusResponse> {
    return this.http.patch<ChangeClientStatusResponse>(`${this.apiUrl}/${id}/status`, dto);
  }

  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }
}
