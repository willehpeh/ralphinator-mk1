import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { appRoutes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { tasksReducer } from './tasks/store/tasks.reducer';
import { TasksEffects } from './tasks/store/tasks.effects';
import { clientsReducer } from './clients/store/clients.reducer';
import { ClientsEffects } from './clients/store/clients.effects';
import { dashboardReducer } from './dashboard/store/dashboard.reducer';
import { DashboardEffects } from './dashboard/store/dashboard.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(),
    provideState({ name: 'tasks', reducer: tasksReducer }),
    provideState({ name: 'clients', reducer: clientsReducer }),
    provideState({ name: 'dashboard', reducer: dashboardReducer }),
    provideEffects([TasksEffects, ClientsEffects, DashboardEffects]),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(),
  ],
};
