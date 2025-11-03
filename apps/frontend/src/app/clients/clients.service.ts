import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, ClientStatus, Contact, ContactDetail, ContactWithClient } from './client.types';
import {
  CreateClientDto,
  UpdateClientDto,
  ChangeClientStatusDto,
  CreateClientResponse,
  DeleteClientResponse
} from '@angular-nest-starter/shared-types';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/clients';
  private readonly contactsApiUrl = '/api/contacts';

  // Client operations
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

  getClientById(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  // Contact operations
  getContactsByClient(clientId: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/${clientId}/contacts`);
  }

  addContactToClient(clientId: string, dto: { name: string; role?: string | null; email?: string | null; phone?: string | null }): Observable<{ contactId: string; clientId: string }> {
    return this.http.post<{ contactId: string; clientId: string }>(`${this.apiUrl}/${clientId}/contacts`, dto);
  }

  getAllContacts(): Observable<ContactWithClient[]> {
    return this.http.get<ContactWithClient[]>(this.contactsApiUrl);
  }

  getContactById(contactId: string): Observable<ContactDetail> {
    return this.http.get<ContactDetail>(`${this.contactsApiUrl}/${contactId}`);
  }

  updateContact(contactId: string, dto: { name: string; role?: string | null; email?: string | null; phone?: string | null }): Observable<ContactDetail> {
    return this.http.put<ContactDetail>(`${this.contactsApiUrl}/${contactId}`, dto);
  }

  deleteContact(contactId: string): Observable<void> {
    return this.http.delete<void>(`${this.contactsApiUrl}/${contactId}`);
  }
}
