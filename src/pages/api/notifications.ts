// notifications.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { NotificationsState } from '@/types/notification-types';

function generateNotification(maxCount: number) {
  const count = Math.floor(Math.random() * maxCount) + 1;
  return {
    count,
    severity: count >= 10 ? 'high' : count >= 5 ? 'medium' : 'low',
    lastUpdated: Date.now() - Math.floor(Math.random() * 3600000), // Random time within last hour
    isRead: false
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NotificationsState>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' } as any);
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const notifications: NotificationsState = {
    dashboard: {
      count: Math.floor(Math.random() * 3) + 1,
      severity: Math.floor(Math.random() * 3) + 1 >= 10 ? 'high' : Math.floor(Math.random() * 3) + 1 >= 5 ? 'medium' : 'low' as 'high' | 'medium' | 'low',
      lastUpdated: Date.now() - Math.floor(Math.random() * 3600000),
      isRead: false
    },
    users: {
      count: Math.floor(Math.random() * 5) + 1,
      severity: Math.floor(Math.random() * 5) + 1 >= 10 ? 'high' : Math.floor(Math.random() * 5) + 1 >= 5 ? 'medium' : 'low' as 'high' | 'medium' | 'low',
      lastUpdated: Date.now() - Math.floor(Math.random() * 3600000),
      isRead: false
    },
    requests: {
      count: Math.floor(Math.random() * 10) + 1,
      severity: Math.floor(Math.random() * 10) + 1 >= 10 ? 'high' : Math.floor(Math.random() * 10) + 1 >= 5 ? 'medium' : 'low' as 'high' | 'medium' | 'low',
      lastUpdated: Date.now() - Math.floor(Math.random() * 3600000),
      isRead: false
    },
    logs: {
      count: Math.floor(Math.random() * 3) + 1,
      severity: Math.floor(Math.random() * 3) + 1 >= 10 ? 'high' : Math.floor(Math.random() * 3) + 1 >= 5 ? 'medium' : 'low' as 'high' | 'medium' | 'low',
      lastUpdated: Date.now() - Math.floor(Math.random() * 3600000),
      isRead: false
    },
    refunds: {
      count: Math.floor(Math.random() * 5) + 1,
      severity: Math.floor(Math.random() * 5) + 1 >= 10 ? 'high' : Math.floor(Math.random() * 5) + 1 >= 5 ? 'medium' : 'low' as 'high' | 'medium' | 'low',
      lastUpdated: Date.now() - Math.floor(Math.random() * 3600000),
      isRead: false
    },
    'rides/analytics': {
      count: Math.floor(Math.random() * 3) + 1,
      severity: Math.floor(Math.random() * 3) + 1 >= 10 ? 'high' : Math.floor(Math.random() * 3) + 1 >= 5 ? 'medium' : 'low' as 'high' | 'medium' | 'low',
      lastUpdated: Date.now() - Math.floor(Math.random() * 3600000),
      isRead: false
    },
    'rides/fleet': {
      count: Math.floor(Math.random() * 2) + 1,
      severity: Math.floor(Math.random() * 2) + 1 >= 10 ? 'high' : Math.floor(Math.random() * 2) + 1 >= 5 ? 'medium' : 'low' as 'high' | 'medium' | 'low',
      lastUpdated: Date.now() - Math.floor(Math.random() * 3600000),
      isRead: false
    },
    transactions: {
      count: Math.floor(Math.random() * 7) + 1,
      severity: Math.floor(Math.random() * 7) + 1 >= 10 ? 'high' : Math.floor(Math.random() * 7) + 1 >= 5 ? 'medium' : 'low' as 'high' | 'medium' | 'low',
      lastUpdated: Date.now() - Math.floor(Math.random() * 3600000),
      isRead: false
    }
  };

  res.status(200).json(notifications);
}