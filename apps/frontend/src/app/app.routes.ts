import { Route } from '@angular/router';
import { AddClientFormComponent } from './clients/add-client-form.component';

export const appRoutes: Route[] = [
  {
    path: 'clients/add',
    component: AddClientFormComponent,
  },
  {
    path: '',
    redirectTo: 'clients/add',
    pathMatch: 'full',
  },
];
