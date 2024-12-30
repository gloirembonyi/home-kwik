// Hook for React components

import { useEffect, useState } from "react";
import { NotificationService } from "./notifications-service";
import { NotificationsState } from "../../../../pages/api/notifications";

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationsState>({});

  useEffect(() => {
    const service = NotificationService.getInstance();

    const unsubscribe = service.subscribe(setNotifications);

    // Start polling
    service.startPolling();

    // Initial fetch
    service.fetchNotifications();

    return () => {
      unsubscribe();
      service.stopPolling();
    };
  }, []);

  return notifications;
}
