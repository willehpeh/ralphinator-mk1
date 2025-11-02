import { Route } from '@angular/router';
import { AddClientPageComponent } from './clients/add-client-page.component';
import { ClientListComponent } from './clients/client-list.component';
import { ClientDetailComponent } from './clients/client-detail.component';

export const appRoutes: Route[] = [
  {
    path: 'clients',
    component: ClientListComponent,
  },
  {
    path: 'clients/add',
    component: AddClientPageComponent,
  },
  {
    path: 'clients/:id',
    component: ClientDetailComponent,
  },
  {
    path: '',
    redirectTo: 'clients',
    pathMatch: 'full',
  },
];
