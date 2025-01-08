// hooks.ts
import { useEffect, useState, useCallback } from "react";
import { NotificationService } from "./notifications-service";
import { NotificationsState } from "@/types/notification-types";

export function useNotifications(activePath?: string) {
  const [notifications, setNotifications] = useState<NotificationsState>({});
  const service = NotificationService.getInstance();

  const handleNotificationUpdate = useCallback(
    (newNotifications: NotificationsState) => {
      setNotifications(newNotifications);
    },
    []
  );

  useEffect(() => {
    if (activePath) {
      service.setActivePath(activePath);
    }

    const unsubscribe = service.subscribe(handleNotificationUpdate);
    service.startPolling();
    service.fetchNotifications();

    return () => {
      unsubscribe();
      if (activePath) {
        service.clearActivePath(activePath);
      }
      service.stopPolling();
    };
  }, [activePath, service, handleNotificationUpdate]);

  return notifications;
}
