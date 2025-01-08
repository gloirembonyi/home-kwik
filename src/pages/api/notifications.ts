// notifications.ts
import { NotificationCount, NotificationsState } from '@/types/notification-types';
import { NextApiRequest, NextApiResponse } from 'next';

// Helper function to generate random severity
const getRandomSeverity = (): 'low' | 'medium' | 'high' => {
  const random = Math.random();
  if (random < 0.4) return 'low';
  if (random < 0.7) return 'medium';
  return 'high';
};

// Helper function to generate a random notification
const generateNotification = (maxCount: number = 1): NotificationCount => ({
  count: Math.floor(Math.random() * maxCount) + 1,
  severity: getRandomSeverity(),
  lastUpdated: Date.now(),
  isRead: false
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Generate mock notifications
    const mockNotifications: NotificationsState = {
      dashboard: generateNotification(3),
      users: generateNotification(5),
      requests: generateNotification(10),
      logs: generateNotification(3),
      refunds: generateNotification(5),
      'rides/analytics': generateNotification(3),
      'rides/fleet': generateNotification(2),
      transactions: generateNotification(7),
      issues: generateNotification(4)
    };

    // Add some randomization - sometimes sections won't have notifications
    const finalNotifications: NotificationsState = Object.entries(mockNotifications)
      .reduce((acc, [key, value]) => {
        
        if (Math.random() > 0.3) {
          acc[key] = value;
        }
        return acc;
      }, {} as NotificationsState);

    // Simulate network delay (remove in production)
    await new Promise(resolve => setTimeout(resolve, 200));

    return res.status(200).json(finalNotifications);
  } catch (error) {
    console.error('Error generating notifications:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}