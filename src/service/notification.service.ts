import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { ApiConst } from '../app/const/api-const';
import { ApiResponse } from '../app/model/models';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

export interface Notification {
  id: number;
  user: number;
  title: string;
  message: string;
  notification_type: 'job' | 'proposal' | 'contract' | 'payment' | 'message' | 'review' | 'system' | 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high';
  is_read: boolean;
  content_type?: number;
  object_id?: string;
  action_url?: string;
  action_text?: string;
  data?: {
    job_id?: number;
    proposal_id?: number;
    contract_id?: number;
    payment_id?: number;
    message_id?: number;
    review_id?: number;
    [key: string]: any;
  };
  created_at: string;
  read_at?: string;
  link?: string;
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
  private socket?: WebSocket;
  private isConnected: boolean = false;
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);

  notifications$ = this.notificationsSubject.asObservable();
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private router: Router
  ) {}

  /**
   * Check if WebSocket is connected
   */
  isWebSocketConnected(): boolean {
    return this.isConnected && this.socket?.readyState === WebSocket.OPEN;
  }

  /**
   * Connect to WebSocket for real-time notifications
   */
  connectWebSocket(userId: number, token: string) {
    // Close existing connection if any
    if (this.socket) {
      console.log('Closing existing WebSocket connection');
      this.socket.close();
    }

    const wsUrl = `ws://localhost:8000/ws/notifications/?token=${token}`;
    console.log('Connecting to WebSocket:', wsUrl);
    
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = (event: Event) => {
      console.log('WebSocket connected successfully');
      this.isConnected = true;
    };

    this.socket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        
        if (data.type === 'notification') {
          // The notification data is in the 'data' field, not 'notification' field
          this.addNewNotification(data.data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onclose = (event: CloseEvent) => {
      console.log('WebSocket disconnected', event);
      this.isConnected = false;
      this.socket = undefined;
      
      // Reconnect after 5 seconds if it wasn't a clean close (increased delay to reduce spam)
      if (!event.wasClean) {
        setTimeout(() => {
          console.log('Attempting to reconnect WebSocket...');
          this.connectWebSocket(userId, token);
        }, 5000); // Increased from 3 to 5 seconds
      }
    };

    this.socket.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
      this.isConnected = false;
    };
  }

  disconnectWebSocket() {
    if (this.socket) {
      console.log('Disconnecting WebSocket');
      this.socket.close(1000, 'App closing'); // Clean close
      this.socket = undefined;
      this.isConnected = false;
    }
  }

  /**
   * Get all notifications with optional filtering
   */
  getNotifications(filters?: NotificationFilters): Observable<ApiResponse<Notification>> {
    let params = new HttpParams();
    
    // By default, request all notifications (no pagination)
    params = params.set('all', 'true');
    
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
   * Get paginated notifications (for performance when needed)
   */
  getPaginatedNotifications(page: number = 1, pageSize: number = 50, filters?: NotificationFilters): Observable<ApiResponse<Notification>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    
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
   * Test notification
   */
  testNotification(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}test/`, {});
  }

  /**
   * Add a new notification to the existing list (for real-time updates)
   */
  addNewNotification(notification: Notification): void {
    const currentNotifications = this.notificationsSubject.value || [];
    const updatedNotifications = [notification, ...currentNotifications];
    this.notificationsSubject.next(updatedNotifications);
    
    // Update unread count - use is_read field from backend
    const unreadCount = updatedNotifications.filter(n => !n.is_read).length;
    this.unreadCountSubject.next(unreadCount);
    
    // Show toast notification
    this.showNotificationToast(notification);
    
    console.log('Added new notification to list:', notification.title);
    console.log('Updated notifications count:', updatedNotifications.length);
    console.log('Unread count:', unreadCount);
  }

  /**
   * Show a toast notification for new real-time notifications
   */
  private showNotificationToast(notification: Notification): void {
    console.log('🍞 Showing toast for notification:', notification.title);
    
    const severity = this.getToastSeverity(notification.notification_type, notification.priority);
    
    // Create clickable action if notification has action URL
    const actionText = notification.action_text || 'View';
    const hasAction = Boolean(notification.action_url);
    
    const toastMessage = {
      severity: severity,
      summary: notification.title,
      detail: hasAction 
        ? `${notification.message} (Click to ${actionText.toLowerCase()})`
        : notification.message,
      life: notification.priority === 'high' ? 8000 : 5000, // High priority shows longer
      sticky: notification.priority === 'high', // High priority notifications are sticky
      closable: true,
      data: {
        notification: notification,
        hasAction: hasAction
      }
    };
    
    console.log('🍞 Toast message details:', toastMessage);
    this.messageService.add(toastMessage);
    console.log('🍞 Toast message sent to MessageService');
  }

  /**
   * Get appropriate toast severity based on notification type and priority
   */
  private getToastSeverity(type: string, priority: string): 'success' | 'info' | 'warn' | 'error' {
    // High priority notifications are always warnings or errors
    if (priority === 'high') {
      if (type === 'error' || type === 'payment') return 'error';
      return 'warn';
    }
    
    // Map notification types to toast severities
    switch (type) {
      case 'success':
      case 'payment':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warn';
      case 'system':
      case 'job':
      case 'proposal':
      case 'contract':
      case 'review':
      case 'message':
      default:
        return 'info';
    }
  }

  /**
   * Update the notifications state (for initial load)
   */
  updateNotifications(notifications: Notification[]): void {
    const safeNotifications = notifications || [];
    this.notificationsSubject.next(safeNotifications);
    const unreadCount = safeNotifications.filter(n => !n.read_at).length;
    this.unreadCountSubject.next(unreadCount);
  }

  /**
   * Get current notifications value
   */
  getCurrentNotifications(): Notification[] {
    return this.notificationsSubject.value;
  }
} 