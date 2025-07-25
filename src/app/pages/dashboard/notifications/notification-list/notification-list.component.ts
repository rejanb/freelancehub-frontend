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
import { TooltipModule } from 'primeng/tooltip';
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
    TooltipModule,
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
                icon="pi pi-check-circle" 
                label="Mark All Read"
                class="p-button-success p-button-sm"
                (click)="markAllAsRead()"
                [disabled]="unreadCount === 0">
              </button>
              <button 
                pButton 
                icon="pi pi-trash" 
                label="Clear All"
                class="p-button-danger p-button-sm"
                (click)="confirmClearAll()"
                [disabled]="!notifications || notifications.length === 0">
              </button>
              <button 
                pButton 
                icon="pi pi-ellipsis-v"
                class="p-button-text p-button-sm"
                (click)="menu.toggle($event)">
              </button>
              <p-menu #menu [popup]="true" [model]="menuItems"></p-menu>
            </div>
          </div>

          <!-- Filters and Actions -->
          <div class="flex justify-content-between align-items-center gap-2 mb-4">
            <div class="flex gap-2">
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
            
            <div class="flex align-items-center gap-2">
              <span *ngIf="unreadCount > 0" class="text-primary font-medium">
                {{ unreadCount }} unread
              </span>
              <button 
                pButton 
                icon="pi pi-refresh" 
                class="p-button-text p-button-sm"
                (click)="loadNotifications()"
                [loading]="loading"
                title="Refresh notifications">
              </button>
            </div>
          </div>

          <!-- Notifications -->
          <div class="notifications-container">
            <div *ngFor="let notification of notifications" class="notification-item">
              <div 
                class="p-3 border-round mb-2 cursor-pointer"
                [class.surface-hover]="!notification.read_at"
                [class.surface-ground]="notification.read_at"
                (click)="onNotificationClick(notification)">
                
                <!-- Icon -->
                <div class="flex align-items-start gap-3">
                  <i 
                    class="pi text-xl"
                    [class.pi-info-circle]="notification.notification_type === 'system' || notification.notification_type === 'info'"
                    [class.pi-briefcase]="notification.notification_type === 'job'"
                    [class.pi-file]="notification.notification_type === 'proposal'"
                    [class.pi-file-edit]="notification.notification_type === 'contract'"
                    [class.pi-money-bill]="notification.notification_type === 'payment'"
                    [class.pi-envelope]="notification.notification_type === 'message'"
                    [class.pi-star]="notification.notification_type === 'review'"
                    [class.pi-check-circle]="notification.notification_type === 'success'"
                    [class.pi-exclamation-triangle]="notification.notification_type === 'warning'"
                    [class.pi-times-circle]="notification.notification_type === 'error'">
                  </i>

                  <!-- Content -->
                  <div class="flex-1">
                    <div class="flex justify-content-between align-items-start">
                      <span 
                        class="font-medium"
                        [class.text-primary]="!notification.read_at">
                        {{ notification.title }}
                      </span>
                      <div class="flex align-items-center gap-2">
                        <small class="text-500">
                          {{ notification.created_at | date:'shortTime' }}
                        </small>
                        <button
                          *ngIf="!notification.read_at"
                          pButton
                          icon="pi pi-check"
                          class="p-button-text p-button-sm p-button-success"
                          (click)="markSingleAsRead(notification, $event)"
                          title="Mark as read">
                        </button>
                        <button
                          pButton
                          icon="pi pi-trash"
                          class="p-button-text p-button-sm p-button-danger"
                          (click)="deleteSingleNotification(notification, $event)"
                          title="Delete notification">
                        </button>
                      </div>
                    </div>
                    <p class="line-height-3 my-2">{{ notification.message }}</p>
                    <div *ngIf="notification.action_text && notification.action_url" class="mt-2">
                      <button 
                        pButton 
                        [label]="notification.action_text"
                        class="p-button-link p-button-sm"
                        (click)="onActionClick(notification, $event)">
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div *ngIf="!notifications || notifications.length === 0" class="text-center p-5">
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
      // Update the local notifications array with real-time data
      this.notifications = notifications || [];
    });

    this.unreadCountSubscription = this.notificationService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    });
  }

  loadNotifications() {
    this.loading = true;
    this.notificationService.getNotifications(this.filters).subscribe({
      next: (response) => {
        // Handle both paginated and non-paginated responses
        const results = response.results || response || [];
        this.notifications = results;
        // Update the service's notification state
        this.notificationService.updateNotifications(results);
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
    if (!notification.read_at) {
      this.notificationService.markAsRead(notification.id).subscribe({
        next: () => {
          notification.read_at = new Date().toISOString();
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        },
        error: (error) => {
          console.error('Error marking notification as read:', error);
        }
      });
    }

    if (notification.action_url) {
      window.location.href = notification.action_url;
    }
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.read_at = new Date().toISOString());
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

  markSingleAsRead(notification: Notification, event: Event) {
    event.stopPropagation();
    this.notificationService.markAsRead(notification.id).subscribe({
      next: () => {
        notification.read_at = new Date().toISOString();
        this.unreadCount = Math.max(0, this.unreadCount - 1);
        
        // Update the notification in the service state
        const notifications = this.notificationService.getCurrentNotifications();
        const index = notifications.findIndex((n: Notification) => n.id === notification.id);
        if (index !== -1) {
          notifications[index] = { ...notification };
          this.notificationService.updateNotifications(notifications);
        }
        
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Notification marked as read'
        });
      },
      error: (error) => {
        console.error('Error marking notification as read:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to mark notification as read'
        });
      }
    });
  }

  deleteSingleNotification(notification: Notification, event: Event) {
    event.stopPropagation();
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this notification?',
      accept: () => {
        this.notificationService.deleteNotification(notification.id).subscribe({
          next: () => {
            this.notifications = this.notifications.filter(n => n.id !== notification.id);
            if (!notification.read_at) {
              this.unreadCount = Math.max(0, this.unreadCount - 1);
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Notification deleted'
            });
          },
          error: (error) => {
            console.error('Error deleting notification:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete notification'
            });
          }
        });
      }
    });
  }

  onActionClick(notification: Notification, event: Event) {
    event.stopPropagation();
    if (notification.action_url) {
      window.location.href = notification.action_url;
    }
  }
} 