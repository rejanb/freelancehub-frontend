import {Component} from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MenubarModule} from 'primeng/menubar';
import {SidebarModule} from 'primeng/sidebar';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {CardModule} from 'primeng/card';
import {PanelMenuModule} from 'primeng/panelmenu';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    FormsModule,
    MenubarModule,
    SidebarModule,
    ButtonModule,
    TableModule,
    CardModule,
    InputTextModule,
    PanelMenuModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  items = [
    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: '/' },
    { label: 'Logout', icon: 'pi pi-fw pi-sign-out' }
  ];

  menuItems = [
    {
      label: 'Management',
      icon: 'pi pi-fw pi-cog',
      items: [
        { label: 'Users', icon: 'pi pi-fw pi-users', routerLink: '/users' },
        { label: 'Reports', icon: 'pi pi-fw pi-chart-line', routerLink: '/reports' }
      ]
    }
  ];

}
