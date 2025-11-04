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

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(),
    provideState({ name: 'tasks', reducer: tasksReducer }),
    provideEffects([TasksEffects]),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(),
  ],
};
