import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { MessageService as ChatService, ChatRoom } from '../../../../../service/message.service';
import { TokenService } from '../../../../utils/token.service';
import { ApiResponse } from '../../../../model/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    AvatarModule,
    BadgeModule,
    SkeletonModule
  ],
  providers: [MessageService],
  template: `
    <div class="grid">
      <div class="col-12">
        <p-card>
          <div class="flex justify-content-between align-items-center mb-4">
            <h2 class="m-0">Messages</h2>
            <span class="p-input-icon-left">
              <i class="pi pi-search"></i>
              <input 
                type="text" 
                pInputText 
                [(ngModel)]="searchQuery"
                (input)="onSearch($event)"
                placeholder="Search messages...">
            </span>
          </div>

          <!-- Loading State -->
          <div *ngIf="loading" class="flex flex-column gap-3">
            <div *ngFor="let i of [1,2,3,4,5]" class="flex gap-3 p-3">
              <p-skeleton shape="circle" size="4rem"></p-skeleton>
              <div class="flex-1">
                <p-skeleton width="70%" height="1.5rem" styleClass="mb-2"></p-skeleton>
                <p-skeleton width="40%" height="1rem"></p-skeleton>
              </div>
            </div>
          </div>

          <!-- Chat Rooms -->
          <div *ngIf="!loading" class="flex flex-column">
            <div 
              *ngFor="let room of chatRooms"
              class="flex align-items-center p-3 cursor-pointer hover:surface-100 border-bottom-1 surface-border"
              [routerLink]="['/dashboard/messages', room.id]">
              
              <!-- Avatar -->
              <p-avatar 
                [label]="getParticipantInitials(room)"
                shape="circle" 
                size="large"
                [style]="{ 'background-color': getAvatarColor(room) }"
                class="mr-3">
              </p-avatar>

              <!-- Message Preview -->
              <div class="flex-1">
                <div class="flex justify-content-between align-items-center">
                  <span class="font-bold">{{ getParticipantName(room) }}</span>
                  <small class="text-500">{{ room.last_message?.created_at | date:'shortTime' }}</small>
                </div>
                
                <div class="flex justify-content-between align-items-center mt-2">
                  <span class="text-500 text-overflow-ellipsis" style="max-width: 80%">
                    {{ room.last_message?.content || 'No messages yet' }}
                  </span>
                  <p-badge 
                    *ngIf="room.unread_count > 0" 
                    [value]="room.unread_count.toString()"
                    severity="danger">
                  </p-badge>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div *ngIf="chatRooms.length === 0" class="text-center p-5">
              <i class="pi pi-comments text-6xl text-500 mb-3"></i>
              <h3>No Messages Yet</h3>
              <p class="text-500">Start a conversation from a user's profile or job proposal.</p>
            </div>
          </div>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      .p-card {
        height: calc(100vh - 8rem);
        .p-card-body {
          height: 100%;
          .p-card-content {
            height: calc(100% - 4rem);
            overflow-y: auto;
          }
        }
      }
    }
  `]
})
export class MessageListComponent implements OnInit, OnDestroy {
  chatRooms: ChatRoom[] = [];
  loading = false;
  searchQuery = '';
  searchTimeout?: any;
  currentUserId?: number;
  unreadSubscription?: Subscription;

  constructor(
    private chatService: ChatService,
    private tokenService: TokenService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const currentUser = this.tokenService.getCurrentUser();
    this.currentUserId = currentUser?.id;

    this.loadChatRooms();
    this.setupWebSocket();
    this.subscribeToUnreadCount();
  }

  ngOnDestroy() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    if (this.unreadSubscription) {
      this.unreadSubscription.unsubscribe();
    }
    this.chatService.disconnectWebSocket();
  }

  setupWebSocket() {
    const currentUser = this.tokenService.getCurrentUser();
    const token = this.tokenService.getToken();
    
    if (currentUser?.id && token) {
      this.chatService.connectWebSocket(currentUser.id, token);
    }
  }

  subscribeToUnreadCount() {
    this.unreadSubscription = this.chatService.unreadCount$.subscribe(count => {
      if (count > 0) {
        this.loadChatRooms();
      }
    });
  }

  loadChatRooms() {
    this.loading = true;
    this.chatService.getChatRooms().subscribe({
      next: (response: ApiResponse<ChatRoom>) => {
        this.chatRooms = response.results;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading chat rooms:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load messages'
        });
        this.loading = false;
      }
    });
  }

  onSearch(event: any) {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      if (this.searchQuery.trim()) {
        this.loading = true;
        this.chatService.searchMessages(this.searchQuery).subscribe({
          next: (response: ApiResponse<any>) => {
            // Group messages by chat room
            const roomMap = new Map<number, ChatRoom>();
            response.results.forEach(message => {
              if (message.chat_room && !roomMap.has(message.chat_room.id)) {
                roomMap.set(message.chat_room.id, message.chat_room);
              }
            });
            this.chatRooms = Array.from(roomMap.values());
            this.loading = false;
          },
          error: (error) => {
            console.error('Error searching messages:', error);
            this.loading = false;
          }
        });
      } else {
        this.loadChatRooms();
      }
    }, 300);
  }

  getParticipantName(room: ChatRoom): string {
    const participant = room.participants.find(p => p !== this.currentUserId);
    return participant ? `User ${participant}` : 'Unknown User';
  }

  getParticipantInitials(room: ChatRoom): string {
    const name = this.getParticipantName(room);
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  getAvatarColor(room: ChatRoom): string {
    const colors = [
      '#2196F3', '#4CAF50', '#FF9800', '#E91E63',
      '#9C27B0', '#00BCD4', '#FFEB3B', '#795548'
    ];
    const participant = room.participants.find(p => p !== this.currentUserId);
    return colors[participant ? participant % colors.length : 0];
  }
} 