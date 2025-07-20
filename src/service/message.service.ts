import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { ApiConst } from '../app/const/api-const';
import { ApiResponse } from '../app/model/models';

export interface Message {
  id: number;
  sender: number;
  receiver: number;
  content: string;
  attachment?: string;
  attachment_type?: string;
  attachment_name?: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatRoom {
  id: number;
  participants: number[];
  last_message?: Message;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface MessageFilters {
  chat_room?: number;
  search?: string;
  before?: string;
  after?: string;
  page?: number;
  page_size?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl = `${ApiConst.API_URL}messages/`;
  private wsUrl = ApiConst.WS_URL;
  private socket$?: WebSocketSubject<any>;
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);

  messages$ = this.messagesSubject.asObservable();
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Connect to WebSocket for real-time messaging
   */
  connectWebSocket(userId: number, token: string) {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket({
        url: `${this.wsUrl}chat/?token=${token}&user_id=${userId}`,
        deserializer: msg => JSON.parse(msg.data),
        serializer: msg => JSON.stringify(msg)
      });

      this.socket$.subscribe({
        next: (message) => {
          if (message.type === 'message') {
            const messages = this.messagesSubject.value;
            messages.push(message.data);
            this.messagesSubject.next(messages);
            
            if (!message.data.is_read) {
              this.unreadCountSubject.next(this.unreadCountSubject.value + 1);
            }
          }
        },
        error: (error) => {
          console.error('WebSocket error:', error);
          // Attempt to reconnect after 5 seconds
          setTimeout(() => this.connectWebSocket(userId, token), 5000);
        }
      });
    }
  }

  /**
   * Disconnect WebSocket
   */
  disconnectWebSocket() {
    if (this.socket$) {
      this.socket$.complete();
    }
  }

  /**
   * Send message through WebSocket
   */
  sendMessage(chatRoomId: number, content: string, attachment?: File): Observable<Message> {
    if (attachment) {
      const formData = new FormData();
      formData.append('chat_room', chatRoomId.toString());
      formData.append('content', content);
      formData.append('attachment', attachment);

      return this.http.post<Message>(`${this.baseUrl}send/`, formData);
    } else {
      return this.http.post<Message>(`${this.baseUrl}send/`, {
        chat_room: chatRoomId,
        content
      });
    }
  }

  /**
   * Get chat rooms for current user
   */
  getChatRooms(): Observable<ApiResponse<ChatRoom>> {
    return this.http.get<ApiResponse<ChatRoom>>(`${this.baseUrl}rooms/`);
  }

  /**
   * Get or create chat room with user
   */
  getChatRoomWithUser(userId: number): Observable<ChatRoom> {
    return this.http.post<ChatRoom>(`${this.baseUrl}rooms/`, {
      participant_id: userId
    });
  }

  /**
   * Get messages for a chat room
   */
  getMessages(filters: MessageFilters): Observable<ApiResponse<Message>> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof MessageFilters];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<Message>>(`${this.baseUrl}`, { params });
  }

  /**
   * Mark messages as read
   */
  markAsRead(chatRoomId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}rooms/${chatRoomId}/read/`, {});
  }

  /**
   * Delete message
   */
  deleteMessage(messageId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${messageId}/`);
  }

  /**
   * Get unread message count
   */
  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.baseUrl}unread/`);
  }

  /**
   * Download message attachment
   */
  downloadAttachment(messageId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}${messageId}/attachment/`, {
      responseType: 'blob'
    });
  }

  /**
   * Search messages
   */
  searchMessages(query: string): Observable<ApiResponse<Message>> {
    return this.http.get<ApiResponse<Message>>(`${this.baseUrl}search/`, {
      params: { q: query }
    });
  }
} 