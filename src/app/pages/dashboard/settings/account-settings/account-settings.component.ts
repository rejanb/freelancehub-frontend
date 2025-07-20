import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MessageService } from 'primeng/api';
import { SettingsService, AccountSettings } from '../../../../../service/settings.service';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    DropdownModule,
    InputSwitchModule
  ],
  providers: [MessageService],
  template: `
    <div class="grid">
      <div class="col-12">
        <p-card>
          <form [formGroup]="accountForm" (ngSubmit)="onSubmit()" class="p-fluid">
            <!-- Email -->
            <div class="field">
              <label for="email" class="font-bold">Email *</label>
              <div class="p-inputgroup">
                <input 
                  id="email" 
                  type="email" 
                  pInputText 
                  formControlName="email"
                  [class.ng-invalid]="accountForm.get('email')?.invalid && accountForm.get('email')?.touched">
                <button 
                  *ngIf="!settings?.email_verified"
                  pButton 
                  type="button"
                  label="Verify"
                  class="p-button-secondary"
                  [loading]="verifyingEmail"
                  (click)="verifyEmail()">
                </button>
                <button 
                  *ngIf="settings?.email_verified"
                  pButton 
                  type="button"
                  icon="pi pi-check"
                  class="p-button-success"
                  disabled>
                </button>
              </div>
              <small 
                class="p-error" 
                *ngIf="accountForm.get('email')?.invalid && accountForm.get('email')?.touched">
                Valid email is required
              </small>
            </div>

            <!-- Phone -->
            <div class="field">
              <label for="phone" class="font-bold">Phone</label>
              <div class="p-inputgroup">
                <input 
                  id="phone" 
                  type="tel" 
                  pInputText 
                  formControlName="phone"
                  placeholder="+1234567890">
                <button 
                  *ngIf="accountForm.get('phone')?.value && !settings?.phone_verified"
                  pButton 
                  type="button"
                  label="Verify"
                  class="p-button-secondary"
                  [loading]="verifyingPhone"
                  (click)="verifyPhone()">
                </button>
                <button 
                  *ngIf="settings?.phone_verified"
                  pButton 
                  type="button"
                  icon="pi pi-check"
                  class="p-button-success"
                  disabled>
                </button>
              </div>
            </div>

            <!-- Timezone -->
            <div class="field">
              <label for="timezone" class="font-bold">Timezone *</label>
              <p-dropdown
                id="timezone"
                formControlName="timezone"
                [options]="timezones"
                placeholder="Select timezone"
                [class.ng-invalid]="accountForm.get('timezone')?.invalid && accountForm.get('timezone')?.touched">
              </p-dropdown>
              <small 
                class="p-error" 
                *ngIf="accountForm.get('timezone')?.invalid && accountForm.get('timezone')?.touched">
                Timezone is required
              </small>
            </div>

            <!-- Language -->
            <div class="field">
              <label for="language" class="font-bold">Language *</label>
              <p-dropdown
                id="language"
                formControlName="language"
                [options]="languages"
                placeholder="Select language"
                [class.ng-invalid]="accountForm.get('language')?.invalid && accountForm.get('language')?.touched">
              </p-dropdown>
              <small 
                class="p-error" 
                *ngIf="accountForm.get('language')?.invalid && accountForm.get('language')?.touched">
                Language is required
              </small>
            </div>

            <!-- Currency -->
            <div class="field">
              <label for="currency" class="font-bold">Currency *</label>
              <p-dropdown
                id="currency"
                formControlName="currency"
                [options]="currencies"
                placeholder="Select currency"
                [class.ng-invalid]="accountForm.get('currency')?.invalid && accountForm.get('currency')?.touched">
              </p-dropdown>
              <small 
                class="p-error" 
                *ngIf="accountForm.get('currency')?.invalid && accountForm.get('currency')?.touched">
                Currency is required
              </small>
            </div>

            <!-- Profile Visibility -->
            <div class="field">
              <label for="profile_visibility" class="font-bold">Profile Visibility *</label>
              <p-dropdown
                id="profile_visibility"
                formControlName="profile_visibility"
                [options]="visibilityOptions"
                placeholder="Select visibility"
                [class.ng-invalid]="accountForm.get('profile_visibility')?.invalid && accountForm.get('profile_visibility')?.touched">
              </p-dropdown>
              <small 
                class="p-error" 
                *ngIf="accountForm.get('profile_visibility')?.invalid && accountForm.get('profile_visibility')?.touched">
                Profile visibility is required
              </small>
            </div>

            <!-- Available for Hire -->
            <div class="field">
              <div class="flex align-items-center justify-content-between">
                <label for="available_for_hire" class="font-bold">Available for Hire</label>
                <p-inputSwitch
                  id="available_for_hire"
                  formControlName="available_for_hire">
                </p-inputSwitch>
              </div>
              <small class="text-500">
                When enabled, your profile will be shown in search results and you'll receive job recommendations
              </small>
            </div>

            <!-- Profile Completion -->
            <div class="field">
              <label class="font-bold">Profile Completion</label>
              <div class="text-xl font-bold text-primary mb-2">
                {{ settings?.profile_completion }}%
              </div>
              <small class="text-500">
                Complete your profile to increase visibility and get more opportunities
              </small>
            </div>

            <!-- Submit Button -->
            <button 
              pButton 
              type="submit" 
              label="Save Changes"
              [loading]="saving"
              [disabled]="accountForm.invalid || saving">
            </button>
          </form>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      .p-inputtext.ng-invalid.ng-touched {
        border-color: var(--red-500);
      }
      .p-dropdown.ng-invalid.ng-touched .p-dropdown-trigger,
      .p-dropdown.ng-invalid.ng-touched .p-dropdown-label {
        border-color: var(--red-500);
      }
    }
  `]
})
export class AccountSettingsComponent implements OnInit {
  accountForm!: FormGroup;
  settings?: AccountSettings;
  saving = false;
  verifyingEmail = false;
  verifyingPhone = false;

