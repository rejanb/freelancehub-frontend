import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-settings-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TabMenuModule
  ],
  template: `
    <div class="grid">
      <div class="col-12">
        <div class="flex justify-content-between align-items-center mb-4">
          <h2 class="m-0">Settings</h2>
        </div>

        <p-tabMenu [model]="menuItems" [activeItem]="activeItem"></p-tabMenu>

        <div class="mt-4">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `
})
export class SettingsLayoutComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Account',
      icon: 'pi pi-user',
      routerLink: 'account'
    },
    {
      label: 'Security',
      icon: 'pi pi-shield',
      routerLink: 'security'
    },
    {
      label: 'Notifications',
      icon: 'pi pi-bell',
      routerLink: 'notifications'
    },
    {
      label: 'Billing',
      icon: 'pi pi-credit-card',
      routerLink: 'billing'
    },
    {
      label: 'Privacy',
      icon: 'pi pi-lock',
      routerLink: 'privacy'
    }
  ];

  activeItem: MenuItem = this.menuItems[0];
} 