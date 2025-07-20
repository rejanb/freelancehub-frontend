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
import { MenuItem, MessageService } from 'primeng/api';
import { MessageService as ChatService, Message, ChatRoom } from '../../../../../service/message.service';
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
    MenuModule
  ],
  providers: [MessageService],
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
                <p-avatar 
                  [label]="getParticipantInitials()"
                  shape="circle"
                  [style]="{ 'background-color': getAvatarColor() }">
                </p-avatar>
                <span class="font-bold">{{ getParticipantName() }}</span>
              </div>
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

            <div *ngFor="let message of messages" class="message-wrapper">
              <!-- Message -->
              <div 
                class="message" 
                [class.sent]="message.sender === currentUserId"
                [class.received]="message.sender !== currentUserId">
                
                <!-- Content -->
                <div class="message-content">
                  {{ message.content }}

                  <!-- Attachment -->
                  <div *ngIf="message.attachment" class="attachment mt-2">
                    <div class="flex align-items-center gap-2">
                      <i class="pi pi-paperclip"></i>
                      <span class="text-sm">{{ message.attachment_name }}</span>
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

                <!-- Timestamp -->
                <small class="message-time text-500">
                  {{ message.created_at | date:'shortTime' }}
                </small>

                <!-- Actions -->
                <button 
                  *ngIf="message.sender === currentUserId"
                  pButton 
                  icon="pi pi-ellipsis-v"
                  class="p-button-text p-button-sm message-actions"
                  [pTooltip]="'Actions'"
                  (click)="messageMenu.toggle($event)">
                </button>
                <p-menu #messageMenu [popup]="true" [model]="getMessageActions(message)"></p-menu>
              </div>
            </div>
          </div>

          <!-- Input -->
          <div class="message-input">
            <div class="flex gap-2">
              <!-- File Upload -->
              <p-fileUpload
                #fileUpload
                mode="basic"
                chooseIcon="pi pi-paperclip"
                [auto]="true"
                [maxFileSize]="10000000"
                [customUpload]="true"
                (uploadHandler)="onFileSelected($event)"
                [class]="'p-button-text'">
              </p-fileUpload>

              <!-- Text Input -->
              <div class="flex-1">
                <textarea 
                  pInputTextarea 
                  [(ngModel)]="newMessage"
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
                [disabled]="!newMessage.trim() && !selectedFile">
              </button>
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
          display: flex;
          flex-direction: column;
          .p-card-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 0 !important;
          }
        }
      }

      .messages-container {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
        background-color: var(--surface-ground);

        &.loading {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .message-wrapper {
        margin-bottom: 1rem;
        position: relative;
      }

      .message {
        display: inline-flex;
        align-items: flex-end;
        max-width: 70%;
        position: relative;

        .message-content {
          padding: 0.75rem 1rem;
          border-radius: 1rem;
          background-color: var(--surface-card);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .message-time {
          margin: 0 0.5rem;
          white-space: nowrap;
        }

        .message-actions {
          opacity: 0;
          transition: opacity 0.2s;
        }

        &:hover .message-actions {
          opacity: 1;
        }

        &.sent {
          margin-left: auto;
          flex-direction: row;

          .message-content {
            background-color: var(--primary-color);
            color: var(--primary-color-text);
          }
        }

        &.received {
          margin-right: auto;
          flex-direction: row-reverse;

          .message-content {
            background-color: var(--surface-card);
          }
        }
      }

      .message-input {
        padding: 1rem;
        background-color: var(--surface-card);
        border-top: 1px solid var(--surface-border);

        .p-inputtextarea {
          resize: none;
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
  currentUserId?: number;
  chatRoom?: ChatRoom;
  selectedFile?: File;
  messageSubscription?: Subscription;
  shouldScrollToBottom = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    private tokenService: TokenService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const currentUser = this.tokenService.getCurrentUser();
    this.currentUserId = currentUser?.id;

    const roomId = this.route.snapshot.params['id'];
    if (!roomId) {
      this.router.navigate(['/dashboard/messages']);
      return;
    }

    this.loadMessages(roomId);
    this.setupWebSocket();
    this.subscribeToNewMessages();
  }

  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    this.chatService.disconnectWebSocket();
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
    }
  }

  setupWebSocket() {
    const currentUser = this.tokenService.getCurrentUser();
    const token = this.tokenService.getToken();
    
    if (currentUser?.id && token) {
      this.chatService.connectWebSocket(currentUser.id, token);
    }
  }

  subscribeToNewMessages() {
    this.messageSubscription = this.chatService.messages$.subscribe(messages => {
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.sender !== this.currentUserId) {
          this.messages.push(lastMessage);
          this.shouldScrollToBottom = true;
          this.markAsRead();
        }
      }
    });
  }

  loadMessages(roomId: number) {
    this.loading = true;
    this.chatService.getMessages({ chat_room: roomId }).subscribe({
      next: (response) => {
        this.messages = response.results;
        this.loading = false;
        this.shouldScrollToBottom = true;
        this.markAsRead();
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
    this.chatService.sendMessage(roomId, this.newMessage, this.selectedFile).subscribe({
      next: (message) => {
        this.messages.push(message);
        this.newMessage = '';
        this.selectedFile = undefined;
        if (this.fileUpload) {
          this.fileUpload.clear();
        }
        this.shouldScrollToBottom = true;
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to send message'
        });
      }
    });
  }

  onEnterPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.files[0];
    this.sendMessage();
  }

  downloadAttachment(message: Message) {
    this.chatService.downloadAttachment(message.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = message.attachment_name || 'attachment';
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

  markAsRead() {
    const roomId = this.route.snapshot.params['id'];
    if (roomId) {
      this.chatService.markAsRead(roomId).subscribe();
    }
  }

  getMessageActions(message: Message): MenuItem[] {
    return [
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteMessage(message)
      }
    ];
  }

  deleteMessage(message: Message) {
    this.chatService.deleteMessage(message.id).subscribe({
      next: () => {
        this.messages = this.messages.filter(m => m.id !== message.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Message deleted'
        });
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

  getParticipantName(): string {
    if (!this.chatRoom) return 'Loading...';
    const participant = this.chatRoom.participants.find(p => p !== this.currentUserId);
    return participant ? `User ${participant}` : 'Unknown User';
  }

  getParticipantInitials(): string {
    const name = this.getParticipantName();
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  getAvatarColor(): string {
    if (!this.chatRoom) return '#2196F3';
    const colors = [
      '#2196F3', '#4CAF50', '#FF9800', '#E91E63',
      '#9C27B0', '#00BCD4', '#FFEB3B', '#795548'
    ];
    const participant = this.chatRoom.participants.find(p => p !== this.currentUserId);
    return colors[participant ? participant % colors.length : 0];
  }

  private scrollToBottom() {
    try {
      const container = this.messageContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
      this.shouldScrollToBottom = false;
    } catch (err) {}
  }
} 