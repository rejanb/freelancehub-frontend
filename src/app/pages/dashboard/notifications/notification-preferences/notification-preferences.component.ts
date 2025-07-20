import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { NotificationService, NotificationPreferences } from '../../../../../service/notification.service';

@Component({
  selector: 'app-notification-preferences',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputSwitchModule,
    DropdownModule
  ],
  providers: [MessageService],
  template: `
    <div class="grid">
      <div class="col-12 md:col-8 md:col-offset-2">
        <p-card>
          <!-- Header -->
          <div class="flex justify-content-between align-items-center mb-4">
            <h2 class="m-0">Notification Preferences</h2>
            <button 
              pButton 
              icon="pi pi-arrow-left" 
              label="Back"
              class="p-button-text"
              routerLink="/dashboard/notifications">
            </button>
          </div>

          <!-- General Settings -->
          <div class="mb-4">
            <h3>General Settings</h3>
            <div class="grid">
              <div class="col-12 md:col-6">
                <div class="flex align-items-center justify-content-between p-3 border-round surface-ground">
                  <div>
                    <label class="block font-medium mb-2">Email Notifications</label>
                    <small class="text-500">Receive notifications via email</small>
                  </div>
                  <p-inputSwitch 
                    [(ngModel)]="preferences.email_notifications"
                    (onChange)="savePreferences()">
                  </p-inputSwitch>
                </div>
              </div>

              <div class="col-12 md:col-6">
                <div class="flex align-items-center justify-content-between p-3 border-round surface-ground">
                  <div>
                    <label class="block font-medium mb-2">Push Notifications</label>
                    <small class="text-500">Receive browser push notifications</small>
                  </div>
                  <p-inputSwitch 
                    [(ngModel)]="preferences.push_notifications"
                    (onChange)="onPushToggle()">
                  </p-inputSwitch>
                </div>
              </div>

              <div class="col-12" *ngIf="preferences.email_notifications">
                <div class="flex align-items-center justify-content-between p-3 border-round surface-ground">
                  <div>
                    <label class="block font-medium mb-2">Email Frequency</label>
                    <small class="text-500">How often you want to receive email notifications</small>
                  </div>
                  <p-dropdown
                    [(ngModel)]="preferences.email_frequency"
                    [options]="frequencyOptions"
                    (onChange)="savePreferences()"
                    class="w-10rem">
                  </p-dropdown>
                </div>
              </div>
            </div>
          </div>

          <!-- Notification Types -->
          <div class="mb-4">
            <h3>Notification Types</h3>
            <div class="grid">
              <div class="col-12 md:col-6">
                <div class="flex align-items-center justify-content-between p-3 border-round surface-ground">
                  <div>
                    <label class="block font-medium mb-2">Job Alerts</label>
                    <small class="text-500">New jobs matching your skills</small>
                  </div>
                  <p-inputSwitch 
                    [(ngModel)]="preferences.notification_types.job_alerts"
                    (onChange)="savePreferences()">
                  </p-inputSwitch>
                </div>
              </div>

              <div class="col-12 md:col-6">
                <div class="flex align-items-center justify-content-between p-3 border-round surface-ground">
                  <div>
                    <label class="block font-medium mb-2">Proposal Updates</label>
                    <small class="text-500">Updates on your proposals</small>
                  </div>
                  <p-inputSwitch 
                    [(ngModel)]="preferences.notification_types.proposal_updates"
                    (onChange)="savePreferences()">
                  </p-inputSwitch>
                </div>
              </div>

              <div class="col-12 md:col-6">
                <div class="flex align-items-center justify-content-between p-3 border-round surface-ground">
                  <div>
                    <label class="block font-medium mb-2">Contract Updates</label>
                    <small class="text-500">Changes to your contracts</small>
                  </div>
                  <p-inputSwitch 
                    [(ngModel)]="preferences.notification_types.contract_updates"
                    (onChange)="savePreferences()">
                  </p-inputSwitch>
                </div>
              </div>

              <div class="col-12 md:col-6">
                <div class="flex align-items-center justify-content-between p-3 border-round surface-ground">
                  <div>
                    <label class="block font-medium mb-2">Payment Alerts</label>
                    <small class="text-500">Payment and transaction updates</small>
                  </div>
                  <p-inputSwitch 
                    [(ngModel)]="preferences.notification_types.payment_alerts"
                    (onChange)="savePreferences()">
                  </p-inputSwitch>
                </div>
              </div>

              <div class="col-12 md:col-6">
                <div class="flex align-items-center justify-content-between p-3 border-round surface-ground">
                  <div>
                    <label class="block font-medium mb-2">Messages</label>
                    <small class="text-500">New messages from clients/freelancers</small>
                  </div>
                  <p-inputSwitch 
                    [(ngModel)]="preferences.notification_types.messages"
                    (onChange)="savePreferences()">
                  </p-inputSwitch>
                </div>
              </div>

              <div class="col-12 md:col-6">
                <div class="flex align-items-center justify-content-between p-3 border-round surface-ground">
                  <div>
                    <label class="block font-medium mb-2">Reviews</label>
                    <small class="text-500">New reviews and ratings</small>
                  </div>
                  <p-inputSwitch 
                    [(ngModel)]="preferences.notification_types.reviews"
                    (onChange)="savePreferences()">
                  </p-inputSwitch>
                </div>
              </div>

              <div class="col-12 md:col-6">
                <div class="flex align-items-center justify-content-between p-3 border-round surface-ground">
                  <div>
                    <label class="block font-medium mb-2">System Alerts</label>
                    <small class="text-500">Important system notifications</small>
                  </div>
                  <p-inputSwitch 
                    [(ngModel)]="preferences.notification_types.system_alerts"
                    (onChange)="savePreferences()">
                  </p-inputSwitch>
                </div>
              </div>
            </div>
          </div>

          <!-- Test Notifications -->
          <div class="flex justify-content-end">
            <button 
              pButton 
              label="Test Notifications"
              icon="pi pi-bell"
              (click)="testNotifications()">
            </button>
          </div>
        </p-card>
      </div>
    </div>
  `
})
export class NotificationPreferencesComponent implements OnInit {
  preferences: NotificationPreferences = {
    email_notifications: true,
    push_notifications: false,
    notification_types: {
      job_alerts: true,
      proposal_updates: true,
      contract_updates: true,
      payment_alerts: true,
      messages: true,
      reviews: true,
      system_alerts: true
    },
    email_frequency: 'instant'
  };

