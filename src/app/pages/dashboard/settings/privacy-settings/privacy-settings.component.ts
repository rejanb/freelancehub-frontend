// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
// import { ButtonModule } from 'primeng/button';
// import { CardModule } from 'primeng/card';
// import { InputSwitchModule } from 'primeng/inputswitch';
// import { DropdownModule } from 'primeng/dropdown';
// import { DialogModule } from 'primeng/dialog';
// import { MessageService } from 'primeng/api';
// import { SettingsService, PrivacySettings } from '../../../../../service/settings.service';
//
// @Component({
//   selector: 'app-privacy-settings',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     ButtonModule,
//     CardModule,
//     InputSwitchModule,
//     DropdownModule,
//     DialogModule
//   ],
//   providers: [MessageService],
//   template: `
//     <div class="grid">
//       <!-- Profile Privacy -->
//       <div class="col-12 md:col-6">
//         <p-card>
//           <ng-template pTemplate="header">
//             <div class="p-3">
//               <h3 class="m-0">Profile Privacy</h3>
//             </div>
//           </ng-template>
//
//           <form [formGroup]="privacyForm" class="p-fluid">
//             <div class="field">
//               <label for="profile_visibility" class="font-bold">Profile Visibility</label>
//               <p-dropdown
//                 id="profile_visibility"
//                 formControlName="profile_visibility"
//                 [options]="visibilityOptions"
//                 placeholder="Select visibility">
//               </p-dropdown>
//               <small class="text-500">
//                 Control who can view your profile information
//               </small>
//             </div>
//
//             <div class="field">
//               <div class="flex align-items-center justify-content-between">
//                 <label for="show_earnings" class="font-bold">Show Earnings</label>
//                 <p-inputSwitch
//                   id="show_earnings"
//                   formControlName="show_earnings">
//                 </p-inputSwitch>
//               </div>
//               <small class="text-500">
//                 Display your earnings on your public profile
//               </small>
//             </div>
//
//             <div class="field">
//               <div class="flex align-items-center justify-content-between">
//                 <label for="show_portfolio" class="font-bold">Show Portfolio</label>
//                 <p-inputSwitch
//                   id="show_portfolio"
//                   formControlName="show_portfolio">
//                 </p-inputSwitch>
//               </div>
//               <small class="text-500">
//                 Make your portfolio visible to others
//               </small>
//             </div>
//
//             <div class="field">
//               <div class="flex align-items-center justify-content-between">
//                 <label for="show_reviews" class="font-bold">Show Reviews</label>
//                 <p-inputSwitch
//                   id="show_reviews"
//                   formControlName="show_reviews">
//                 </p-inputSwitch>
//               </div>
//               <small class="text-500">
//                 Display reviews on your public profile
//               </small>
//             </div>
//
//             <div class="field">
//               <div class="flex align-items-center justify-content-between">
//                 <label for="show_online_status" class="font-bold">Show Online Status</label>
//                 <p-inputSwitch
//                   id="show_online_status"
//                   formControlName="show_online_status">
//                 </p-inputSwitch>
//               </div>
//               <small class="text-500">
//                 Let others see when you're online
//               </small>
//             </div>
//
//             <div class="field">
//               <div class="flex align-items-center justify-content-between">
//                 <label for="searchable" class="font-bold">Searchable Profile</label>
//                 <p-inputSwitch
//                   id="searchable"
//                   formControlName="searchable">
//                 </p-inputSwitch>
//               </div>
//               <small class="text-500">
//                 Allow your profile to appear in search results
//               </small>
//             </div>
//           </form>
//         </p-card>
//       </div>
//
//       <!-- Data Sharing -->
//       <div class="col-12 md:col-6">
//         <p-card>
//           <ng-template pTemplate="header">
//             <div class="p-3">
//               <h3 class="m-0">Data Sharing</h3>
//             </div>
//           </ng-template>
//
//           <form [formGroup]="privacyForm.get('data_sharing')" class="p-fluid">
//             <div class="field">
//               <div class="flex align-items-center justify-content-between">
//                 <label for="share_profile_data" class="font-bold">Share Profile Data</label>
//                 <p-inputSwitch
//                   id="share_profile_data"
//                   formControlName="share_profile_data">
//                 </p-inputSwitch>
//               </div>
//               <small class="text-500">
//                 Share your profile data with trusted partners
//               </small>
//             </div>
//
//             <div class="field">
//               <div class="flex align-items-center justify-content-between">
//                 <label for="share_usage_data" class="font-bold">Share Usage Data</label>
//                 <p-inputSwitch
//                   id="share_usage_data"
//                   formControlName="share_usage_data">
//                 </p-inputSwitch>
//               </div>
//               <small class="text-500">
//                 Help improve our services by sharing usage data
//               </small>
//             </div>
//
//             <div class="field">
//               <div class="flex align-items-center justify-content-between">
//                 <label for="share_for_recommendations" class="font-bold">Personalized Recommendations</label>
//                 <p-inputSwitch
//                   id="share_for_recommendations"
//                   formControlName="share_for_recommendations">
//                 </p-inputSwitch>
//               </div>
//               <small class="text-500">
//                 Allow us to use your data for personalized job recommendations
//               </small>
//             </div>
//           </form>
//         </p-card>
//       </div>
//
//       <!-- Data Export & Deletion -->
//       <div class="col-12">
//         <p-card>
//           <ng-template pTemplate="header">
//             <div class="p-3">
//               <h3 class="m-0">Data Management</h3>
//             </div>
//           </ng-template>
//
//           <div class="grid">
//             <div class="col-12 md:col-6">
//               <h4>Export Your Data</h4>
//               <p class="text-500 mb-3">
//                 Download a copy of your personal data in a machine-readable format
//               </p>
//               <button
//                 pButton
//                 icon="pi pi-download"
//                 label="Export Data"
//                 [loading]="exporting"
//                 [disabled]="exporting"
//                 (click)="exportData()">
//               </button>
//             </div>
//
//             <div class="col-12 md:col-6">
//               <h4>Account Deletion</h4>
//               <p class="text-500 mb-3">
//                 Permanently delete your account and all associated data
//               </p>
//               <button
//                 pButton
//                 icon="pi pi-trash"
//                 label="Delete Account"
//                 class="p-button-danger"
//                 (click)="showDeleteDialog()">
//               </button>
//             </div>
//           </div>
//         </p-card>
//       </div>
//
//       <!-- Save Button -->
//       <div class="col-12">
//         <div class="flex justify-content-end">
//           <button
//             pButton
//             label="Save Changes"
//             [loading]="saving"
//             [disabled]="saving"
//             (click)="saveSettings()">
//           </button>
//         </div>
//       </div>
//     </div>
//
//     <!-- Delete Account Dialog -->
//     <p-dialog
//       [(visible)]="showConfirmDelete"
//       [modal]="true"
//       [draggable]="false"
//       [resizable]="false"
//       header="Delete Account">
//       <div class="p-fluid">
//         <p class="font-bold text-lg mb-3">Are you sure you want to delete your account?</p>
//         <p class="text-500 mb-4">
//           This action cannot be undone. All your data will be permanently deleted.
//           If you proceed, your account will be scheduled for deletion after a 30-day grace period.
//         </p>
//
//         <div class="field">
//           <label for="deletion_reason" class="font-bold">Please tell us why you're leaving</label>
//           <textarea
//             id="deletion_reason"
//             [(ngModel)]="deletionReason"
//             [rows]="3"
//             class="w-full"
//             placeholder="Your feedback helps us improve our service">
//           </textarea>
//         </div>
//       </div>
//
//       <ng-template pTemplate="footer">
//         <button
//           pButton
//           type="button"
//           label="Cancel"
//           class="p-button-text"
//           (click)="showConfirmDelete = false">
//         </button>
//         <button
//           pButton
//           type="button"
//           label="Delete Account"
//           class="p-button-danger"
//           [loading]="deleting"
//           [disabled]="deleting || !deletionReason"
//           (click)="deleteAccount()">
//         </button>
//       </ng-template>
//     </p-dialog>
//   `
// })
// export class PrivacySettingsComponent implements OnInit {
//   privacyForm!: FormGroup;
//   settings?: PrivacySettings;
//   saving = false;
//   exporting = false;
//   deleting = false;
//   showConfirmDelete = false;
//   deletionReason = '';
//
//   visibilityOptions = [
//     { label: 'Public', value: 'public' },
//     { label: 'Private', value: 'private' },
//     { label: 'Contacts Only', value: 'contacts_only' }
//   ];
//
//   constructor(
//     private fb: FormBuilder,
//     private settingsService: SettingsService,
//     private messageService: MessageService
//   ) {
//     this.initForm();
//   }
//
//   ngOnInit() {
//     this.loadSettings();
//   }
//
//   initForm() {
//     this.privacyForm = this.fb.group({
//       profile_visibility: ['public'],
//       show_earnings: [false],
//       show_portfolio: [true],
//       show_reviews: [true],
//       show_online_status: [true],
//       searchable: [true],
//       data_sharing: this.fb.group({
//         share_profile_data: [false],
//         share_usage_data: [true],
//         share_for_recommendations: [true]
//       })
//     });
//   }
//
//   loadSettings() {
//     this.settingsService.getPrivacySettings().subscribe({
//       next: (settings) => {
//         this.settings = settings;
//         this.privacyForm.patchValue(settings);
//       },
//       error: (error) => {
//         console.error('Error loading privacy settings:', error);
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: 'Failed to load privacy settings'
//         });
//       }
//     });
//   }
//
//   saveSettings() {
//     this.saving = true;
//     this.settingsService.updatePrivacySettings(this.privacyForm.value).subscribe({
//       next: (settings) => {
//         this.settings = settings;
//         this.messageService.add({
//           severity: 'success',
//           summary: 'Success',
//           detail: 'Privacy settings updated successfully'
//         });
//         this.saving = false;
//       },
//       error: (error) => {
//         console.error('Error updating privacy settings:', error);
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: 'Failed to update privacy settings'
//         });
//         this.saving = false;
//       }
//     });
//   }
//
//   exportData() {
//     this.exporting = true;
//     this.settingsService.exportAccountData().subscribe({
//       next: (blob) => {
//         const url = window.URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = 'account-data.zip';
//         link.click();
//         window.URL.revokeObjectURL(url);
//         this.exporting = false;
//       },
//       error: (error) => {
//         console.error('Error exporting data:', error);
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: 'Failed to export data'
//         });
//         this.exporting = false;
//       }
//     });
//   }
//
//   showDeleteDialog() {
//     this.deletionReason = '';
//     this.showConfirmDelete = true;
//   }
//
//   deleteAccount() {
//     this.deleting = true;
//     this.settingsService.requestAccountDeletion(this.deletionReason).subscribe({
//       next: (response) => {
//         this.messageService.add({
//           severity: 'info',
//           summary: 'Account Deletion Scheduled',
//           detail: `Your account will be deleted on ${new Date(response.deletion_date).toLocaleDateString()}`
//         });
//         this.showConfirmDelete = false;
//         this.deleting = false;
//       },
//       error: (error) => {
//         console.error('Error requesting account deletion:', error);
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: 'Failed to schedule account deletion'
//         });
//         this.deleting = false;
//       }
//     });
//   }
// }
