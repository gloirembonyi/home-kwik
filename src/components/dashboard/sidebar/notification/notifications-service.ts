import { NotificationsState } from "@/types/notification-types";


// notifications-service.ts
export class NotificationService {
  private static instance: NotificationService;
  private listeners: ((notifications: NotificationsState) => void)[] = [];
  private currentNotifications: NotificationsState = {};
  private polling: boolean = false;
  private pollInterval: number = 30000;
  private lastFetchTime: number = 0;
  private readonly FETCH_COOLDOWN = 5000;
  private activePaths: Set<string> = new Set();

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private loadFromStorage() {
    try {
      const savedNotifications = localStorage.getItem('currentNotifications');
      if (savedNotifications) {
        this.currentNotifications = JSON.parse(savedNotifications);
        this.cleanupOldNotifications();
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      this.currentNotifications = {};
    }
  }

  private cleanupOldNotifications() {
    const now = Date.now();
    Object.entries(this.currentNotifications).forEach(([path, notification]) => {
      if (now - notification.lastUpdated > 24 * 60 * 60 * 1000) {
        delete this.currentNotifications[path];
      }
    });
    this.saveToStorage();
  }

  private saveToStorage() {
    try {
      localStorage.setItem('currentNotifications', JSON.stringify(this.currentNotifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }

  calculateSeverity(count: number): 'low' | 'medium' | 'high' {
    if (count >= 10) return 'high';
    if (count >= 5) return 'medium';
    return 'low';
  }

  formatNotificationCount(count: number): string {
    return count > 99 ? '99+' : count.toString();
  }

  setActivePath(path: string) {
    this.activePaths.add(path);
    if (this.currentNotifications[path]) {
      this.markAsRead(path);
    }
  }

  clearActivePath(path: string) {
    this.activePaths.delete(path);
  }

  async fetchNotifications(): Promise<NotificationsState> {
    const now = Date.now();
    if (now - this.lastFetchTime < this.FETCH_COOLDOWN) {
      return this.currentNotifications;
    }

    try {
      const response = await fetch('/api/notifications');
      if (!response.ok) throw new Error('Failed to fetch notifications');
      
      const newNotifications: NotificationsState = await response.json();
      this.lastFetchTime = now;

      // Merge with existing notifications
      Object.entries(newNotifications).forEach(([path, notification]) => {
        const isPathActive = this.activePaths.has(path);
        const existing = this.currentNotifications[path];

        if (isPathActive) {
          // For active paths, only update if newer
          if (!existing || notification.lastUpdated > existing.lastUpdated) {
            this.currentNotifications[path] = {
              ...notification,
              isRead: false,
              lastUpdated: now
            };
          }
        } else {
          // For inactive paths, accumulate notifications
          if (!existing || existing.isRead) {
            this.currentNotifications[path] = {
              ...notification,
              isRead: false,
              lastUpdated: now
            };
          } else {
            const newCount = existing.count + notification.count;
            this.currentNotifications[path] = {
              ...existing,
              count: Math.min(newCount, 999),
              severity: this.calculateSeverity(newCount),
              lastUpdated: now
            };
          }
        }
      });

      this.saveToStorage();
      this.notifyListeners();
      return this.currentNotifications;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      return this.currentNotifications;
    }
  }

  markAsRead(path: string) {
    if (this.currentNotifications[path]) {
      this.currentNotifications[path] = {
        ...this.currentNotifications[path],
        isRead: true,
        count: 0,
        lastUpdated: Date.now()
      };
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  clearNotification(path: string) {
    if (this.currentNotifications[path]) {
      delete this.currentNotifications[path];
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  subscribe(listener: (notifications: NotificationsState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  startPolling() {
    if (this.polling) return;
    this.polling = true;
    this.poll();
  }

  stopPolling() {
    this.polling = false;
  }

  private async poll() {
    while (this.polling) {
      await this.fetchNotifications();
      await new Promise(resolve => setTimeout(resolve, this.pollInterval));
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentNotifications));
  }

  // For testing purposes
  setNotifications(notifications: NotificationsState) {
    this.currentNotifications = notifications;
    this.notifyListeners();
  }
}