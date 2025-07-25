import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { ApiConst } from '../app/const/api-const';
import { ApiResponse } from '../app/model/models';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface Message {
  id: number;
  sender: User;
  content: string;
  attachment?: {
    name: string;
    size: number;
    type: string;
    url: string;
  };
  message_type: 'text' | 'image' | 'file';
  is_read: boolean;
  read_by: number[];
  read_by_users?: any;
  created_at: string;
  updated_at: string;
  chat_room: number;
}

export interface ChatRoom {
  id: number;
  name?: string;
  participants: User[];
  is_group: boolean;
  last_message?: Message;
  unread_count: number;
  created_at: string;
  updated_at: string;
  related_job?: number;
  related_contract?: number;
}

export interface MessageFilters {
  chat_room?: number;
  search?: string;
  before?: string;
  after?: string;
  page?: number;
  page_size?: number;
}

export interface TypingIndicator {
  user_id: number;
  username: string;
  is_typing: boolean;
}

export interface WebSocketMessage {
  type: 'chat_message' | 'typing_indicator' | 'user_joined' | 'user_left';
  message?: Message;
  user_id?: number;
  username?: string;
  is_typing?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private chatRoomsUrl = `${ApiConst.API_URL}chats/chatrooms/`;
  private messagesUrl = `${ApiConst.API_URL}chats/messages/`;
  private wsUrl = 'ws://localhost:8000/ws/chat/';

  private socket$?: WebSocketSubject<any>;
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  private chatRoomsSubject = new BehaviorSubject<ChatRoom[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);
  private typingSubject = new Subject<TypingIndicator>();
  private onlineUsersSubject = new BehaviorSubject<number[]>([]);

  messages$ = this.messagesSubject.asObservable();
  chatRooms$ = this.chatRoomsSubject.asObservable();
  unreadCount$ = this.unreadCountSubject.asObservable();
  typing$ = this.typingSubject.asObservable();
  onlineUsers$ = this.onlineUsersSubject.asObservable();

  private currentChatRoomId?: number;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(private http: HttpClient) {
    this.loadUnreadCount();
  }

