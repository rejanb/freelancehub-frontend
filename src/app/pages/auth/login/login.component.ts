import { Component, inject } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TokenService } from '../../../utils/token.service';
import { ApiConst, RouteConst } from '../../../const/api-const';
import { ButtonDirective } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { InputText } from "primeng/inputtext";
import { Message } from "primeng/message";
import { Password } from "primeng/password";
import { AuthResponse, CurrentUser } from '../../../model/models';
import { NotificationService } from '../../../../service/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ButtonDirective,
    DropdownModule,
    InputText,
    Message,
    Password,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private auth: AuthService,
    private tokenService: TokenService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.auth.login(this.email, this.password).subscribe({
      next: (response: AuthResponse) => {
        // Store user data with correct property names
        const currentUser: CurrentUser = {
          name: response.user,
          type: response.user_type,
          email: response.email,
          id: response.id,
          profile_picture: response.profile_picture
        };

        this.tokenService.setLocal(ApiConst.userKey, currentUser);
        this.auth.setAccessToken(response.access);
        this.auth.setRefreshToken(response.refresh);

        // Initialize WebSocket connection after successful login
        console.log('Login successful, initializing WebSocket connection for user:', currentUser.id);
        this.notificationService.connectWebSocket(currentUser.id, response.access);
        if (this.tokenService.getCurrentUser().type === "client" ){
          this.router.navigate(['dashboard/client-dashboard'])
        }
        if (this.tokenService.getCurrentUser().type === "freelancer" ){
          this.router.navigate(['dashboard/freelancer-dashboard'])
        }
        // this.router.navigate([RouteConst.DASHBOARD]);
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = error.error?.detail || 'Login failed. Please try again.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
