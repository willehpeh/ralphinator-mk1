import { Route } from '@angular/router';
import { AddClientFormComponent } from './clients/add-client-form.component';
import { ClientListComponent } from './clients/client-list.component';

export const appRoutes: Route[] = [
  {
    path: 'clients',
    component: ClientListComponent,
  },
  {
    path: 'clients/add',
    component: AddClientFormComponent,
  },
  {
    path: '',
    redirectTo: 'clients',
    pathMatch: 'full',
  },
];
