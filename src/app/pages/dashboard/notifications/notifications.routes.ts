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
        path: 'test',
        loadComponent: () => import('./notification-test/notification-test.component').then(m => m.NotificationTestComponent)
      }
    ]
  }
];