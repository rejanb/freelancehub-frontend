import { Routes } from '@angular/router';

export const notificationsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./notification-list/notification-list.component').then(m => m.NotificationListComponent)
      },
      {
        path: 'preferences',
        loadComponent: () => import('./notification-preferences/notification-preferences.component').then(m => m.NotificationPreferencesComponent)
      }
    ]
  }
]; 