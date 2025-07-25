import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextarea } from 'primeng/inputtextarea';
import { AvatarModule } from 'primeng/avatar';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { ProgressBarModule } from 'primeng/progressbar';
import { MenuItem, MessageService as PrimeMessageService } from 'primeng/api';
import { MessageService as ChatService, Message, ChatRoom, User, TypingIndicator } from '../../../../../service/message.service';
import { TokenService } from '../../../../utils/token.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextarea,
    AvatarModule,
    FileUploadModule,
    TooltipModule,
    MenuModule,
    BadgeModule,
    ProgressBarModule
  ],
  providers: [PrimeMessageService],
  template: `
    <div class="grid">
      <div class="col-12">
        <p-card>
          <!-- Header -->
          <div class="flex justify-content-between align-items-center mb-4">
            <div class="flex align-items-center gap-3">
              <button
                pButton
                icon="pi pi-arrow-left"
                class="p-button-text"
                routerLink="/dashboard/messages">
              </button>
              <div class="flex align-items-center gap-2">
                <!-- User Avatar -->
<!--                <p-avatar-->
<!--                  [label]="getUserInitials()"-->
<!--                  shape="circle"-->
<!--                  size="normal"-->
<!--                  [style]="{ 'background-color': getAvatarColor() }"-->
<!--                  class="mr-2">-->
<!--                </p-avatar>-->
                <div class="flex flex-column">
                  <span class="font-bold">{{ username || getParticipantName() | titlecase }}</span>
                  <small class="text-500" *ngIf="isParticipantOnline()">
                    <i class="pi pi-circle-fill text-green-500" style="font-size: 0.5rem"></i>
                    Online
                  </small>
                </div>
              </div>
            </div>

            <!-- Typing indicator -->
            <div *ngIf="currentlyTyping.length > 0" class="text-500 text-sm">
              <i class="pi pi-ellipsis-h"></i>
              {{ getTypingText() }}
            </div>
          </div>

          <!-- Messages -->
          <div
            #messageContainer
            class="messages-container"
            [class.loading]="loading">

            <div *ngIf="loading" class="flex justify-content-center p-4">
              <i class="pi pi-spin pi-spinner text-xl"></i>
            </div>

            <div *ngIf="!loading && messages.length === 0" class="text-center p-4">
              <p class="text-500">No messages yet. Start the conversation!</p>
            </div>

            <div *ngFor="let message of messages"
                 class="message-wrapper"
                 [class.wrapper-sent]="message.sender.id === currentUserId"
                 [class.wrapper-received]="message.sender.id !== currentUserId">
              <!-- Message -->
              <div
                class="message"
                [class.sent]="message.sender.id === currentUserId"
                [class.received]="message.sender.id !== currentUserId">

                <!-- Avatar for received messages -->
                <p-avatar
                  *ngIf="message.sender.id !== currentUserId"
                  [label]="getUserInitials(message.sender)"
                  size="normal"
                  class="mr-2"
                  styleClass="bg-primary-100 text-primary-700">
                </p-avatar>

                <!-- Message bubble -->
                <div class="message-bubble">
                  <!-- Sender name for received messages -->
                  <div *ngIf="message.sender.id !== currentUserId" class="sender-name mb-1">
                    <small class="text-600 font-medium">{{ getUserFullName(message.sender) }}</small>
                  </div>

                  <!-- Content -->
                  <div class="message-content">
                    <div *ngIf="message.content" class="message-text">
                      {{ message.content }}
                    </div>

                    <!-- Image Attachment -->
                    <div *ngIf="message.attachment && message.message_type === 'image'" class="attachment-image mt-2">
                      <img [src]="message.attachment.url"
                           [alt]="message.attachment.name"
                           class="max-w-full h-auto border-round cursor-pointer"
                           (click)="openImage(message.attachment.url)">
                    </div>

                    <!-- File Attachment -->
                    <div *ngIf="message.attachment && message.message_type === 'file'" class="attachment-file mt-2">
                      <div class="flex align-items-center gap-2 p-2 border-round surface-border border-1">
                        <i class="pi pi-file text-primary"></i>
                        <div class="flex-1">
                          <div class="font-medium">{{ message.attachment.name }}</div>
                          <small class="text-500">{{ formatFileSize(message.attachment.size) }}</small>
                        </div>
                        <button
                          pButton
                          icon="pi pi-download"
                          class="p-button-text p-button-sm"
                          pTooltip="Download"
                          (click)="downloadAttachment(message)">
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Message info -->
                  <div class="message-info flex align-items-center justify-content-between mt-1">
                    <small class="message-time text-500">
                      {{ formatMessageTime(message.created_at) }}
                    </small>
                    <div class="message-status">
                      <i *ngIf="message.sender.id === currentUserId && isMessageRead(message)"
                         class="pi pi-check-double text-primary"
                         pTooltip="Read"></i>
                      <i *ngIf="message.sender.id === currentUserId && !isMessageRead(message)"
                         class="pi pi-check text-500"
                         pTooltip="Sent"></i>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <button
                  *ngIf="message.sender.id === currentUserId"
                  pButton
                  icon="pi pi-ellipsis-v"
                  class="p-button-text p-button-sm message-actions ml-2"
                  [pTooltip]="'Actions'"
                  (click)="messageMenu.toggle($event); setActiveMessage(message)">
                </button>
                <p-menu #messageMenu [popup]="true" [model]="getMessageActions()"></p-menu>
              </div>
            </div>
          </div>

          <!-- File upload progress -->
          <div *ngIf="uploadProgress > 0 && uploadProgress < 100" class="upload-progress mb-2">
            <p-progressBar [value]="uploadProgress" [showValue]="true"></p-progressBar>
          </div>

          <!-- Input -->
          <div class="message-input">
            <div class="flex gap-2">


              <!-- Text Input -->
              <div class="flex-1">
                <textarea
                  pInputTextarea
                  [(ngModel)]="newMessage"
                  (ngModelChange)="onTyping()"
                  (keydown.enter)="onEnterPress($event)"
                  placeholder="Type a message..."
                  [rows]="1"
                  [autoResize]="true"
                  class="w-full">
                </textarea>
              </div>

              <!-- Send Button -->
              <button
                pButton
                icon="pi pi-send"
                (click)="sendMessage()"
                [disabled]="(!newMessage.trim() && !selectedFile) || uploading"
                [loading]="uploading">
              </button>
            </div>

            <!-- Selected file preview -->
            <div *ngIf="selectedFile" class="selected-file mt-2 p-2 border-round surface-border border-1">
              <div class="flex align-items-center justify-content-between">
                <div class="flex align-items-center gap-2">
                  <i class="pi pi-file"></i>
                  <span>{{ selectedFile.name }}</span>
                  <small class="text-500">({{ formatFileSize(selectedFile.size) }})</small>
                </div>
                <button
                  pButton
                  icon="pi pi-times"
                  class="p-button-text p-button-sm"
                  (click)="clearSelectedFile()">
                </button>
              </div>
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
      overflow: hidden;
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
          max-height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          margin-bottom: 25px;
          .p-card-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 0 !important;
            overflow: hidden;
            min-height: 0;
          }
        }
      }

      .messages-container {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 1rem;
        background-color: var(--surface-ground);
        min-height: 0;
        max-height: 100%;
        scroll-behavior: smooth;

        &.loading {
          display: flex;
          align-items: center;
          justify-content: center;
        }

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

      .message-wrapper {
        margin-bottom: 1rem;
        display: flex;
        position: relative;

        &.wrapper-sent {
          justify-content: flex-end;
        }

        &.wrapper-received {
          justify-content: flex-start;
        }
      }

      .message {
        display: flex;
        align-items: flex-end;
        max-width: 70%;
        position: relative;

        .message-bubble {
          display: flex;
          flex-direction: column;
          max-width: 100%;
        }

        .sender-name {
          padding: 0 0.5rem;
        }

        .message-content {
          padding: 0.75rem 1rem;
          border-radius: 1.25rem;
          background-color: var(--surface-card);
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          word-wrap: break-word;
          position: relative;
        }

        .message-info {
          padding: 0 0.5rem;
          margin-top: 0.25rem;
        }

        .message-time {
          font-size: 0.75rem;
        }

        .message-actions {
          opacity: 0;
          transition: opacity 0.2s;
        }

        &:hover .message-actions {
          opacity: 1;
        }

        &.sent {
          flex-direction: row;

          .message-content {
            background-color: var(--primary-color);
            color: var(--primary-color-text);
            border-bottom-right-radius: 0.5rem;
          }

          .message-info {
            text-align: right;
          }

          .message-time {
            color: var(--primary-100);
          }
        }

        &.received {
          flex-direction: row;

          .message-content {
            background-color: var(--surface-card);
            color: var(--text-color);
            border-bottom-left-radius: 0.5rem;
          }

          .message-info {
            text-align: left;
          }
        }
      }

      .message-input {
        flex-shrink: 0;
        padding: 1rem;
        background-color: var(--surface-card);
        border-top: 1px solid var(--surface-border);
        max-height: 200px;
        overflow-y: auto;
        margin-bottom: 15px;

        .p-inputtextarea {
          resize: none;
          max-height: 120px;
          overflow-y: auto;
        }

        .selected-file {
          max-height: 60px;
          overflow: hidden;
        }
      }

      .attachment {
        padding: 0.5rem;
        background-color: rgba(0,0,0,0.1);
        border-radius: 0.5rem;
      }
    }
  `]
})
export class ChatRoomComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  @ViewChild('fileUpload') private fileUpload!: any;

  messages: Message[] = [];
  newMessage = '';
  loading = false;
  uploading = false;
  uploadProgress = 0;
  currentUserId?: number;
  chatRoom?: ChatRoom;
  selectedFile?: File;
  activeMessage?: Message;

  // Subscriptions
  private messageSubscription?: Subscription;
  private typingSubscription?: Subscription;
  private onlineUsersSubscription?: Subscription;

  // Typing and online status
  currentlyTyping: TypingIndicator[] = [];
  onlineUsers: number[] = [];
  private typingTimer?: any;

  shouldScrollToBottom = true;
  username: string = '';
  userInitials: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    private tokenService: TokenService,
    private messageService: PrimeMessageService
  ) {}

  ngOnInit() {
    const currentUser = this.tokenService.getCurrentUser();
    this.currentUserId = currentUser?.id;

    const roomId = this.route.snapshot.params['id'];
    if (!roomId) {
      this.router.navigate(['/dashboard/messages']);
      return;
    }

    // Get the user name and initials from query parameters
    this.username = this.route.snapshot.queryParams['userName'] || '';
    this.userInitials = this.route.snapshot.queryParams['userInitials'] || '';

    this.loadChatRoom(roomId);
    this.loadMessages(roomId);
    this.setupWebSocket(roomId);
    this.subscribeToNewMessages();
    this.subscribeToTypingIndicators();
    this.subscribeToOnlineUsers();
  }

  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    if (this.typingSubscription) {
      this.typingSubscription.unsubscribe();
    }
    if (this.onlineUsersSubscription) {
      this.onlineUsersSubscription.unsubscribe();
    }
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }
    this.chatService.disconnectWebSocket();
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
    }
  }

  loadChatRoom(roomId: number) {
    // Load chat room details if needed
    // For now, we'll get it from messages response or create a separate call
  }

  setupWebSocket(roomId: number) {
    this.chatService.connectToRoom(roomId);
  }

  subscribeToNewMessages() {
    this.messageSubscription = this.chatService.messages$.subscribe(messages => {
      this.messages = messages;
      this.shouldScrollToBottom = true;
      this.markRoomAsRead();
    });
  }

  subscribeToTypingIndicators() {
    this.typingSubscription = this.chatService.typing$.subscribe(indicator => {
      if (indicator.user_id !== this.currentUserId) {
        if (indicator.is_typing) {
          // Add or update typing indicator
          const existing = this.currentlyTyping.find(t => t.user_id === indicator.user_id);
          if (!existing) {
            this.currentlyTyping.push(indicator);
          }
        } else {
          // Remove typing indicator
          this.currentlyTyping = this.currentlyTyping.filter(t => t.user_id !== indicator.user_id);
        }
      }
    });
  }

  subscribeToOnlineUsers() {
    this.onlineUsersSubscription = this.chatService.onlineUsers$.subscribe(users => {
      this.onlineUsers = users;
    });
  }

  loadMessages(roomId: number) {
    this.loading = true;
    this.chatService.getRoomMessages(roomId).subscribe({
      next: (response) => {
        const messages = response.results || response;
        this.messages = Array.isArray(messages) ? messages : [];
        this.chatService.setMessages(this.messages);
        this.loading = false;
        this.shouldScrollToBottom = true;
        this.markRoomAsRead();
        console.log('Messages loaded:', this.messages);
      },
      error: (error) => {
        console.error('Error loading messages:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load messages'
        });
        this.loading = false;
      }
    });
  }

  sendMessage() {
    if ((!this.newMessage.trim() && !this.selectedFile) || !this.route.snapshot.params['id']) {
      return;
    }

    const roomId = this.route.snapshot.params['id'];
    this.uploading = true;

    this.chatService.sendMessage(roomId, this.newMessage, this.selectedFile).subscribe({
      next: (message) => {
        // Message will be added through WebSocket subscription
        this.newMessage = '';
        this.selectedFile = undefined;
        this.uploading = false;
        this.uploadProgress = 0;
        if (this.fileUpload) {
          this.fileUpload.clear();
        }
        this.shouldScrollToBottom = true;

        // Stop typing indicator
        this.chatService.sendTypingIndicator(false);
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to send message'
        });
        this.uploading = false;
        this.uploadProgress = 0;
      }
    });
  }

  onEnterPress(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter' && !keyboardEvent.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }


  clearSelectedFile() {
    this.selectedFile = undefined;
    if (this.fileUpload) {
      this.fileUpload.clear();
    }
  }

  onTyping() {
    // Send typing indicator
    this.chatService.sendTypingIndicator(true);

    // Clear previous timer
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }

    // Stop typing after 2 seconds of inactivity
    this.typingTimer = setTimeout(() => {
      this.chatService.sendTypingIndicator(false);
    }, 2000);
  }

  downloadAttachment(message: Message) {
    if (!message.attachment) return;

    this.chatService.downloadAttachment(message.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = message.attachment?.name || 'attachment';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading attachment:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to download attachment'
        });
      }
    });
  }

  openImage(imageUrl: string) {
    window.open(imageUrl, '_blank');
  }

  markRoomAsRead() {
    const roomId = this.route.snapshot.params['id'];
    if (roomId) {
      this.chatService.markRoomAsRead(roomId).subscribe();
    }
  }

  setActiveMessage(message: Message) {
    this.activeMessage = message;
  }

  getMessageActions(): MenuItem[] {
    return [
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteMessage()
      }
    ];
  }

  deleteMessage() {
    if (!this.activeMessage) return;

    this.chatService.deleteMessage(this.activeMessage.id).subscribe({
      next: () => {
        this.messages = this.messages.filter(m => m.id !== this.activeMessage!.id);
        this.chatService.setMessages(this.messages);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Message deleted'
        });
        this.activeMessage = undefined;
      },
      error: (error) => {
        console.error('Error deleting message:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete message'
        });
      }
    });
  }

  isMessageRead(message: Message): boolean {

    if (!this.chatRoom) return false;
    const otherParticipants = this.chatRoom.participants.filter(p => p.id !== this.currentUserId);
    return otherParticipants.some(p => message.read_by.includes(p.id));
  }

  isParticipantOnline(): boolean {
    if (!this.chatRoom) return false;
    const participant = this.chatRoom.participants.find(p => p.id !== this.currentUserId);
    return participant ? this.onlineUsers.includes(participant.id) : false;
  }

  getParticipantName(): string {
    console.log(this.chatRoom)
    if (!this.chatRoom) return '';
    const participant : any = this.chatRoom.participants.find(p => p.id !== this.currentUserId);
    console.log(participant)
    if (participant) {
      return participant.display_name;
    }
    return 'Unknown User';
  }

  getUserFullName(user: User): string {
    if (user.first_name && user.last_name && user.first_name.trim() && user.last_name.trim()) {
      return `${user.first_name.trim()} ${user.last_name.trim()}`;
    }
    return user.username;
  }

  getUserInitials(user: User): string {
    const fullName = this.getUserFullName(user);
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2); // Limit to 2 characters for better display
  }



  getAvatarColor(): string {
    if (!this.chatRoom) return '#2196F3';
    const colors = [
      '#2196F3', '#4CAF50', '#FF9800', '#E91E63',
      '#9C27B0', '#00BCD4', '#FFEB3B', '#795548'
    ];
    const participant = this.chatRoom.participants.find(p => p.id !== this.currentUserId);
    return colors[participant ? participant.id % colors.length : 0];
  }

  getTypingText(): string {
    if (this.currentlyTyping.length === 1) {
      return `${this.currentlyTyping[0].username} is typing...`;
    } else if (this.currentlyTyping.length > 1) {
      return 'Multiple people are typing...';
    }
    return '';
  }

  getHeaderUserInitials(): string {
    // Use initials from query params if available
    if (this.userInitials) {
      return this.userInitials;
    }

    if (this.username) {
      return this.username
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }

    if (!this.chatRoom) return '';
    const participant = this.chatRoom.participants.find(p => p.id !== this.currentUserId);
    if (participant) {
      const fullName = this.getUserFullName(participant);
      return fullName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return 'U';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatMessageTime(dateString: string): string {
    const validDateString = dateString ? dateString : new Date().toISOString();
    const messageDate = new Date(validDateString);
    const now = new Date();
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      // Show "just now" or "X minutes ago"
      const diffInMinutes = Math.floor(diffInHours * 60);
      if (diffInMinutes < 1) {
        return 'Just now';
      } else {
        return `${diffInMinutes}m ago`;
      }
    } else if (diffInHours < 24) {
      // Show time in HH:MM format
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      // Show "Yesterday HH:MM"
      return `Yesterday ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      // Show date and time
      return messageDate.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }

  private scrollToBottom() {
    try {
      const container = this.messageContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
      this.shouldScrollToBottom = false;
    } catch (err) {}
  }
}
