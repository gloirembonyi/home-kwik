import apiClient from '@/lib/api-client';

export interface UpdateProfileData {
  fullName?: string;
  email?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const userService = {
  // Profile
  updateProfile: async (data: UpdateProfileData) => {
    const response = await apiClient.post('/users/profile/update', data);
    return response.data;
  },

  updateAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await apiClient.post('/users/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteAccount: async () => {
    const response = await apiClient.delete('/users/account');
    return response.data;
  },

  // Security
  updatePassword: async (data: UpdatePasswordData) => {
    const response = await apiClient.post('/users/security/password', data);
    return response.data;
  },

  togglePasswordlessLogin: async (enabled: boolean) => {
    const response = await apiClient.post('/users/security/passwordless', { enabled });
    return response.data;
  },

  toggle2FA: async (enabled: boolean) => {
    const response = await apiClient.post('/users/security/2fa', { enabled });
    return response.data;
  },

  verify2FA: async (code: string) => {
    const response = await apiClient.post('/users/security/2fa/verify', { code });
    return response.data;
  },

  getLoginHistory: async () => {
    const response = await apiClient.get('/users/security/login-history');
    return response.data;
  },
}; 