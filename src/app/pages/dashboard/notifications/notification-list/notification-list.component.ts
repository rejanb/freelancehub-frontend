import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NotificationService, Notification } from '../../../../../service/notification.service';
import { TokenService } from '../../../../utils/token.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,
    CardModule,
    TabViewModule,
    DropdownModule,
    CalendarModule,
    BadgeModule,
    MenuModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="grid">
      <div class="col-12">
        <p-card>
          <!-- Header -->
          <div class="flex justify-content-between align-items-center mb-4">
            <div class="flex align-items-center gap-3">
              <h2 class="m-0">Notifications</h2>
              <p-badge 
                *ngIf="unreadCount > 0"
                [value]="unreadCount.toString()"
                severity="danger">
              </p-badge>
            </div>
            <div class="flex gap-2">
              <button 
                pButton 
                icon="pi pi-cog" 
                label="Preferences"
                class="p-button-text"
                routerLink="preferences">
              </button>
              <button 
                pButton 
                icon="pi pi-ellipsis-v"
                class="p-button-text"
                (click)="menu.toggle($event)">
              </button>
              <p-menu #menu [popup]="true" [model]="menuItems"></p-menu>
            </div>
          </div>

          <!-- Filters -->
          <div class="flex gap-2 mb-4">
            <p-dropdown
              [options]="typeOptions"
              [(ngModel)]="filters.type"
              placeholder="Filter by type"
              [showClear]="true"
              (onChange)="loadNotifications()"
              class="w-full md:w-15rem">
            </p-dropdown>

            <p-calendar
              [(ngModel)]="dateRange"
              selectionMode="range"
              [showButtonBar]="true"
              placeholder="Date range"
              (onSelect)="onDateSelect()"
              class="w-full md:w-15rem">
            </p-calendar>
          </div>

          <!-- Notifications -->
          <div class="notifications-container">
            <div *ngFor="let notification of notifications" class="notification-item">
              <div 
                class="p-3 border-round mb-2 cursor-pointer"
                [class.surface-hover]="!notification.is_read"
                [class.surface-ground]="notification.is_read"
                (click)="onNotificationClick(notification)">
                
                <!-- Icon -->
                <div class="flex align-items-start gap-3">
                  <i 
                    class="pi text-xl"
                    [class.pi-info-circle]="notification.type === 'system'"
                    [class.pi-briefcase]="notification.type === 'job'"
                    [class.pi-file]="notification.type === 'proposal'"
                    [class.pi-file-edit]="notification.type === 'contract'"
                    [class.pi-money-bill]="notification.type === 'payment'"
                    [class.pi-envelope]="notification.type === 'message'"
                    [class.pi-star]="notification.type === 'review'">
                  </i>

                  <!-- Content -->
                  <div class="flex-1">
                    <div class="flex justify-content-between align-items-start">
                      <span 
                        class="font-medium"
                        [class.text-primary]="!notification.is_read">
                        {{ notification.title }}
                      </span>
                      <small class="text-500">
                        {{ notification.created_at | date:'shortTime' }}
                      </small>
                    </div>
                    <p class="line-height-3 my-2">{{ notification.message }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div *ngIf="notifications.length === 0" class="text-center p-5">
              <i class="pi pi-bell text-6xl text-500 mb-3"></i>
              <h3>No Notifications</h3>
              <p class="text-500">You're all caught up!</p>
            </div>
          </div>
        </p-card>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <p-confirmDialog 
      header="Confirm Action" 
      icon="pi pi-exclamation-triangle"
      [style]="{ width: '450px' }">
    </p-confirmDialog>
  `,
  styles: [`
    :host ::ng-deep {
      .notifications-container {
        max-height: calc(100vh - 20rem);
        overflow-y: auto;
      }
      .notification-item:last-child {
        margin-bottom: 0;
      }
    }
  `]
})
export class NotificationListComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount = 0;
  loading = false;
  dateRange: Date[] = [];
  notificationSubscription?: Subscription;
  unreadCountSubscription?: Subscription;

  filters = {
    type: '',
    is_read: undefined,
    start_date: '',
    end_date: '',
    page: 1,
    page_size: 20
  };

  typeOptions = [
    { label: 'All', value: '' },
    { label: 'Jobs', value: 'job' },
    { label: 'Proposals', value: 'proposal' },
    { label: 'Contracts', value: 'contract' },
    { label: 'Payments', value: 'payment' },
    { label: 'Messages', value: 'message' },
    { label: 'Reviews', value: 'review' },
    { label: 'System', value: 'system' }
  ];

  menuItems: MenuItem[] = [
    {
      label: 'Mark All as Read',
      icon: 'pi pi-check',
      command: () => this.markAllAsRead()
    },
    {
      label: 'Clear All',
      icon: 'pi pi-trash',
      command: () => this.confirmClearAll()
    }
  ];

  constructor(
    private notificationService: NotificationService,
    private tokenService: TokenService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.setupWebSocket();
    this.subscribeToNotifications();
    this.loadNotifications();
  }

  ngOnDestroy() {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
    if (this.unreadCountSubscription) {
      this.unreadCountSubscription.unsubscribe();
    }
    this.notificationService.disconnectWebSocket();
  }

  setupWebSocket() {
    const currentUser = this.tokenService.getCurrentUser();
    const token = this.tokenService.getToken();
    
    if (currentUser?.id && token) {
      this.notificationService.connectWebSocket(currentUser.id, token);
    }
  }

  subscribeToNotifications() {
    this.notificationSubscription = this.notificationService.notifications$.subscribe(notifications => {
      if (notifications.length > 0) {
        this.loadNotifications();
      }
    });

    this.unreadCountSubscription = this.notificationService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    });
  }

  loadNotifications() {
    this.loading = true;
    this.notificationService.getNotifications(this.filters).subscribe({
      next: (response) => {
        this.notifications = response.results;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load notifications'
        });
        this.loading = false;
      }
    });
  }

  onDateSelect() {
    if (this.dateRange && this.dateRange.length === 2) {
      const [start, end] = this.dateRange;
      this.filters.start_date = start.toISOString();
      this.filters.end_date = end.toISOString();
      this.loadNotifications();
    }
  }

  onNotificationClick(notification: Notification) {
    if (!notification.is_read) {
      this.notificationService.markAsRead(notification.id).subscribe({
        next: () => {
          notification.is_read = true;
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        },
        error: (error) => {
          console.error('Error marking notification as read:', error);
        }
      });
    }

    if (notification.link) {
      window.location.href = notification.link;
    }
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.is_read = true);
        this.unreadCount = 0;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'All notifications marked as read'
        });
      },
      error: (error) => {
        console.error('Error marking all notifications as read:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to mark all notifications as read'
        });
      }
    });
  }

  confirmClearAll() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to clear all notifications? This action cannot be undone.',
      accept: () => this.clearAllNotifications()
    });
  }

  clearAllNotifications() {
    this.notificationService.clearAllNotifications().subscribe({
      next: () => {
        this.notifications = [];
        this.unreadCount = 0;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'All notifications cleared'
        });
      },
      error: (error) => {
        console.error('Error clearing notifications:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to clear notifications'
        });
      }
    });
  }
} 