import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';
import { MessageModule } from 'primeng/message';
import { TokenService } from '../../../utils/token.service';
import { AuthService } from '../../../service/auth.service';
import { CurrentUser, User } from '../../../model/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    FileUploadModule,
    CardModule,
    DividerModule,
    AvatarModule,
    MessageModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  currentUser: CurrentUser | null = null;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private tokenService: TokenService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.tokenService.getCurrentUser();
    this.initializeForm();
    // TODO: Load full user profile from API
  }

  initializeForm() {
    this.profileForm = this.fb.group({
      username: [this.currentUser?.name || '', [Validators.required]],
      email: [this.currentUser?.email || '', [Validators.required, Validators.email]],
      bio: [''],
      skills: [''], // Using simple text input for skills
      profile_picture: [null]
    });
  }

  onFileSelect(event: any) {
    if (event.files && event.files.length > 0) {
      this.selectedFile = event.files[0];
    }
  }

  onSave() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = this.profileForm.value;
      
      // TODO: Implement API call to update user profile
      console.log('Profile update data:', formData);
      
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        this.successMessage = 'Profile updated successfully!';
        
        // Update stored user data
        if (this.currentUser) {
          this.currentUser.name = formData.username;
          this.currentUser.email = formData.email;
          this.tokenService.setLocal('user', this.currentUser);
        }
      }, 1000);
    }
  }

  onChangePassword() {
    // TODO: Implement change password functionality
    console.log('Change password clicked');
  }

  onDeleteAccount() {
    // TODO: Implement account deletion
    console.log('Delete account clicked');
  }
} 