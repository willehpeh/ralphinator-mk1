import { Route } from '@angular/router';
import { AddClientPageComponent } from './clients/add-client-page.component';
import { ClientListComponent } from './clients/client-list.component';
import { ClientDetailComponent } from './clients/client-detail.component';
import { ContactDetailComponent } from './clients/contact-detail.component';
import { AllContactsComponent } from './clients/all-contacts.component';

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
    path: 'contacts',
    component: AllContactsComponent,
  },
  {
    path: 'clients/:id/contacts/:contactId',
    component: ContactDetailComponent,
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
