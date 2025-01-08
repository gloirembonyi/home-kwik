import { NotificationItem, NotificationsState } from '@/types/notification-types';
import { v4 as uuidv4 } from 'uuid';

export class NotificationService {
  private static instance: NotificationService;
  private listeners: ((notifications: NotificationsState) => void)[] = [];
  private notificationItems: NotificationItem[] = [];
  private ws: WebSocket | null = null;

  private constructor() {
    this.initializeWebSocket();
    this.loadFromStorage();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private initializeWebSocket() {
    // Replace with your WebSocket server URL
    this.ws = new WebSocket('wss://your-websocket-server.com');
    
    this.ws.onmessage = (event) => {
      const notification: NotificationItem = JSON.parse(event.data);
      this.addNotification(notification);
    };

    this.ws.onclose = () => {
      setTimeout(() => this.initializeWebSocket(), 5000);
    };
  }

  private addNotification(notification: NotificationItem) {
    this.notificationItems.unshift({
      ...notification,
      id: uuidv4(),
      timestamp: Date.now(),
      isRead: false
    });
    this.updateNotificationCounts();
    this.saveToStorage();
  }

  private updateNotificationCounts() {
    const counts: NotificationsState = {};
    
    this.notificationItems.forEach(notification => {
      if (!notification.isRead) {
        if (!counts[notification.path]) {
          counts[notification.path] = {
            count: 0,
            severity: 'low',
            lastUpdated: notification.timestamp,
            isRead: false
          };
        }
        counts[notification.path].count++;
        counts[notification.path].severity = this.calculateSeverity(counts[notification.path].count);
      }
    });

    this.listeners.forEach(listener => listener(counts));
  }

  markAsRead(path: string) {
    this.notificationItems = this.notificationItems.map(notification => 
      notification.path === path ? { ...notification, isRead: true } : notification
    );
    this.updateNotificationCounts();
    this.saveToStorage();
  }

  markAllAsRead() {
    this.notificationItems = this.notificationItems.map(notification => ({
      ...notification,
      isRead: true
    }));
    this.updateNotificationCounts();
    this.saveToStorage();
  }

  getNotifications(path?: string): NotificationItem[] {
    return this.notificationItems
      .filter(notification => !path || notification.path === path)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  private calculateSeverity(count: number): 'low' | 'medium' | 'high' {
    if (count >= 10) return 'high';
    if (count >= 5) return 'medium';
    return 'low';
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('notifications');
      if (stored) {
        this.notificationItems = JSON.parse(stored);
        this.updateNotificationCounts();
      }
    } catch (error) {
      console.error('Error loading notifications from storage:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('notifications', JSON.stringify(this.notificationItems));
    } catch (error) {
      console.error('Error saving notifications to storage:', error);
    }
  }

  subscribe(listener: (notifications: NotificationsState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(notifications: NotificationsState) {
    this.listeners.forEach(listener => listener(notifications));
  }

  // ... (keep existing storage and subscription methods)
} 