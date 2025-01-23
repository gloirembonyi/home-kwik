import { io, Socket } from 'socket.io-client';
import { Vehicle } from '@/types/fleet';

export class FleetSocket {
  private socket: Socket | null = null;
  private static instance: FleetSocket;

  private constructor() {}

  static getInstance(): FleetSocket {
    if (!FleetSocket.instance) {
      FleetSocket.instance = new FleetSocket();
    }
    return FleetSocket.instance;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || '', {
        auth: {
          token: localStorage.getItem('token'),
        },
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  subscribeToVehicleUpdates(callback: (vehicle: Vehicle) => void) {
    if (!this.socket) return;
    this.socket.on('vehicle_update', callback);
  }

  subscribeToNewVehicles(callback: (vehicle: Vehicle) => void) {
    if (!this.socket) return;
    this.socket.on('new_vehicle', callback);
  }
} 