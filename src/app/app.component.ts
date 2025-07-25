import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NotificationService } from '../service/notification.service';
import { TokenService } from './utils/token.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Toast, ConfirmDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'freelancehub';

  constructor(
    private notificationService: NotificationService,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    // Initialize WebSocket connection if user is logged in
    this.initializeWebSocketConnection();
  }

  ngOnDestroy() {
    // Clean up WebSocket connection
    this.notificationService.disconnectWebSocket();
  }

  private initializeWebSocketConnection() {
    // Check if user is logged in
    const currentUser = this.tokenService.getCurrentUser();
    const token =  localStorage.getItem('access');
    console.log(currentUser.id)
    console.log(token)

    if (currentUser?.id && token) {
      // Check if WebSocket is already connected
      if (!this.notificationService.isWebSocketConnected()) {
        console.log('Initializing WebSocket connection for user:', currentUser.id);
        this.notificationService.connectWebSocket(currentUser.id, token);
      } else {
        console.log('WebSocket already connected for user:', currentUser.id);
      }
    } else {
      console.log('No user logged in, skipping WebSocket connection');
    }
  }
}
