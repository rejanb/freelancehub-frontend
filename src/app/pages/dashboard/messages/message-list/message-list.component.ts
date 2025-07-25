import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { SkeletonModule } from 'primeng/skeleton';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { MessageService as PrimeMessageService } from 'primeng/api';
import { MessageService as ChatService, ChatRoom, User } from '../../../../../service/message.service';
import { TokenService } from '../../../../utils/token.service';
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
    SkeletonModule,
    IconField,
    InputIcon
  ],
  providers: [PrimeMessageService],
  template: `
    <div class="grid">
      <div class="col-12">
        <p-card>
          <div class="flex justify-content-between align-items-center mb-4">
            <h2 class="m-0">Messages</h2>
            <div class="flex gap-2 align-items-center">
              <button 
                pButton 
                type="button" 
                icon="pi pi-refresh" 
                (click)="debugChatRooms()"
                class="p-button-outlined p-button-sm"
                title="Debug chat rooms">
              </button>
              <p-iconfield styleClass="w-full" iconPosition="left">
                <p-inputicon>
                  <i class="pi pi-search"></i>
                </p-inputicon>
                <input
                  type="text"
                  pInputText
                  [(ngModel)]="searchQuery"
                  (input)="onSearch($event)"
                  placeholder="Search messages..."
                  class="w-full">
              </p-iconfield>
            </div>
          </div>

          <!-- Chat Rooms -->
          <div class="chat-rooms-container">
            <!-- Loading State -->
            <div *ngIf="loading" class="flex flex-column gap-3 p-3">
              <div *ngFor="let i of [1,2,3,4,5]" class="flex gap-3 p-3">
                <p-skeleton shape="circle" size="4rem"></p-skeleton>
                <div class="flex-1">
                  <p-skeleton width="70%" height="1.5rem" styleClass="mb-2"></p-skeleton>
                  <p-skeleton width="40%" height="1rem"></p-skeleton>
                </div>
              </div>
            </div>

            <!-- Debug Info -->
            <div *ngIf="!loading" class="mb-3 p-2 surface-100 border-round">
              <small class="text-500">
                Chat rooms loaded: {{ chatRooms?.length || 0 }} | 
                Array initialized: {{ chatRooms ? 'Yes' : 'No' }} |
                Search query: "{{ searchQuery }}"
              </small>
            </div>

            <!-- Chat Room List -->
            <div *ngIf="!loading && chatRooms && chatRooms.length > 0" class="flex flex-column">
              <div
                *ngFor="let room of chatRooms; trackBy: trackByRoomId"
                class="chat-room-item flex align-items-center p-3 cursor-pointer border-bottom-1 surface-border"
                [routerLink]="['/dashboard/messages', room.id]"
                [queryParams]="{ 
                  userName: getParticipantName(room),
                  userInitials: getParticipantInitials(room)
                }">

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
                    <small class="text-500" *ngIf="room.last_message?.created_at">
                      {{ room.last_message?.created_at | date:'shortTime' }}
                    </small>
                  </div>

                  <div class="flex justify-content-between align-items-center mt-2">
                    <span class="text-500 text-overflow-ellipsis" style="max-width: 80%">
                      <span *ngIf="room.last_message?.attachment && !room.last_message?.content">
                        <i class="pi pi-paperclip mr-1"></i>
                        {{ room.last_message?.attachment?.name }}
                      </span>
                      <span *ngIf="room.last_message?.content">
                        {{ room.last_message?.content }}
                      </span>
                      <span *ngIf="!room.last_message">
                        No messages yet
                      </span>
                    </span>
                    <p-badge
                      *ngIf="room.unread_count > 0"
                      [value]="room.unread_count.toString()"
                      severity="danger">
                    </p-badge>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div *ngIf="!loading && (!chatRooms || chatRooms.length === 0)" class="text-center p-5">
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
    :host {
      display: block;
      height: 100%;
    }

    .grid {
      height: 100vh;
      margin: 0;
      padding: 1rem;
      overflow: hidden;
      
      .col-12 {
        height: 100%;
        overflow: hidden;
        padding: 0;
      }
    }

    :host ::ng-deep {
      .p-card {
        height: 100%;
        max-height: 100%;
        margin: 0;
        .p-card-body {
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          .p-card-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            min-height: 0;
          }
        }
      }

      .chat-rooms-container {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        min-height: 0;
        max-height: 100%;
        
        /* Custom scrollbar styling */
        &::-webkit-scrollbar {
          width: 6px;
        }

        &::-webkit-scrollbar-track {
          background: var(--surface-100);
          border-radius: 3px;
        }

        &::-webkit-scrollbar-thumb {
          background: var(--surface-300);
          border-radius: 3px;
        }

        &::-webkit-scrollbar-thumb:hover {
          background: var(--surface-400);
        }
      }

      .chat-room-item {
        transition: background-color 0.2s;
        &:hover {
          background-color: var(--surface-100);
        }
      }
    }
  `]
})
export class MessageListComponent implements OnInit, OnDestroy {
  chatRooms: ChatRoom[] = []; // Initialize as empty array
  loading = false;
  searchQuery = '';
  searchTimeout?: any;
  currentUserId?: number;

