import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CLIENT_ROUTES } from './client-routes.constants';

/**
 * Service to centralize client-related navigation logic
 * This reduces duplication and makes navigation patterns consistent across components
 */
@Injectable({
  providedIn: 'root'
})
export class ClientNavigationService {
  private router = inject(Router);

  /**
   * Navigate to the client list page
   */
  toClientList(): void {
    this.router.navigate([CLIENT_ROUTES.BASE]);
  }

  /**
   * Navigate to a specific client's detail page
   * @param clientId - The ID of the client to view
   */
  toClientDetail(clientId: string): void {
    this.router.navigate([CLIENT_ROUTES.detail(clientId)]);
  }

  /**
   * Navigate to the add client page
   */
  toAddClient(): void {
    this.router.navigate([CLIENT_ROUTES.ADD]);
  }
}
