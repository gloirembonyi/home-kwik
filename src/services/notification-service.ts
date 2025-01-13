import apiClient from '@/lib/api-client';

export interface EmailNotificationSettings {
  productUpdates: boolean;
  securityUpdates: boolean;
}

export interface PhoneNotificationSettings {
  securityUpdates: boolean;
}

export const notificationService = {
  updateEmailSettings: async (settings: EmailNotificationSettings) => {
    const response = await apiClient.patch('/notifications/email', settings);
    return response.data;
  },

  updatePhoneSettings: async (settings: PhoneNotificationSettings) => {
    const response = await apiClient.patch('/notifications/phone', settings);
    return response.data;
  },

  testNotification: async (type: 'email' | 'phone') => {
    const response = await apiClient.post('/notifications/test', { type });
    return response.data;
  },
}; 