import { Routes } from '@angular/router';
import {BillingSettingsComponent} from './billing-settings/billing-settings.component';
import {NotificationSettingsComponent} from './notification-settings/notification-settings.component';
import {AccountSettingsComponent} from './account-settings/account-settings.component';
import {SettingsLayoutComponent} from './settings-layout/settings-layout.component';

export const settingsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: SettingsLayoutComponent,
        children: [
          {
            path: '',
            redirectTo: 'account',
            pathMatch: 'full'
          },
          {
            path: 'account',
            component: AccountSettingsComponent,
          },
          // {
          //   path: 'security',
          //   component: SecuritySettingsComponent
          // },
          {
            path: 'notifications',
            component: NotificationSettingsComponent,
          },
          {
            path: 'billing',
            component: BillingSettingsComponent,
          },
          // {
          //   path: 'privacy',
          //   component:PrivacySettingsComponent
          // }
        ]
      }
    ]
  }
];
