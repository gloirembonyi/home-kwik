import axios from 'axios';
// import { Vehicle } from '@/types/fleet';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const vehicleService = {
  getAllVehicles: async () => {
    try {
      const response = await axios.get(`${API_URL}/vehicles`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw error;
    }
  },

  getVehicleById: async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/vehicles/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      throw error;
    }
  },
}; 