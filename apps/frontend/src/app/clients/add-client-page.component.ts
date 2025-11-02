import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ClientFormComponent } from './client-form.component';
import { ClientNavigationService } from './client-navigation.service';

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
  private navigation = inject(ClientNavigationService);

  handleCancel(): void {
    this.navigation.toClientList();
  }

  handleSuccess(): void {
    this.navigation.toClientList();
  }
}
