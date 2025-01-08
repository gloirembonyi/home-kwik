// hooks.ts
import { useEffect, useState } from 'react';
import { NotificationService } from './notifications-service';
import { NotificationsState } from '@/types/notification-types';



export function useNotifications(activePath?: string) {
  const [notifications, setNotifications] = useState<NotificationsState>({});

  useEffect(() => {
    const service = NotificationService.getInstance();

    if (activePath) {
      service.setActivePath(activePath);
    }

    const unsubscribe = service.subscribe(setNotifications);
    service.startPolling();
    service.fetchNotifications();

    return () => {
      unsubscribe();
      if (activePath) {
        service.clearActivePath(activePath);
      }
      service.stopPolling();
    };
  }, [activePath]);

  return notifications;
}