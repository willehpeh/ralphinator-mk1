import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ClientFormComponent } from './client-form.component';

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
    this.router.navigate(['/clients']);
  }

  handleSuccess(): void {
    this.router.navigate(['/clients']);
  }
}
