// notifications.test.ts
import { NotificationsState } from '@/types/notification-types';
import { NotificationService } from './notifications-service';


describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    service = NotificationService.getInstance();
  });

  afterEach(() => {
    service.stopPolling();
  });

  test('subscribes to notifications', (done) => {
    const mockNotifications: NotificationsState = {
      dashboard: {
        count: 5,
        severity: 'high',
        lastUpdated: Date.now(),
        isRead: false
      }
    };

    const listener = (notifications: NotificationsState) => {
      expect(notifications).toEqual(mockNotifications);
      done();
    };

    service.subscribe(listener);
    service.setNotifications(mockNotifications);
  });

  test('clears notifications', () => {
    const mockNotifications: NotificationsState = {
      dashboard: {
        count: 5,
        severity: 'high',
        lastUpdated: Date.now(),
        isRead: false
      }
    };

    service.setNotifications(mockNotifications);
    service.clearNotification('dashboard');

    const listener = (notifications: NotificationsState) => {
      expect(notifications.dashboard.count).toBe(0);
    };

    service.subscribe(listener);
  });
});