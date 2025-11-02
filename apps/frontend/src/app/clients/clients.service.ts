import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, ClientStatus } from './client.types';

interface ClientDataDto {
  companyName: string;
  email: string;
  phone?: string;
  address?: string;
  status: ClientStatus;
  notes?: string;
}

export type CreateClientDto = ClientDataDto;
export type UpdateClientDto = ClientDataDto;

export interface CreateClientResponse {
  id: string;
}

export interface ChangeClientStatusDto {
  status: ClientStatus;
}

export interface DeleteClientResponse {
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

  updateClient(id: string, dto: UpdateClientDto): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, dto);
  }

  changeClientStatus(id: string, dto: ChangeClientStatusDto): Observable<Client> {
    return this.http.patch<Client>(`${this.apiUrl}/${id}/status`, dto);
  }

  deleteClient(id: string): Observable<DeleteClientResponse> {
    return this.http.delete<DeleteClientResponse>(`${this.apiUrl}/${id}`);
  }

  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  getClientsByStatus(status: ClientStatus): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/status/${status}`);
  }
}