  /**
   * Connect to WebSocket for real-time messaging
   */
  connectToRoom(chatRoomId: number, token?: string): void {
    this.currentChatRoomId = chatRoomId;
    this.disconnectWebSocket();

    // Get the JWT token for authentication
    if (!token) {
      token = localStorage.getItem('access') || undefined;
    }

    if (!token) {
      console.error('No JWT token available for WebSocket connection');
      return;
    }

    const wsUrl = `${this.wsUrl}${chatRoomId}/?token=${token}`;
    console.log('Connecting to chat WebSocket:', wsUrl);

    this.socket$ = webSocket({
      url: wsUrl,
      openObserver: {
        next: () => {
          console.log('Connected to chat room', chatRoomId);
          this.reconnectAttempts = 0;
        }
      },
      closeObserver: {
        next: () => {
          console.log('Disconnected from chat room', chatRoomId);
          this.handleReconnection();
        }
      }
    });

    this.socket$.subscribe({
      next: (wsMessage: WebSocketMessage) => {
        this.handleWebSocketMessage(wsMessage);
      },
      error: (error) => {
        console.error('WebSocket error:', error);
        this.handleReconnection();
      }
    });
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleWebSocketMessage(wsMessage: WebSocketMessage): void {
    switch (wsMessage.type) {
      case 'chat_message':
        if (wsMessage.message) {
          this.addNewMessage(wsMessage.message);
        }
        break;

      case 'typing_indicator':
        if (wsMessage.user_id && wsMessage.username !== undefined && wsMessage.is_typing !== undefined) {
          this.typingSubject.next({
            user_id: wsMessage.user_id,
            username: wsMessage.username,
            is_typing: wsMessage.is_typing
          });
        }
        break;

      case 'user_joined':
        if (wsMessage.user_id) {
          const onlineUsers = this.onlineUsersSubject.value;
          if (!onlineUsers.includes(wsMessage.user_id)) {
            this.onlineUsersSubject.next([...onlineUsers, wsMessage.user_id]);
          }
        }
        break;

      case 'user_left':
        if (wsMessage.user_id) {
          const onlineUsers = this.onlineUsersSubject.value;
          this.onlineUsersSubject.next(onlineUsers.filter(id => id !== wsMessage.user_id));
        }
        break;
    }
  }

  /**
   * Handle WebSocket reconnection
   */
  private handleReconnection(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts && this.currentChatRoomId) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        this.connectToRoom(this.currentChatRoomId!);
      }, delay);
    }
  }

  /**
   * Add new message to the current messages list
   */
  private addNewMessage(message: Message): void {
    const currentMessages = this.messagesSubject.value;

    // Check if message already exists (prevent duplicates)
    if (!currentMessages.find(m => m.id === message.id)) {
      this.messagesSubject.next([...currentMessages, message]);

      // Update unread count if it's not from current user
      if (!message.read_by.includes(this.getCurrentUserId())) {
        this.unreadCountSubject.next(this.unreadCountSubject.value + 1);
      }

      // Update chat rooms list
      this.updateChatRoomLastMessage(message);
    }
  }

  /**
   * Update chat room with new last message
   */
  private updateChatRoomLastMessage(message: Message): void {
    const chatRooms = this.chatRoomsSubject.value;
    const updatedRooms = chatRooms.map(room => {
      if (room.id === message.chat_room) {
        return {
          ...room,
          last_message: message,
          updated_at: message.created_at
        };
      }
      return room;
    });
    this.chatRoomsSubject.next(updatedRooms);
  }

  /**
   * Disconnect WebSocket
   */
  disconnectWebSocket(): void {
    if (this.socket$ && !this.socket$.closed) {
      this.socket$.complete();
    }
  }

  /**
   * Send message through WebSocket and API
   */
  sendMessage(chatRoomId: number, content: string, attachment?: File): Observable<Message> {
    if (attachment) {
      // For file attachments, still use HTTP API
      const formData = new FormData();
      formData.append('chat_room_id', chatRoomId.toString());
      formData.append('content', content);
      formData.append('attachment', attachment);

      return this.http.post<Message>(`${this.messagesUrl}send/`, formData);
    } else {
      // For text messages, use WebSocket for real-time delivery
      return this.sendMessageViaWebSocket(content);
    }
  }

  /**
   * Send message via WebSocket for real-time delivery
   */
  private sendMessageViaWebSocket(content: string): Observable<Message> {
    return new Observable(observer => {
      if (this.socket$ && !this.socket$.closed) {
        // Send via WebSocket
        this.socket$.next({
          type: 'chat_message',
          message: content
        });

        // Create a temporary message object for immediate UI feedback
        const tempMessage: Message = {
          id: Date.now(), // Temporary ID
          content,
          sender: {
            id: this.getCurrentUserId(),
            username: 'You',
            email: ''
          },
          message_type: 'text',
          attachment: undefined,
          is_read: false,
          read_by: [],
          chat_room: this.currentChatRoomId || 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        observer.next(tempMessage);
        observer.complete();
      } else {
        observer.error(new Error('WebSocket not connected'));
      }
    });
  }

  private getCurrentUserId(): number {
    // Get current user ID from token or storage
    const token = localStorage.getItem('access');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.user_id;
      } catch (e) {
        console.error('Error parsing token:', e);
      }
    }
    return 0;
  }

  /**
   * Send typing indicator
   */
  sendTypingIndicator(isTyping: boolean): void {
    if (this.socket$ && !this.socket$.closed) {
      this.socket$.next({
        type: 'typing',
        is_typing: isTyping
      });
    }
  }

  /**
   * Get chat rooms for current user
   */
  getChatRooms(): Observable<any> {
    const params = new HttpParams().set('all', 'true'); // Get all rooms without pagination
    return this.http.get<any>(this.chatRoomsUrl, { params }).pipe(
      map(response => {
        if (response.results) {
          return response;
        }
        // If it's already an array, wrap it in paginated format
        return { results: response, count: response.length };
      })
    );
  }

  /**
   * Get or create chat room with user
   */
  getOrCreateChatRoomWithUser(userId: number): Observable<ChatRoom> {
    return this.http.post<ChatRoom>(`${this.chatRoomsUrl}get_or_create_with_user/`, {
      user_id: userId
    });
  }

  /**
   * Get messages for a chat room
   */
  getRoomMessages(roomId: number): Observable<any> {
    const params = new HttpParams().set('all', 'true'); // Get all messages without pagination
    return this.http.get<any>(`${this.chatRoomsUrl}${roomId}/messages/`, { params }).pipe(
      map(response => {
        if (response.results) {
          return response.results;
        }
        // If it's already an array, wrap it in paginated format
        return { results: response, count: response.length };
      })
    );
  }

  /**
   * Mark chat room as read
   */
  markRoomAsRead(chatRoomId: number): Observable<void> {
    return this.http.post<void>(`${this.chatRoomsUrl}${chatRoomId}/mark_as_read/`, {});
  }

  /**
   * Mark specific message as read
   */
  markMessageAsRead(messageId: number): Observable<void> {
    return this.http.post<void>(`${this.messagesUrl}${messageId}/mark_read/`, {});
  }

  /**
   * Delete message
   */
  deleteMessage(messageId: number): Observable<void> {
    return this.http.delete<void>(`${this.messagesUrl}${messageId}/`);
  }

  /**
   * Get unread message count
   */
  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.messagesUrl}unread_count/`);
  }

  /**
   * Load unread count and update subject
   */
  loadUnreadCount(): void {
    this.getUnreadCount().subscribe({
      next: (response) => {
        this.unreadCountSubject.next(response.count);
      },
      error: (error) => {
        console.error('Error loading unread count:', error);
      }
    });
  }

  /**
   * Download message attachment
   */
  downloadAttachment(messageId: number): Observable<Blob> {
    return this.http.get(`${this.messagesUrl}${messageId}/download/`, {
      responseType: 'blob'
    });
  }

  /**
   * Search messages
   */
  searchMessages(query: string): Observable<ApiResponse<Message>> {
    const params = new HttpParams().set('q', query);
    return this.http.get<ApiResponse<Message>>(`${this.messagesUrl}search/`, { params });
  }

  /**
   * Update messages list
   */
  setMessages(messages: Message[]): void {
    this.messagesSubject.next(messages);
  }

  /**
   * Update chat rooms list
   */
  setChatRooms(chatRooms: ChatRoom[]): void {
    this.chatRoomsSubject.next(chatRooms);
  }

  /**
   * Clean up on service destruction
   */
  ngOnDestroy(): void {
    this.disconnectWebSocket();
  }
}