  private unreadSubscription?: Subscription;
  private chatRoomsSubscription?: Subscription;

  constructor(
    private chatService: ChatService,
    private tokenService: TokenService,
    private messageService: PrimeMessageService,
    private cdr: ChangeDetectorRef // Add ChangeDetectorRef for manual change detection
  ) {
    // Initialize empty array to prevent undefined issues
    this.chatRooms = [];
  }

  ngOnInit() {
    const currentUser = this.tokenService.getCurrentUser();
    this.currentUserId = currentUser?.id;

    this.loadChatRooms();
    this.subscribeToUnreadCount();
    this.subscribeToChatRooms();
    
    // Load unread count once on initialization
    this.chatService.loadUnreadCount();
  }

  ngOnDestroy() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    if (this.unreadSubscription) {
      this.unreadSubscription.unsubscribe();
    }
    if (this.chatRoomsSubscription) {
      this.chatRoomsSubscription.unsubscribe();
    }
  }

  subscribeToChatRooms() {
    this.chatRoomsSubscription = this.chatService.chatRooms$.subscribe(rooms => {
      console.log('Chat rooms updated:', rooms); // Debug log
      this.chatRooms = Array.isArray(rooms) ? rooms : [];
      this.cdr.detectChanges(); // Force change detection
    });
  }

  subscribeToUnreadCount() {
    this.unreadSubscription = this.chatService.unreadCount$.subscribe(count => {
      // Simply react to unread count changes without triggering more API calls
      console.log('Unread count updated:', count);
      // Update UI components that depend on unread count
      this.cdr.detectChanges();
    });
  }

  loadChatRooms() {
    console.log('Loading chat rooms...'); // Debug log
    this.loading = true;
    this.chatRooms = []; // Reset to empty array
    this.cdr.detectChanges(); // Update UI immediately

    this.chatService.getChatRooms().subscribe({
      next: (response: any) => {
        console.log('Chat rooms response:', response); // Debug log
        const chatRooms = response.results || response;
        this.chatRooms = Array.isArray(chatRooms) ? chatRooms : [];
        this.chatService.setChatRooms(this.chatRooms);
        this.loading = false;
        this.cdr.detectChanges(); // Force change detection
      },
      error: (error) => {
        console.error('Error loading chat rooms:', error);
        this.chatRooms = []; // Ensure it's still an array on error
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load messages'
        });
        this.loading = false;
        this.cdr.detectChanges();
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
          next: (response: any) => {
            // Group messages by chat room
            const roomMap = new Map<number, ChatRoom>();
            if (response.results) {
              response.results.forEach((message: any) => {
                if (message.chat_room && !roomMap.has(message.chat_room)) {
                  // We need to construct the room data from the message
                  const room: ChatRoom = {
                    id: message.chat_room,
                    participants: [message.sender],
                    is_group: false,
                    last_message: message,
                    unread_count: 0,
                    created_at: message.created_at,
                    updated_at: message.updated_at
                  };
                  roomMap.set(message.chat_room, room);
                }
              });
            }
            this.chatRooms = Array.from(roomMap.values());
            this.loading = false;
            this.cdr.detectChanges(); // Force change detection after search
          },
          error: (error) => {
            console.error('Error searching messages:', error);
            this.chatRooms = []; // Reset on error
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      } else {
        this.loadChatRooms();
      }
    }, 300);
  }

  getParticipantName(room: ChatRoom): string {
    const participant = room.participants.find(p => p.id !== this.currentUserId);
    if (participant) {
      return participant.first_name && participant.last_name && 
             participant.first_name.trim() && participant.last_name.trim()
        ? `${participant.first_name.trim()} ${participant.last_name.trim()}`
        : participant.username;
    }
    return 'Unknown User';
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
    const participant = room.participants.find(p => p.id !== this.currentUserId);
    return colors[participant ? participant.id % colors.length : 0];
  }

  // TrackBy function for better performance
  trackByRoomId(index: number, room: ChatRoom): number {
    return room.id;
  }

  // Debug method to check array state
  debugChatRooms() {
    console.log('Current chat rooms state:', {
      array: this.chatRooms,
      length: this.chatRooms?.length,
      isArray: Array.isArray(this.chatRooms),
      loading: this.loading
    });
  }
}
