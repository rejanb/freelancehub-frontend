import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { SettingsService, NotificationSettings } from '../../../../../service/settings.service';

@Component({
  selector: 'app-notification-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputSwitchModule,
    DropdownModule
  ],
  providers: [MessageService],
  template: `
    <div class="grid">
      <!-- Email Notifications -->
      <div class="col-12 md:col-6">
        <p-card>
          <ng-template pTemplate="header">
            <div class="p-3">
              <h3 class="m-0">Email Notifications</h3>
            </div>
          </ng-template>

          <form [formGroup]="notificationForm.get('email_notifications')" class="p-fluid">
            <div class="field" *ngFor="let option of notificationOptions">
              <div class="flex align-items-center justify-content-between">
                <label [for]="'email_' + option.key" class="font-bold">{{ option.label }}</label>
                <p-inputSwitch 
                  [id]="'email_' + option.key"
                  [formControlName]="option.key">
                </p-inputSwitch>
              </div>
              <small class="text-500">{{ option.description }}</small>
            </div>
          </form>
        </p-card>
      </div>

      <!-- Push Notifications -->
      <div class="col-12 md:col-6">
        <p-card>
          <ng-template pTemplate="header">
            <div class="p-3">
              <h3 class="m-0">Push Notifications</h3>
            </div>
          </ng-template>

          <form [formGroup]="notificationForm.get('push_notifications')" class="p-fluid">
            <div class="field" *ngFor="let option of notificationOptions">
              <div class="flex align-items-center justify-content-between">
                <label [for]="'push_' + option.key" class="font-bold">{{ option.label }}</label>
                <p-inputSwitch 
                  [id]="'push_' + option.key"
                  [formControlName]="option.key">
                </p-inputSwitch>
              </div>
              <small class="text-500">{{ option.description }}</small>
            </div>
          </form>
        </p-card>
      </div>

      <!-- Notification Frequency -->
      <div class="col-12">
        <p-card>
          <ng-template pTemplate="header">
            <div class="p-3">
              <h3 class="m-0">Notification Frequency</h3>
            </div>
          </ng-template>

          <form [formGroup]="notificationForm" class="p-fluid">
            <div class="field">
              <label for="notification_frequency" class="font-bold">Email Digest Frequency</label>
              <p-dropdown
                id="notification_frequency"
                formControlName="notification_frequency"
                [options]="frequencyOptions"
                placeholder="Select frequency">
              </p-dropdown>
              <small class="text-500">
                Choose how often you want to receive email digests summarizing your notifications
              </small>
            </div>
          </form>
        </p-card>
      </div>

      <!-- Save Button -->
      <div class="col-12">
        <div class="flex justify-content-end">
          <button 
            pButton 
            label="Save Changes"
            [loading]="saving"
            [disabled]="saving"
            (click)="saveSettings()">
          </button>
        </div>
      </div>
    </div>
  `
})
export class NotificationSettingsComponent implements OnInit {
  notificationForm!: FormGroup;
  settings?: NotificationSettings;
  saving = false;

  notificationOptions = [
    {
      key: 'new_messages',
      label: 'New Messages',
      description: 'Get notified when you receive new messages'
    },
    {
      key: 'job_alerts',
      label: 'Job Alerts',
      description: 'Receive notifications about new jobs matching your skills'
    },
    {
      key: 'proposal_updates',
      label: 'Proposal Updates',
      description: 'Get updates about your submitted proposals'
    },
    {
      key: 'contract_updates',
      label: 'Contract Updates',
      description: 'Receive notifications about contract changes and milestones'
    },
    {
      key: 'payment_updates',
      label: 'Payment Updates',
      description: 'Get notified about payments and financial transactions'
    },
    {
      key: 'review_received',
      label: 'Reviews',
      description: 'Receive notifications when you get new reviews'
    },
    {
      key: 'dispute_updates',
      label: 'Dispute Updates',
      description: 'Get updates about disputes you are involved in'
    },
    {
      key: 'platform_updates',
      label: 'Platform Updates',
      description: 'Receive important updates about the platform'
    },
    {
      key: 'marketing_emails',
      label: 'Marketing Emails',
      description: 'Receive promotional emails and special offers'
    }
  ];

  frequencyOptions = [
    { label: 'Instant', value: 'instant' },
    { label: 'Hourly', value: 'hourly' },
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' }
  ];

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private messageService: MessageService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.loadSettings();
  }

  initForm() {
    this.notificationForm = this.fb.group({
      email_notifications: this.fb.group(
        this.notificationOptions.reduce((acc, option) => ({
          ...acc,
          [option.key]: [false]
        }), {})
      ),
      push_notifications: this.fb.group(
        this.notificationOptions.reduce((acc, option) => ({
          ...acc,
          [option.key]: [false]
        }), {})
      ),
      notification_frequency: ['instant']
    });
  }

  loadSettings() {
    this.settingsService.getNotificationSettings().subscribe({
      next: (settings) => {
        this.settings = settings;
        this.notificationForm.patchValue(settings);
      },
      error: (error) => {
        console.error('Error loading notification settings:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load notification settings'
        });
      }
    });
  }

  saveSettings() {
    this.saving = true;
    this.settingsService.updateNotificationSettings(this.notificationForm.value).subscribe({
      next: (settings) => {
        this.settings = settings;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Notification settings updated successfully'
        });
        this.saving = false;
      },
      error: (error) => {
        console.error('Error updating notification settings:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update notification settings'
        });
        this.saving = false;
      }
    });
  }
} 