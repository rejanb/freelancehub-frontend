import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { ApiConst } from '../app/const/api-const';
import { ApiResponse } from '../app/model/models';

export interface Notification {
  id: number;
  recipient: number;
  type: 'job' | 'proposal' | 'contract' | 'payment' | 'message' | 'review' | 'system';
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  data?: {
    job_id?: number;
    proposal_id?: number;
    contract_id?: number;
    payment_id?: number;
    message_id?: number;
    review_id?: number;
    [key: string]: any;
  };
}

export interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  notification_types: {
    job_alerts: boolean;
    proposal_updates: boolean;
    contract_updates: boolean;
    payment_alerts: boolean;
    messages: boolean;
    reviews: boolean;
    system_alerts: boolean;
  };
  email_frequency: 'instant' | 'daily' | 'weekly' | 'never';
}

export interface NotificationFilters {
  type?: string;
  is_read?: boolean;
  start_date?: string;
  end_date?: string;
  page?: number;
  page_size?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private baseUrl = `${ApiConst.API_URL}notifications/`;
  private wsUrl = ApiConst.WS_URL;
  private socket$?: WebSocketSubject<any>;
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);

  notifications$ = this.notificationsSubject.asObservable();
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Connect to WebSocket for real-time notifications
   */
  connectWebSocket(userId: number, token: string) {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket({
        url: `${this.wsUrl}notifications/?token=${token}&user_id=${userId}`,
        deserializer: msg => JSON.parse(msg.data),
        serializer: msg => JSON.stringify(msg)
      });

      this.socket$.subscribe({
        next: (notification) => {
          if (notification.type === 'notification') {
            const notifications = this.notificationsSubject.value;
            notifications.unshift(notification.data);
            this.notificationsSubject.next(notifications);
            
            if (!notification.data.is_read) {
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
   * Get all notifications with optional filtering
   */
  getNotifications(filters?: NotificationFilters): Observable<ApiResponse<Notification>> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof NotificationFilters];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<Notification>>(this.baseUrl, { params });
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}${notificationId}/read/`, {});
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}mark-all-read/`, {});
  }

  /**
   * Delete notification
   */
  deleteNotification(notificationId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${notificationId}/`);
  }

  /**
   * Clear all notifications
   */
  clearAllNotifications(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}clear-all/`);
  }

  /**
   * Get unread notification count
   */
  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.baseUrl}unread-count/`);
  }

  /**
   * Get notification preferences
   */
  getPreferences(): Observable<NotificationPreferences> {
    return this.http.get<NotificationPreferences>(`${this.baseUrl}preferences/`);
  }

  /**
   * Update notification preferences
   */
  updatePreferences(preferences: Partial<NotificationPreferences>): Observable<NotificationPreferences> {
    return this.http.patch<NotificationPreferences>(`${this.baseUrl}preferences/`, preferences);
  }

  /**
   * Subscribe to push notifications
   */
  subscribePushNotifications(subscription: PushSubscription): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}push-subscribe/`, {
      subscription: subscription.toJSON()
    });
  }

  /**
   * Unsubscribe from push notifications
   */
  unsubscribePushNotifications(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}push-unsubscribe/`, {});
  }

  /**
   * Test notification preferences
   */
  testNotification(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}test/`, {});
  }
} 