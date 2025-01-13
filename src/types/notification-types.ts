export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: number;
  isRead: boolean;
  path: string;
  severity: 'low' | 'medium' | 'high';
}

export interface NotificationCount {
  count: number;
  severity: 'low' | 'medium' | 'high';
  lastUpdated: number;
  isRead: boolean;
}

export type NotificationsState = Record<string, NotificationCount>;


  