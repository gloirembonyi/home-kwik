export interface NotificationCount {
    count: number;
    severity: 'low' | 'medium' | 'high';
    lastUpdated: number;
    isRead?: boolean;
  }
  
  export type NotificationsState = Record<string, NotificationCount>;


  