import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {AuthService} from '../../../service/auth.service';
import {TokenService} from '../../../utils/token.service';
import {ApiConst} from '../../../const/api-const';
import {Menubar} from "primeng/menubar";
import {RippleModule} from 'primeng/ripple';
import {MenuModule} from 'primeng/menu';
import {BadgeModule} from 'primeng/badge';
import {AvatarModule} from 'primeng/avatar';
import {MenuItem} from 'primeng/api';
import { CommonModule } from '@angular/common';
import { DrawerModule } from 'primeng/drawer'
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule,
    RouterOutlet,
    DrawerModule,
    Menubar,MenuModule, BadgeModule, RippleModule, AvatarModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent  implements OnInit {
  constructor(private auth: AuthService, private router: Router,private token: TokenService) {}

  items: MenuItem[] | undefined;

  isSidebarOpen: boolean = true;
  sidebar = {

  }
  ngOnInit() {
    this.items = [
      {
        separator: true
      },
      {
        label: 'Documents',
        items: [
          {
            label: 'New',
            icon: 'pi pi-plus',
            shortcut: '⌘+N'
          },
          {
            label: 'Search',
            icon: 'pi pi-search',
            shortcut: '⌘+S'
          }
        ]
      },
      {
        label: 'Profile',
        items: [
          {
            label: 'Settings',
            icon: 'pi pi-cog',
            shortcut: '⌘+O'
          },
          {
            label: 'Messages',
            icon: 'pi pi-inbox',
            badge: '2'
          },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            shortcut: '⌘+Q',
            command: () => {
              this.onLogout();
            }

          }
        ]
      },
      {
        separator: true
      }
    ];
  }

  onLogout() {
    const refresh = this.auth.getRefreshToken()
    if (refresh)  {
      // this.auth.logout(refresh).subscribe((res: any) => {
      //   console.log('Logout successful:', res);
        this.token.clearLocal(ApiConst.userKey);
        this.token.clearLocal(ApiConst.access);
        this.token.clearLocal(ApiConst.refresh);
        this.router.navigate(['login']);
      // }, (error: any) => {
      //   console.error('Logout failed:', error);
      // });

    }

  }

  toggle() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
