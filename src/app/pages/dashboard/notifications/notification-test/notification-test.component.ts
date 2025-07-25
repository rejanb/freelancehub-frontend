import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { NotificationService } from '../../../../../service/notification.service';
import { TokenService } from '../../../../utils/token.service';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Component({
  selector: 'app-notification-test',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    DropdownModule
  ],
  providers: [MessageService],
  template: `
    <div class="grid">
      <div class="col-12">
        <p-card>
          <h3>Notification WebSocket Test</h3>
          
          <div class="field">
            <label for="message">Test Message</label>
            <input pInputText id="message" [(ngModel)]="testMessage" class="w-full" />
          </div>
          
          <div class="field">
            <label for="type">Notification Type</label>
            <p-dropdown 
              id="type"
              [options]="notificationTypes" 
              [(ngModel)]="selectedType" 
              optionLabel="label" 
              optionValue="value"
              class="w-full">
            </p-dropdown>
          </div>
          
          <div class="flex gap-2 mb-4">
            <button pButton label="Connect WebSocket" (click)="connectWebSocket()" [disabled]="isConnected"></button>
            <button pButton label="Disconnect" (click)="disconnectWebSocket()" [disabled]="!isConnected"></button>
            <button pButton label="Send Test Notification" (click)="sendTestNotification()" severity="success"></button>
          </div>
          
          <div class="field">
            <label>Connection Status: <span [style.color]="isConnected ? 'green' : 'red'">{{ isConnected ? 'Connected' : 'Disconnected' }}</span></label>
          </div>
          
          <div class="field">
            <label>Received Messages:</label>
            <div class="border-1 border-round p-3 mt-2" style="max-height: 300px; overflow-y: auto;">
              <div *ngFor="let msg of receivedMessages" class="mb-2 p-2 border-round" [style.background-color]="'#f0f0f0'">
                <small>{{ msg.timestamp | date:'medium' }}</small><br>
                <pre>{{ msg.data | json }}</pre>
              </div>
            </div>
          </div>
        </p-card>
      </div>
    </div>
  `
})
export class NotificationTestComponent implements OnInit, OnDestroy {
  testMessage = 'Hello, this is a test notification!';
  selectedType = 'info';
  isConnected = false;
  receivedMessages: any[] = [];
  
  notificationTypes = [
    { label: 'Info', value: 'info' },
    { label: 'Success', value: 'success' },
    { label: 'Warning', value: 'warning' },
    { label: 'Error', value: 'error' },
    { label: 'Job', value: 'job' },
    { label: 'Message', value: 'message' }
  ];
  
  private socket$?: WebSocketSubject<any>;
  private currentUser: any;

  constructor(
    private notificationService: NotificationService,
    private tokenService: TokenService,
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.currentUser = this.tokenService.getCurrentUser();
  }

  ngOnDestroy() {
    this.disconnectWebSocket();
  }

  connectWebSocket() {
    if (!this.currentUser) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please login first'
      });
      return;
    }

    // Get JWT token for WebSocket authentication
    const token = this.tokenService.getToken();
    if (!token) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No authentication token found'
      });
      return;
    }

    // Include token in WebSocket URL for authentication
    const wsUrl = `ws://localhost:8000/ws/notifications/${this.currentUser.id}/?token=${token}`;
    
    this.socket$ = webSocket({
      url: wsUrl,
      deserializer: msg => JSON.parse(msg.data),
      serializer: msg => JSON.stringify(msg)
    });

    this.socket$.subscribe({
      next: (message) => {
        console.log('WebSocket message received:', message);
        this.receivedMessages.unshift({
          timestamp: new Date(),
          data: message
        });
        this.isConnected = true;
        
        this.messageService.add({
          severity: 'info',
          summary: 'WebSocket',
          detail: 'Message received'
        });
      },
      error: (error) => {
        console.error('WebSocket error:', error);
        this.isConnected = false;
        this.messageService.add({
          severity: 'error',
          summary: 'WebSocket Error',
          detail: 'Connection failed'
        });
      },
      complete: () => {
        console.log('WebSocket connection closed');
        this.isConnected = false;
      }
    });

    // Send a ping to test connection
    setTimeout(() => {
      if (this.socket$ && !this.socket$.closed) {
        this.socket$.next({ type: 'ping' });
      }
    }, 1000);
  }

  disconnectWebSocket() {
    if (this.socket$) {
      this.socket$.complete();
      this.isConnected = false;
    }
  }

  sendTestNotification() {
    const payload = {
      message: this.testMessage,
      type: this.selectedType
    };

    this.http.post('http://localhost:8000/api/notifications/test/', payload).subscribe({
      next: (response) => {
        console.log('Test notification sent:', response);
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
