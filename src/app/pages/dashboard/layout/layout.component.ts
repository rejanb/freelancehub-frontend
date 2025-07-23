import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router, RouterModule, RouterOutlet} from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { TokenService } from '../../../utils/token.service';
import { LayoutService } from '../../../../service/layout.service';
import { ApiConst, RoleConst } from '../../../const/api-const';
import { Menubar } from "primeng/menubar";
import { RippleModule } from 'primeng/ripple';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    DrawerModule,
    Menubar,
    MenuModule,
    BadgeModule,
    RippleModule,
    AvatarModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    RouterModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private auth: AuthService,
    public router: Router,
    private token: TokenService,
    private layoutService: LayoutService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  items: MenuItem[] | undefined;
  isSidebarOpen: boolean = true;
  userName = '';
  role = '';
  userType = '';
  currentUser: any = null;
  userProfilePicture = '';
  isClient = false;
  isFreelancer = false;

  ngOnInit() {
    this.loadUserData();
    this.buildMenuItems();
    this.subscribeToSidebarState();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToSidebarState() {
    this.layoutService.sidebarState$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isOpen => {
        this.isSidebarOpen = isOpen;
      });
  }

  loadUserData() {
    const currentUser = this.token.getCurrentUser();
    this.currentUser = currentUser;
    this.userName = currentUser?.name || '';
    this.role = currentUser?.type || 'User';
    this.userType = currentUser?.type || '';
    this.userProfilePicture = currentUser?.profile_picture || '';
    this.isClient = currentUser?.type === RoleConst.CLIENT;
    this.isFreelancer = currentUser?.type === RoleConst.FREELANCER;
  }

  refreshMenuForUserType() {
    this.loadUserData();
    this.buildMenuItems();
  }

  toggle() {
    this.layoutService.toggleSidebar();
  }

  buildMenuItems() {
    this.items = [
      {
        separator: true
      },
      {
        label: 'Dashboard',
        items: [
          {
            label: 'Overview',
            icon: 'pi pi-home',
            routerLink: '/dashboard/overview'
          }
        ]
      },
      {
        label: 'Jobs & Projects',
        items: this.getJobsMenuItems()
      },
      {
        label: 'Contracts & Work',
        items: this.getContractsMenuItems()
      },
      {
        label: 'Payments & Finance',
        items: this.getPaymentsMenuItems()
      },
      {
        label: 'Communication',
        items: this.getCommunicationMenuItems()
      },
      {
        label: 'Support & Disputes',
        items: this.getSupportMenuItems()
      },
      {
        label: 'Account',
        items: this.getAccountMenuItems()
      },
      {
        separator: true
      }
    ];
  }

  getJobsMenuItems(): MenuItem[] {
    const commonItems: MenuItem[] = [
      {
        label: 'Browse Jobs',
        icon: 'pi pi-search',
        routerLink: '/dashboard/job'
      },
      {
        label: 'Browse Projects',
        icon: 'pi pi-folder',
        routerLink: '/dashboard/projects'
      }
    ];

    if (this.isClient) {
      return [
        ...commonItems,
        {
          label: 'Post New Job',
          icon: 'pi pi-plus-circle',
          routerLink: '/dashboard/job/create'
        },
        {
          label: 'Post New Project',
          icon: 'pi pi-plus',
          routerLink: '/dashboard/projects/form'
        },
        {
          label: 'My Posted Jobs',
          icon: 'pi pi-briefcase',
          routerLink: '/dashboard/job',
          queryParams: { filter: 'my-jobs' }
        },
        {
          label: 'My Projects',
          icon: 'pi pi-folder-open',
          routerLink: '/dashboard/projects',
          queryParams: { view: 'my' }
        },
        {
          label: 'Received Proposals',
          icon: 'pi pi-inbox',
          routerLink: '/dashboard/job',
          queryParams: { filter: 'proposals' }
        }
      ];
    } else if (this.isFreelancer) {
      return [
        ...commonItems,
        {
          label: 'Available Projects',
          icon: 'pi pi-folder-plus',
          routerLink: '/dashboard/projects',
          queryParams: { view: 'available' }
        },
        {
          label: 'My Job Proposals',
          icon: 'pi pi-send',
          routerLink: '/dashboard/job',
          queryParams: { filter: 'my-proposals' }
        },
        {
          label: 'My Project Applications',
          icon: 'pi pi-file-edit',
          routerLink: '/dashboard/projects',
          queryParams: { view: 'applications' }
        },
        {
          label: 'Saved Jobs',
          icon: 'pi pi-bookmark',
          routerLink: '/dashboard/job',
          queryParams: { filter: 'saved' }
        }
      ];
    }

    return commonItems;
  }

  getContractsMenuItems(): MenuItem[] {
    const commonItems: MenuItem[] = [
      {
        label: 'Active Contracts',
        icon: 'pi pi-file',
        routerLink: '/dashboard/contracts',
        queryParams: { status: 'active' }
      },
      {
        label: 'Completed Contracts',
        icon: 'pi pi-check-circle',
        routerLink: '/dashboard/contracts',
        queryParams: { status: 'completed' }
      }
    ];

    if (this.isClient) {
      return [
        ...commonItems,
        {
          label: 'Draft Contracts',
          icon: 'pi pi-file-edit',
          routerLink: '/dashboard/contracts',
          queryParams: { status: 'draft' }
        }
      ];
    }

    return commonItems;
  }

  getPaymentsMenuItems(): MenuItem[] {
    if (this.isClient) {
      return [
        {
          label: 'Payment History',
          icon: 'pi pi-credit-card',
          routerLink: '/dashboard/payments'
        },
        {
          label: 'Pending Payments',
          icon: 'pi pi-clock',
          routerLink: '/dashboard/payments',
          queryParams: { status: 'pending' }
        },
        {
          label: 'Payment Methods',
          icon: 'pi pi-wallet',
          routerLink: '/dashboard/payments/methods'
        }
      ];
    } else if (this.isFreelancer) {
      return [
        {
          label: 'Earnings',
          icon: 'pi pi-dollar',
          routerLink: '/dashboard/payments'
        },
        {
          label: 'Withdraw Funds',
          icon: 'pi pi-money-bill',
          routerLink: '/dashboard/payments/withdraw'
        },
        {
          label: 'Payment History',
          icon: 'pi pi-list',
          routerLink: '/dashboard/payments/history'
        }
      ];
    }

    return [
      {
        label: 'Payments',
        icon: 'pi pi-dollar',
        routerLink: '/dashboard/payments'
      }
    ];
  }

  getCommunicationMenuItems(): MenuItem[] {
    return [
      {
        label: 'Messages',
        icon: 'pi pi-comments',
        routerLink: '/dashboard/chat',
        badge: '2'
      },
      {
        label: 'Notifications',
        icon: 'pi pi-bell',
        routerLink: '/dashboard/notification'
      }
    ];
  }

  getSupportMenuItems(): MenuItem[] {
    return [
      {
        label: 'Disputes',
        icon: 'pi pi-exclamation-triangle',
        routerLink: '/dashboard/dispute'
      },
      {
        label: 'Reviews',
        icon: 'pi pi-star',
        routerLink: '/dashboard/review'
      }
    ];
  }

  getAccountMenuItems(): MenuItem[] {
    return [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        routerLink: '/dashboard/profile'
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        routerLink: '/dashboard/settings'
      },
      {
        separator: true
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
          this.onLogout();
        }
      }
    ];
  }

  onLogout() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to logout?',
      header: 'Confirm Logout',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      accept: () => {
        this.auth.logout();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'You have been logged out successfully.'
        });
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