  timezones = [
    { label: '(UTC-12:00) International Date Line West', value: 'Etc/GMT+12' },
    { label: '(UTC-11:00) Coordinated Universal Time-11', value: 'Etc/GMT+11' },
    { label: '(UTC-10:00) Hawaii', value: 'Pacific/Honolulu' },
    { label: '(UTC-09:00) Alaska', value: 'America/Anchorage' },
    { label: '(UTC-08:00) Pacific Time (US & Canada)', value: 'America/Los_Angeles' },
    { label: '(UTC-07:00) Mountain Time (US & Canada)', value: 'America/Denver' },
    { label: '(UTC-06:00) Central Time (US & Canada)', value: 'America/Chicago' },
    { label: '(UTC-05:00) Eastern Time (US & Canada)', value: 'America/New_York' },
    { label: '(UTC-04:00) Atlantic Time (Canada)', value: 'America/Halifax' },
    { label: '(UTC-03:00) Brasilia', value: 'America/Sao_Paulo' },
    { label: '(UTC-02:00) Coordinated Universal Time-02', value: 'Etc/GMT+2' },
    { label: '(UTC-01:00) Cape Verde Is.', value: 'Atlantic/Cape_Verde' },
    { label: '(UTC) Dublin, Edinburgh, Lisbon, London', value: 'Europe/London' },
    { label: '(UTC+01:00) Amsterdam, Berlin, Rome, Paris', value: 'Europe/Paris' },
    { label: '(UTC+02:00) Cairo, Athens', value: 'Europe/Athens' },
    { label: '(UTC+03:00) Moscow, St. Petersburg', value: 'Europe/Moscow' },
    { label: '(UTC+04:00) Abu Dhabi, Dubai', value: 'Asia/Dubai' },
    { label: '(UTC+05:00) Islamabad, Karachi', value: 'Asia/Karachi' },
    { label: '(UTC+06:00) Dhaka', value: 'Asia/Dhaka' },
    { label: '(UTC+07:00) Bangkok, Hanoi', value: 'Asia/Bangkok' },
    { label: '(UTC+08:00) Beijing, Hong Kong', value: 'Asia/Hong_Kong' },
    { label: '(UTC+09:00) Tokyo, Seoul', value: 'Asia/Tokyo' },
    { label: '(UTC+10:00) Sydney', value: 'Australia/Sydney' },
    { label: '(UTC+11:00) Solomon Is.', value: 'Pacific/Guadalcanal' },
    { label: '(UTC+12:00) Auckland, Wellington', value: 'Pacific/Auckland' }
  ];

