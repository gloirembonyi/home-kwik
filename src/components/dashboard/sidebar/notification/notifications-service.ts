import { NotificationsState } from "../../../../pages/api/notifications";

type Notification = {
  count: number;
  severity: 'low' | 'medium' | 'high';
  lastUpdated: number;
  isRead: boolean;
};

export class NotificationService {
  private static instance: NotificationService;
  private listeners: ((notifications: NotificationsState) => void)[] = [];
  private currentNotifications: NotificationsState = {};
  private polling: boolean = false;
  private pollInterval: number = 30000;

  private constructor() {
    const savedNotifications = localStorage.getItem('currentNotifications');
    if (savedNotifications) {
      this.currentNotifications = JSON.parse(savedNotifications);
    }
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async fetchNotifications(): Promise<NotificationsState> {
    try {
      const response = await fetch('api/notifications');
      const newNotifications: Record<string, Notification> = await response.json();

      // Merge new notifications with existing ones
      const mergedNotifications = { ...this.currentNotifications };

      Object.entries(newNotifications).forEach(([path, notification]) => {
        if (!mergedNotifications[path] || mergedNotifications[path].isRead) {
          // If no existing notification or it was read, create new
          mergedNotifications[path] = {
            ...notification,
            isRead: false
          };
        } else {
          // If existing unread notification, accumulate count
          mergedNotifications[path] = {
            ...mergedNotifications[path],
            count: mergedNotifications[path].count + notification.count,
            severity: this.calculateSeverity(mergedNotifications[path].count + notification.count),
            lastUpdated: Date.now()
          };
        }
      });

      this.currentNotifications = mergedNotifications;
      localStorage.setItem('currentNotifications', JSON.stringify(this.currentNotifications));
      this.notifyListeners();
      return this.currentNotifications;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      return this.currentNotifications;
    }
  }

  private calculateSeverity(count: number): 'low' | 'medium' | 'high' {
    if (count > 10) return 'high';
    if (count > 5) return 'medium';
    return 'low';
  }

  markAsRead(path: string) {
    console.log('Marking as read:', path); // Debug log
    if (this.currentNotifications[path]) {
      this.currentNotifications[path].isRead = true;
      this.currentNotifications[path].count = 0;
      localStorage.setItem('currentNotifications', JSON.stringify(this.currentNotifications));
      this.notifyListeners();
      console.log('Updated notifications:', this.currentNotifications); // Debug log
    }
  }

  clearNotification(path: string) {
    console.log('Clearing notification:', path); // Debug log
    if (this.currentNotifications[path]) {
      delete this.currentNotifications[path];
      localStorage.setItem('currentNotifications', JSON.stringify(this.currentNotifications));
      this.notifyListeners();
      console.log('Notifications after clear:', this.currentNotifications); // Debug log
    }
  }

  getCurrentNotifications(): NotificationsState {
    return this.currentNotifications;
  }

  subscribe(listener: (notifications: NotificationsState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener({ ...this.currentNotifications }));
  }

  startPolling(interval: number = this.pollInterval) {
    if (this.polling) return;
    this.polling = true;
    this.pollInterval = interval;
    
    const poll = async () => {
      if (!this.polling) return;
      await this.fetchNotifications();
      setTimeout(poll, this.pollInterval);
    };
    poll();
  }

  stopPolling() {
    this.polling = false;
  }

  setNotifications(notifications: NotificationsState) {
    this.currentNotifications = notifications;
    this.notifyListeners();
  }
}