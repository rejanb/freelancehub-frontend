// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { ButtonModule } from 'primeng/button';
// import { CardModule } from 'primeng/card';
// import { InputTextModule } from 'primeng/inputtext';
// import { DropdownModule } from 'primeng/dropdown';
// import { TableModule } from 'primeng/table';
// import { DialogModule } from 'primeng/dialog';
// import { PasswordModule } from 'primeng/password';
// import { MessageService } from 'primeng/api';
// import { SettingsService, SecuritySettings } from '../../../../../service/settings.service';
//
// @Component({
//   selector: 'app-security-settings',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     ButtonModule,
//     CardModule,
//     InputTextModule,
//     DropdownModule,
//     TableModule,
//     DialogModule,
//     PasswordModule
//   ],
//   providers: [MessageService],
//   template: `
//     <div class="grid">
//       <!-- Password Section -->
//       <div class="col-12 md:col-6">
//         <p-card>
//           <ng-template pTemplate="header">
//             <div class="flex justify-content-between align-items-center p-3">
//               <h3 class="m-0">Password</h3>
//               <button
//                 pButton
//                 icon="pi pi-key"
//                 label="Change Password"
//                 class="p-button-secondary"
//                 (click)="showChangePasswordDialog()">
//               </button>
//             </div>
//           </ng-template>
//
//           <div class="mb-3">
//             <label class="font-bold block mb-2">Last Password Change</label>
//             <div>{{ settings?.last_password_change | date:'medium' }}</div>
//           </div>
//
//           <small class="text-500">
//             For security reasons, we recommend changing your password periodically
//           </small>
//         </p-card>
//       </div>
//
//       <!-- Two-Factor Authentication -->
//       <div class="col-12 md:col-6">
//         <p-card>
//           <ng-template pTemplate="header">
//             <div class="flex justify-content-between align-items-center p-3">
//               <h3 class="m-0">Two-Factor Authentication</h3>
//               <button
//                 pButton
//                 [icon]="settings?.two_factor_method === 'none' ? 'pi pi-lock' : 'pi pi-lock-open'"
//                 [label]="settings?.two_factor_method === 'none' ? 'Enable' : 'Disable'"
//                 [class.p-button-danger]="settings?.two_factor_method !== 'none'"
//                 (click)="settings?.two_factor_method === 'none' ? showTwoFactorDialog() : disableTwoFactor()">
//               </button>
//             </div>
//           </ng-template>
//
//           <div class="mb-3">
//             <label class="font-bold block mb-2">Current Method</label>
//             <div class="text-capitalize">{{ settings?.two_factor_method || 'None' }}</div>
//           </div>
//
//           <small class="text-500">
//             Two-factor authentication adds an extra layer of security to your account
//           </small>
//         </p-card>
//       </div>
//
//       <!-- Active Sessions -->
//       <div class="col-12">
//         <p-card>
//           <ng-template pTemplate="header">
//             <div class="p-3">
//               <h3 class="m-0">Active Sessions</h3>
//             </div>
//           </ng-template>
//
//           <p-table [value]="settings?.active_sessions || []" [tableStyle]="{ 'min-width': '50rem' }">
//             <ng-template pTemplate="header">
//               <tr>
//                 <th>Device</th>
//                 <th>Location</th>
//                 <th>Last Active</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </ng-template>
//             <ng-template pTemplate="body" let-session>
//               <tr>
//                 <td>{{ session.device }}</td>
//                 <td>{{ session.location }}</td>
//                 <td>{{ session.last_active | date:'medium' }}</td>
//                 <td>
//                   <span
//                     class="p-badge"
//                     [class.p-badge-success]="session.current"
//                     [class.p-badge-info]="!session.current">
//                     {{ session.current ? 'Current' : 'Active' }}
//                   </span>
//                 </td>
//                 <td>
//                   <button
//                     pButton
//                     icon="pi pi-times"
//                     class="p-button-danger p-button-text"
//                     [disabled]="session.current"
//                     (click)="revokeSession(session.id)">
//                   </button>
//                 </td>
//               </tr>
//             </ng-template>
//           </p-table>
//         </p-card>
//       </div>
//
//       <!-- Login History -->
//       <div class="col-12">
//         <p-card>
//           <ng-template pTemplate="header">
//             <div class="p-3">
//               <h3 class="m-0">Login History</h3>
//             </div>
//           </ng-template>
//
//           <p-table [value]="settings?.login_history || []" [tableStyle]="{ 'min-width': '50rem' }">
//             <ng-template pTemplate="header">
//               <tr>
//                 <th>Date</th>
//                 <th>Device</th>
//                 <th>Location</th>
//                 <th>IP Address</th>
//                 <th>Status</th>
//               </tr>
//             </ng-template>
//             <ng-template pTemplate="body" let-login>
//               <tr>
//                 <td>{{ login.date | date:'medium' }}</td>
//                 <td>{{ login.device }}</td>
//                 <td>{{ login.location }}</td>
//                 <td>{{ login.ip }}</td>
//                 <td>
//                   <span
//                     class="p-badge"
//                     [class.p-badge-success]="login.success"
//                     [class.p-badge-danger]="!login.success">
//                     {{ login.success ? 'Success' : 'Failed' }}
//                   </span>
//                 </td>
//               </tr>
//             </ng-template>
//           </p-table>
//         </p-card>
//       </div>
//     </div>
//
//     <!-- Change Password Dialog -->
//     <p-dialog
//       [(visible)]="showPasswordDialog"
//       [modal]="true"
//       [draggable]="false"
//       [resizable]="false"
//       header="Change Password">
//       <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="p-fluid">
//         <div class="field">
//           <label for="current_password" class="font-bold">Current Password *</label>
//           <p-password
//             id="current_password"
//             formControlName="current_password"
//             [feedback]="false"
//             [toggleMask]="true"
//             [class.ng-invalid]="passwordForm.get('current_password')?.invalid && passwordForm.get('current_password')?.touched">
//           </p-password>
//           <small
//             class="p-error"
//             *ngIf="passwordForm.get('current_password')?.invalid && passwordForm.get('current_password')?.touched">
//             Current password is required
//           </small>
//         </div>
//
//         <div class="field">
//           <label for="new_password" class="font-bold">New Password *</label>
//           <p-password
//             id="new_password"
//             formControlName="new_password"
//             [toggleMask]="true"
//             [class.ng-invalid]="passwordForm.get('new_password')?.invalid && passwordForm.get('new_password')?.touched">
//           </p-password>
//           <small
//             class="p-error"
//             *ngIf="passwordForm.get('new_password')?.invalid && passwordForm.get('new_password')?.touched">
//             Password must be at least 8 characters long with at least one uppercase letter, one lowercase letter, one number, and one special character
//           </small>
//         </div>
//
//         <div class="field">
//           <label for="confirm_password" class="font-bold">Confirm Password *</label>
//           <p-password
//             id="confirm_password"
//             formControlName="confirm_password"
//             [feedback]="false"
//             [toggleMask]="true"
//             [class.ng-invalid]="passwordForm.get('confirm_password')?.invalid && passwordForm.get('confirm_password')?.touched">
//           </p-password>
//           <small
//             class="p-error"
//             *ngIf="passwordForm.get('confirm_password')?.invalid && passwordForm.get('confirm_password')?.touched">
//             Passwords must match
//           </small>
//         </div>
//       </form>
//
//       <ng-template pTemplate="footer">
//         <button
//           pButton
//           type="button"
//           label="Cancel"
//           class="p-button-text"
//           (click)="showPasswordDialog = false">
//         </button>
//         <button
//           pButton
//           type="button"
//           label="Change Password"
//           [loading]="changingPassword"
//           [disabled]="passwordForm.invalid || changingPassword"
//           (click)="changePassword()">
//         </button>
//       </ng-template>
//     </p-dialog>
//
//     <!-- Two-Factor Dialog -->
//     <p-dialog
//       [(visible)]="showTwoFactorDialog"
//       [modal]="true"
//       [draggable]="false"
//       [resizable]="false"
//       header="Enable Two-Factor Authentication">
//       <form [formGroup]="twoFactorForm" class="p-fluid">
//         <div class="field">
//           <label for="method" class="font-bold">Authentication Method *</label>
//           <p-dropdown
//             id="method"
//             formControlName="method"
//             [options]="twoFactorMethods"
//             placeholder="Select method"
//             [class.ng-invalid]="twoFactorForm.get('method')?.invalid && twoFactorForm.get('method')?.touched">
//           </p-dropdown>
//           <small
//             class="p-error"
//             *ngIf="twoFactorForm.get('method')?.invalid && twoFactorForm.get('method')?.touched">
//             Please select an authentication method
//           </small>
//         </div>
//
//         <div class="field" *ngIf="setupRequired">
//           <label for="code" class="font-bold">Verification Code *</label>
//           <input
//             id="code"
//             type="text"
//             pInputText
//             formControlName="code"
//             [class.ng-invalid]="twoFactorForm.get('code')?.invalid && twoFactorForm.get('code')?.touched">
//           <small
//             class="p-error"
//             *ngIf="twoFactorForm.get('code')?.invalid && twoFactorForm.get('code')?.touched">
//             Please enter the verification code
//           </small>
//         </div>
//
//         <div *ngIf="setupData" class="text-center mb-3">
//           <div *ngIf="setupData.qr_code" class="mb-3">
//             <img [src]="setupData.qr_code" alt="QR Code">
//           </div>
//           <div *ngIf="setupData.secret" class="mb-3">
//             <code>{{ setupData.secret }}</code>
//           </div>
//           <small class="text-500">
//             Scan the QR code or enter the secret key in your authenticator app
//           </small>
//         </div>
//       </form>
//
//       <ng-template pTemplate="footer">
//         <button
//           pButton
//           type="button"
//           label="Cancel"
//           class="p-button-text"
//           (click)="showTwoFactorDialog = false">
//         </button>
//         <button
//           pButton
//           type="button"
//           label="Enable"
//           [loading]="enablingTwoFactor"
//           [disabled]="twoFactorForm.invalid || enablingTwoFactor"
//           (click)="enableTwoFactor()">
//         </button>
//       </ng-template>
//     </p-dialog>
//   `,
//   styles: [`
//     :host ::ng-deep {
//       .p-inputtext.ng-invalid.ng-touched {
//         border-color: var(--red-500);
//       }
//       .p-dropdown.ng-invalid.ng-touched .p-dropdown-trigger,
//       .p-dropdown.ng-invalid.ng-touched .p-dropdown-label {
//         border-color: var(--red-500);
//       }
//       .p-badge {
//         border-radius: 12px;
//         padding: 0.25rem 0.5rem;
//         &.p-badge-success {
//           background: var(--green-500);
//         }
//         &.p-badge-danger {
//           background: var(--red-500);
//         }
//         &.p-badge-info {
//           background: var(--blue-500);
//         }
//       }
//     }
//   `]
// })
// export class SecuritySettingsComponent implements OnInit {
//   settings?: SecuritySettings;
//   showPasswordDialog = false;
//   showTwoFactorDialog = false;
//   changingPassword = false;
//   enablingTwoFactor = false;
//   setupRequired = false;
//   setupData: any;
//
//   passwordForm: FormGroup;
//   twoFactorForm: FormGroup;
//
//   twoFactorMethods = [
//     { label: 'Authenticator App', value: 'authenticator' },
//     { label: 'Email', value: 'email' },
//     { label: 'SMS', value: 'sms' }
//   ];
//
//   constructor(
//     private fb: FormBuilder,
//     private settingsService: SettingsService,
//     private messageService: MessageService
//   ) {
//     this.initForms();
//   }
//
//   ngOnInit() {
//     this.loadSettings();
//   }
//
//   initForms() {
//     this.passwordForm = this.fb.group({
//       current_password: ['', [Validators.required]],
//       new_password: ['', [
//         Validators.required,
//         Validators.minLength(8),
//         Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
//       ]],
//       confirm_password: ['', [Validators.required]]
//     }, {
//       validators: this.passwordMatchValidator
//     });
//
//     this.twoFactorForm = this.fb.group({
//       method: ['', [Validators.required]],
//       code: ['']
//     });
//
//     this.twoFactorForm.get('method')?.valueChanges.subscribe(method => {
//       if (method) {
//         this.setupTwoFactor(method);
//       }
//     });
//   }
//
//   passwordMatchValidator(g: FormGroup) {
//     return g.get('new_password')?.value === g.get('confirm_password')?.value
//       ? null
//       : { mismatch: true };
//   }
//
//   loadSettings() {
//     this.settingsService.getSecuritySettings().subscribe({
//       next: (settings) => {
//         this.settings = settings;
//       },
//       error: (error) => {
//         console.error('Error loading security settings:', error);
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: 'Failed to load security settings'
//         });
//       }
//     });
//   }
//
//   showChangePasswordDialog() {
//     this.passwordForm.reset();
//     this.showPasswordDialog = true;
//   }
//
//   changePassword() {
//     if (this.passwordForm.valid) {
//       this.changingPassword = true;
//       const { current_password, new_password } = this.passwordForm.value;
//
//       this.settingsService.changePassword(current_password, new_password).subscribe({
//         next: () => {
//           this.messageService.add({
//             severity: 'success',
//             summary: 'Success',
//             detail: 'Password changed successfully'
//           });
//           this.showPasswordDialog = false;
//           this.changingPassword = false;
//           this.loadSettings();
//         },
//         error: (error) => {
//           console.error('Error changing password:', error);
//           this.messageService.add({
//             severity: 'error',
//             summary: 'Error',
//             detail: 'Failed to change password'
//           });
//           this.changingPassword = false;
//         }
//       });
//     } else {
//       Object.keys(this.passwordForm.controls).forEach(key => {
//         const control = this.passwordForm.get(key);
//         if (control?.invalid) {
//           control.markAsTouched();
//         }
//       });
//     }
//   }
//
//   setupTwoFactor(method: string) {
//     this.enablingTwoFactor = true;
//     this.settingsService.enableTwoFactor(method).subscribe({
//       next: (response) => {
//         this.setupRequired = response.setup_required;
//         this.setupData = response.setup_data;
//
//         if (response.setup_required) {
//           this.twoFactorForm.get('code')?.setValidators([Validators.required]);
//         } else {
//           this.twoFactorForm.get('code')?.clearValidators();
//           this.enableTwoFactor();
//         }
//
//         this.twoFactorForm.get('code')?.updateValueAndValidity();
//         this.enablingTwoFactor = false;
//       },
//       error: (error) => {
//         console.error('Error setting up two-factor:', error);
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: 'Failed to setup two-factor authentication'
//         });
//         this.enablingTwoFactor = false;
//       }
//     });
//   }
//
//   enableTwoFactor() {
//     if (this.twoFactorForm.valid) {
//       this.enablingTwoFactor = true;
//       const code = this.twoFactorForm.get('code')?.value;
//
//       if (this.setupRequired && code) {
//         this.settingsService.verifyTwoFactorSetup(code).subscribe({
//           next: () => {
//             this.messageService.add({
//               severity: 'success',
//               summary: 'Success',
//               detail: 'Two-factor authentication enabled successfully'
//             });
//             this.showTwoFactorDialog = false;
//             this.enablingTwoFactor = false;
//             this.loadSettings();
//           },
//           error: (error) => {
//             console.error('Error verifying two-factor setup:', error);
//             this.messageService.add({
//               severity: 'error',
//               summary: 'Error',
//               detail: 'Failed to verify two-factor setup'
//             });
//             this.enablingTwoFactor = false;
//           }
//         });
//       }
//     } else {
//       Object.keys(this.twoFactorForm.controls).forEach(key => {
//         const control = this.twoFactorForm.get(key);
//         if (control?.invalid) {
//           control.markAsTouched();
//         }
//       });
//     }
//   }
//
//   disableTwoFactor() {
//     this.settingsService.disableTwoFactor().subscribe({
//       next: () => {
//         this.messageService.add({
//           severity: 'success',
//           summary: 'Success',
//           detail: 'Two-factor authentication disabled successfully'
//         });
//         this.loadSettings();
//       },
//       error: (error) => {
//         console.error('Error disabling two-factor:', error);
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: 'Failed to disable two-factor authentication'
//         });
//       }
//     });
//   }
//
//   revokeSession(sessionId: string) {
//     this.settingsService.revokeSession(sessionId).subscribe({
//       next: () => {
//         this.messageService.add({
//           severity: 'success',
//           summary: 'Success',
//           detail: 'Session revoked successfully'
//         });
//         this.loadSettings();
//       },
//       error: (error) => {
//         console.error('Error revoking session:', error);
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: 'Failed to revoke session'
//         });
//       }
//     });
//   }
// }
