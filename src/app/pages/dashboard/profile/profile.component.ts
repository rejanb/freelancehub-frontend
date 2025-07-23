import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  ReactiveFormsModule,
  FormsModule,
  Validators
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';
import { MessageModule } from 'primeng/message';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TokenService } from '../../../utils/token.service';
import { AuthService } from '../../../service/auth.service';
import { UserService, UserProfile } from '../../../../service/user.service';
import { CurrentUser } from '../../../model/models';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    FileUploadModule,
    CardModule,
    DividerModule,
    AvatarModule,
    MessageModule,
    ChipModule,
    TagModule,
    ToastModule,
    DialogModule
  ],
  providers: [MessageService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  currentUser: CurrentUser | null = null;
  userProfile: UserProfile | null = null;
  isLoading = false;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  newSkill = '';
  showChangePasswordDialog = false;
  showDeleteConfirmDialog = false;
  changePasswordForm!: FormGroup;
  changingPassword = false;
  deletingAccount = false;

  constructor(
    private fb: FormBuilder,
    private tokenService: TokenService,
    private authService: AuthService,
    private userService: UserService,
    private messageService: MessageService
  ) {}

//   V      this.userService.updateUserProfile(updateData).subscribe({
//                                                                     next: (updatedProfile: UserProfile) => {
//   this.isLoading = false;
//   this.userProfile = updatedProfile;
//   this.selectedFile = null;
//   this.previewUrl = null; // Clear preview after successful save
//
//   // Update current user data in localStorage with new profile picture
//   const currentUser = this.tokenService.getCurrentUser();
//   if (currentUser) {
//     const updatedCurrentUser = {
//       ...currentUser,
//       profile_picture: updatedProfile.profile_picture
//     };
//     this.tokenService.setLocal('user', updatedCurrentUser);
//   }
//
//   this.messageService.add({
//                             severity: 'success',
//                             summary: 'Success',
//                             detail: 'Profile updated successfully!'
//                           });
// }
  ngOnInit() {
    this.currentUser = this.tokenService.getCurrentUser();
    this.initializeForm();
    this.loadUserProfile();
    this.changePasswordForm = this.fb.group({
      current_password: ['', Validators.required],
      new_password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', Validators.required]
    });
  }

  initializeForm() {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      bio: ['', [Validators.maxLength(500)]],
      skills: this.fb.array([])
    });
  }

  // Getter for skills FormArray
  get skills(): FormArray {
    return this.profileForm.get('skills') as FormArray;
  }

  get skillControls(): FormControl[] {
    return this.skills.controls as FormControl[];
  }

  loadUserProfile() {
    this.isLoading = true;
    console.log('Loading user profile...');
    this.userService.getUserProfile().subscribe({
      next: (profile: UserProfile) => {
        console.log('Loaded user profile:', profile);
        console.log('Profile picture URL:', profile.profile_picture);
        this.userProfile = profile;
        this.profileForm.patchValue({
          username: profile.username,
          email: profile.email,
          bio: profile.bio || ''
        });

        // Add skills to FormArray
        this.skills.clear();
        if (profile.skills && profile.skills.length > 0) {
          profile.skills.forEach(skill => {
            this.skills.push(this.fb.control(skill, Validators.required));
          });
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load user profile'
        });
        console.error('Error loading user profile:', error);
      }
    });
  }

  addSkill() {
    if (this.newSkill.trim()) {
      this.skills.push(this.fb.control(this.newSkill.trim(), Validators.required));
      this.newSkill = '';
    }
  }

  removeSkill(index: number) {
    this.skills.removeAt(index);
  }

  onFileSelect(event: any) {
    if (event.files && event.files.length > 0) {
      this.selectedFile = event.files[0];

      // Create preview URL
      if (this.selectedFile) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewUrl = e.target.result;
        };
        reader.readAsDataURL(this.selectedFile);

        console.log('File selected:', this.selectedFile.name);
      }
    }
  }

  clearSelectedFile() {
    this.selectedFile = null;
    this.previewUrl = null;
    console.log('Selected file cleared');
  }

  onSave() {
    if (this.profileForm.valid) {
      this.isLoading = true;

      const updateData = {
        username: this.profileForm.get('username')?.value,
        email: this.profileForm.get('email')?.value,
        bio: this.profileForm.get('bio')?.value || '',
        skills: this.skills.value,
        ...(this.selectedFile && { profile_picture: this.selectedFile })
      };

      this.userService.updateUserProfile(updateData).subscribe({
        next: (updatedProfile: UserProfile) => {
          this.isLoading = false;
          this.userProfile = updatedProfile;
          this.selectedFile = null;
          this.previewUrl = null; // Clear preview after successful save

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Profile updated successfully!'
          });

          // Update stored user data
          if (this.currentUser) {
            this.currentUser.name = updatedProfile.username;
            this.currentUser.email = updatedProfile.email;
            this.tokenService.setLocal('user', this.currentUser);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to update profile'
          });
          console.error('Error updating profile:', error);
        }
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all required fields correctly.'
      });
    }
  }

  onChangePassword() {
    console.log('onChangePassword called');
    alert('Change Password button clicked!'); // Temporary debug alert
    this.showChangePasswordDialog = true;
    this.changePasswordForm.reset();
    console.log('showChangePasswordDialog set to:', this.showChangePasswordDialog);
  }

  submitChangePassword() {
    if (this.changePasswordForm.invalid) return;
    const { current_password, new_password, confirm_password } = this.changePasswordForm.value;
    if (new_password !== confirm_password) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'New passwords do not match.'
      });
      return;
    }
    this.changingPassword = true;
    this.userService.changePassword(current_password, new_password).subscribe({
      next: (res) => {
        this.changingPassword = false;
        this.showChangePasswordDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Password changed successfully.'
        });
      },
      error: (err) => {
        this.changingPassword = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.error || 'Failed to change password.'
        });
      }
    });
  }

  onDeleteAccount() {
    this.showDeleteConfirmDialog = true;
  }

  confirmDeleteAccount() {
    this.deletingAccount = true;
    this.userService.deleteAccount().subscribe({
      next: (res) => {
        this.deletingAccount = false;
        this.showDeleteConfirmDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Account Deleted',
          detail: 'Your account has been deleted.'
        });
        setTimeout(() => {
          this.authService.logout();
        }, 1500);
      },
      error: (err) => {
        this.deletingAccount = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to delete account.'
        });
      }
    });
  }
}
