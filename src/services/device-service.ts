import apiClient from '@/lib/api-client';

export interface Device {
  id: string;
  name: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: Date;
  isCurrentDevice?: boolean;
  icon?: any;
}

export const deviceService = {
  getDevices: async () => {
    const response = await apiClient.get('/devices');
    return response.data as Device[];
  },

  getCurrentDevice: async () => {
    const response = await apiClient.get('/devices/current');
    return response.data as Device;
  },

  revokeDevice: async (deviceId: string) => {
    const response = await apiClient.delete(`/devices/${deviceId}`);
    return response.data;
  },

  updateDeviceName: async (deviceId: string, name: string) => {
    const response = await apiClient.patch(`/devices/${deviceId}`, { name });
    return response.data;
  },
};