  languages = [
    { label: 'English', value: 'en' },
    { label: 'Spanish', value: 'es' },
    { label: 'French', value: 'fr' },
    { label: 'German', value: 'de' },
    { label: 'Italian', value: 'it' },
    { label: 'Portuguese', value: 'pt' },
    { label: 'Russian', value: 'ru' },
    { label: 'Chinese', value: 'zh' },
    { label: 'Japanese', value: 'ja' },
    { label: 'Korean', value: 'ko' }
  ];

  currencies = [
    { label: 'US Dollar (USD)', value: 'USD' },
    { label: 'Euro (EUR)', value: 'EUR' },
    { label: 'British Pound (GBP)', value: 'GBP' },
    { label: 'Japanese Yen (JPY)', value: 'JPY' },
    { label: 'Canadian Dollar (CAD)', value: 'CAD' },
    { label: 'Australian Dollar (AUD)', value: 'AUD' },
    { label: 'Swiss Franc (CHF)', value: 'CHF' },
    { label: 'Chinese Yuan (CNY)', value: 'CNY' },
    { label: 'Indian Rupee (INR)', value: 'INR' },
    { label: 'Brazilian Real (BRL)', value: 'BRL' }
  ];

  visibilityOptions = [
    { label: 'Public', value: 'public' },
    { label: 'Private', value: 'private' },
    { label: 'Contacts Only', value: 'contacts_only' }
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
    this.accountForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      timezone: ['', [Validators.required]],
      language: ['', [Validators.required]],
      currency: ['', [Validators.required]],
      profile_visibility: ['', [Validators.required]],
      available_for_hire: [false]
    });
  }

  loadSettings() {
    this.settingsService.getAccountSettings().subscribe({
      next: (settings) => {
        this.settings = settings;
        this.accountForm.patchValue(settings);
      },
      error: (error) => {
        console.error('Error loading account settings:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load account settings'
        });
      }
    });
  }

  verifyEmail() {
    this.verifyingEmail = true;
    this.settingsService.requestEmailVerification().subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Verification email sent. Please check your inbox.'
        });
        this.verifyingEmail = false;
      },
      error: (error) => {
        console.error('Error requesting email verification:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to send verification email'
        });
        this.verifyingEmail = false;
      }
    });
  }

  verifyPhone() {
    if (!this.accountForm.get('phone')?.value) return;

    this.verifyingPhone = true;
    this.settingsService.requestPhoneVerification(this.accountForm.get('phone')?.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Verification code sent to your phone'
        });
        this.verifyingPhone = false;
      },
      error: (error) => {
        console.error('Error requesting phone verification:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to send verification code'
        });
        this.verifyingPhone = false;
      }
    });
  }

  onSubmit() {
    if (this.accountForm.valid) {
      this.saving = true;
      this.settingsService.updateAccountSettings(this.accountForm.value).subscribe({
        next: (settings) => {
          this.settings = settings;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Account settings updated successfully'
          });
          this.saving = false;
        },
        error: (error) => {
          console.error('Error updating account settings:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update account settings'
          });
          this.saving = false;
        }
      });
    } else {
      Object.keys(this.accountForm.controls).forEach(key => {
        const control = this.accountForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
} 