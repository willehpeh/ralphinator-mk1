import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ClientFormComponent } from './client-form.component';
import { CLIENT_ROUTES } from './client-routes.constants';

@Component({
  selector: 'app-add-client-page',
  imports: [ClientFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-client-form
      [mode]="'create'"
      (formCancelled)="handleCancel()"
      (formSucceeded)="handleSuccess()"
    />
  `
})
export class AddClientPageComponent {
  private router = inject(Router);

  handleCancel(): void {
    this.router.navigate([CLIENT_ROUTES.BASE]);
  }

  handleSuccess(): void {
    this.router.navigate([CLIENT_ROUTES.BASE]);
  }
}