  frequencyOptions = [
    { label: 'Instant', value: 'instant' },
    { label: 'Daily Digest', value: 'daily' },
    { label: 'Weekly Digest', value: 'weekly' },
    { label: 'Never', value: 'never' }
  ];

  constructor(
    private notificationService: NotificationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadPreferences();
  }

  loadPreferences() {
    this.notificationService.getPreferences().subscribe({
      next: (preferences) => {
        this.preferences = preferences;
      },
      error: (error) => {
        console.error('Error loading preferences:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load notification preferences'
        });
      }
    });
  }

  savePreferences() {
    this.notificationService.updatePreferences(this.preferences).subscribe({
      next: (preferences) => {
        this.preferences = preferences;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Preferences saved successfully'
        });
      },
      error: (error) => {
        console.error('Error saving preferences:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save preferences'
        });
      }
    });
  }

  async onPushToggle() {
    if (this.preferences.push_notifications) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY'
          });

          this.notificationService.subscribePushNotifications(subscription).subscribe({
            next: () => {
              this.savePreferences();
            },
            error: (error) => {
              console.error('Error subscribing to push notifications:', error);
              this.preferences.push_notifications = false;
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to enable push notifications'
              });
            }
          });
        } else {
          this.preferences.push_notifications = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Push notification permission denied'
          });
        }
      } catch (error) {
        console.error('Error setting up push notifications:', error);
        this.preferences.push_notifications = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to set up push notifications'
        });
      }
    } else {
      this.notificationService.unsubscribePushNotifications().subscribe({
        next: () => {
          this.savePreferences();
        },
        error: (error) => {
          console.error('Error unsubscribing from push notifications:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to disable push notifications'
          });
        }
      });
    }
  }

  testNotifications() {
    this.notificationService.testNotification().subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Test notification sent'
        });
      },
      error: (error) => {
        console.error('Error sending test notification:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to send test notification'
        });
      }
    });
  }
} 