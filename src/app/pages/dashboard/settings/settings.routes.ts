import { Routes } from '@angular/router';

export const settingsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./settings-layout/settings-layout.component')
          .then(m => m.SettingsLayoutComponent),
        children: [
          {
            path: '',
            redirectTo: 'account',
            pathMatch: 'full'
          },
          {
            path: 'account',
            loadComponent: () => import('./account-settings/account-settings.component')
              .then(m => m.AccountSettingsComponent)
          },
          {
            path: 'security',
            loadComponent: () => import('./security-settings/security-settings.component')
              .then(m => m.SecuritySettingsComponent)
          },
          {
            path: 'notifications',
            loadComponent: () => import('./notification-settings/notification-settings.component')
              .then(m => m.NotificationSettingsComponent)
          },
          {
            path: 'billing',
            loadComponent: () => import('./billing-settings/billing-settings.component')
              .then(m => m.BillingSettingsComponent)
          },
          {
            path: 'privacy',
            loadComponent: () => import('./privacy-settings/privacy-settings.component')
              .then(m => m.PrivacySettingsComponent)
          }
        ]
      }
    ]
  }
]; 