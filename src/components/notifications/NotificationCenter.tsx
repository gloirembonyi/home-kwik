import React, { useEffect, useState } from "react";
import { NotificationService } from "@/services/NotificationService";
import { NotificationItem } from "@/types/notification-types";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const service = NotificationService.getInstance();

  useEffect(() => {
    const updateNotifications = () => {
      setNotifications(service.getNotifications());
    };

    updateNotifications();
    const unsubscribe = service.subscribe(() => updateNotifications());

    return () => unsubscribe();
  }, []);

  const handleMarkAsRead = (notification: NotificationItem) => {
    service.markAsRead(notification.path);
  };

  const handleMarkAllAsRead = () => {
    service.markAllAsRead();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <Bell className="w-6 h-6" />
        {notifications.some((n) => !n.isRead) && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg"
          >
            {/* Notification list implementation */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
