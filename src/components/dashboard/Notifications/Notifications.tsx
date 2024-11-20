// AdminNotifications.tsx
import React, { useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/base/alert";
import { Button } from "@/components/ui/base/button";
import { AnalyticsApiService } from "@/services/analyticsService";
import { AnalyticsService } from "@/services/analytics";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/base/alert-dialog";

type NotificationType = "alert" | "notification";

interface Notification {
  type: NotificationType;
  message: string;
}

const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertDialogMessage, setAlertDialogMessage] = useState("");

  const handleCreateNotification = (
    type: NotificationType,
    message: string
  ) => {
    const newNotification: Notification = { type, message };
    setNotifications([...notifications, newNotification]);
    AnalyticsService.getInstance().trackEvent("admin_notification_created", {
      type,
      message,
    });
  };

  const handleCloseNotification = (index: number) => {
    const updatedNotifications = [...notifications];
    updatedNotifications.splice(index, 1);
    setNotifications(updatedNotifications);
  };

  const handleShowAlertDialog = (message: string) => {
    setAlertDialogMessage(message);
    setShowAlertDialog(true);
  };

  const handleCloseAlertDialog = () => {
    setShowAlertDialog(false);
  };

  const handleSendUserAlert = () => {
    handleCreateNotification("alert", alertDialogMessage);
    handleCloseAlertDialog();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-4">
      {notifications.map((notification, index) => (
        <Alert
          key={index}
          variant={notification.type === "alert" ? "destructive" : "default"}
        >
          <AlertTitle>
            {notification.type === "alert" ? "Alert" : "Notification"}
          </AlertTitle>
          <AlertDescription>{notification.message}</AlertDescription>
          <Button onClick={() => handleCloseNotification(index)}>Close</Button>
        </Alert>
      ))}

      <AlertDialog open={showAlertDialog} onOpenChange={handleCloseAlertDialog}>
        <AlertDialogAction>
          <AlertDialogHeader>
            <AlertDialog>Send User Alert</AlertDialog>
          </AlertDialogHeader>
          <AlertDescription>{alertDialogMessage}</AlertDescription>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleCloseAlertDialog}>
              Cancel
            </AlertDialogAction>
            <AlertDialogAction
              onClick={handleSendUserAlert}
              className="destructive-button"
            >
              Send Alert
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogAction>
      </AlertDialog>
    </div>
  );
};

export default AdminNotifications;
