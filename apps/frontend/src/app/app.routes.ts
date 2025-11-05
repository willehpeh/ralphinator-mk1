import { Route } from '@angular/router';
import { AddClientPageComponent } from './clients/add-client-page.component';
import { ClientListComponent } from './clients/client-list.component';
import { ClientDetailComponent } from './clients/client-detail.component';
import { ContactDetailComponent } from './clients/contact-detail.component';
import { AllContactsComponent } from './clients/all-contacts.component';
import { ProjectsListComponent } from './projects/projects-list.component';
import { ProjectDetailComponent } from './projects/project-detail.component';
import { ProjectEditComponent } from './projects/project-edit.component';
import { AddTaskPageComponent } from './tasks/add-task-page.component';
import { TaskListComponent } from './tasks/task-list.component';
import { TaskDetailComponent } from './tasks/task-detail.component';
import { EditTaskPageComponent } from './tasks/edit-task-page.component';
import { CommunicationsListComponent } from './communications/communications-list.component';

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
    path: 'projects',
    component: ProjectsListComponent,
  },
  {
    path: 'projects/:id/edit',
    component: ProjectEditComponent,
  },
  {
    path: 'projects/:id',
    component: ProjectDetailComponent,
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
    path: 'tasks',
    component: TaskListComponent,
  },
  {
    path: 'tasks/add',
    component: AddTaskPageComponent,
  },
  {
    path: 'tasks/:id/edit',
    component: EditTaskPageComponent,
  },
  {
    path: 'tasks/:id',
    component: TaskDetailComponent,
  },
  {
    path: 'communications',
    component: CommunicationsListComponent,
  },
  {
    path: '',
    redirectTo: 'clients',
    pathMatch: 'full',
  },
];
