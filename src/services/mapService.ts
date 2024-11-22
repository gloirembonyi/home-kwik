// services/mapService.ts
import { Driver, MapStats, DriverStatus, VehicleType } from '@/types/map';

interface WebSocketMessage {
  type: 'driver_update' | 'error' | 'connection_status';
  data: any;
}

class MapService {
  private static instance: MapService;
  private ws: WebSocket | null = null;
  private subscribers: ((drivers: Driver[]) => void)[] = [];
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private drivers: Driver[] = [];
  private isSimulating: boolean = false;

  private constructor() {
    if (process.env.NODE_ENV === 'production') {
      this.connectWebSocket();
    }
  }

  static getInstance(): MapService {
    if (!MapService.instance) {
      MapService.instance = new MapService();
    }
    return MapService.instance;
  }

  private connectWebSocket() {
    try {
      const wsUrl = process.env.NEXT_PUBLIC_WS_ENDPOINT || '';
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          switch (message.type) {
            case 'driver_update':
              this.handleDriverUpdate(message.data);
              break;
            case 'error':
              console.error('WebSocket error:', message.data);
              break;
            case 'connection_status':
              console.log('Connection status:', message.data);
              break;
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.handleReconnection();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      this.handleReconnection();
    }
  }

  private handleReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
      setTimeout(() => this.connectWebSocket(), delay);
    } else {
      console.error('Max reconnection attempts reached');
      // Fall back to simulation mode if available
      if (process.env.NODE_ENV === 'development') {
        this.startSimulation();
      }
    }
  }

  private handleDriverUpdate(updatedDrivers: Driver[]) {
    this.drivers = updatedDrivers;
    this.notifySubscribers(updatedDrivers);
  }

  private notifySubscribers(drivers: Driver[]) {
    this.subscribers.forEach(callback => {
      try {
        callback(drivers);
      } catch (error) {
        console.error('Error in subscriber callback:', error);
      }
    });
  }

  subscribeToDriverUpdates(callback: (drivers: Driver[]) => void) {
    this.subscribers.push(callback);
    
    // Immediately send current drivers to new subscriber
    if (this.drivers.length > 0) {
      callback(this.drivers);
    }

    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  startSimulation() {
    if (this.isSimulating) return;
    
    this.isSimulating = true;
    console.log('Starting simulation mode');
    
    const baseDrivers: Driver[] = this.generateInitialDrivers();
    this.drivers = baseDrivers;
    
    const simulationInterval = setInterval(() => {
      if (!this.isSimulating) {
        clearInterval(simulationInterval);
        return;
      }

      const updatedDrivers = this.updateSimulatedDrivers(this.drivers);
      this.handleDriverUpdate(updatedDrivers);
    }, 3000);

    return () => {
      this.isSimulating = false;
      clearInterval(simulationInterval);
    };
  }

  private generateInitialDrivers(): Driver[] {
    // Kigali coordinates as center point
    const centerLat = -1.9441;
    const centerLng = 30.0619;
    const driverCount = 20;

    return Array.from({ length: driverCount }, (_, i) => ({
      id: (i + 1).toString(),
      name: this.getRandomDriverName(),
      status: this.getRandomStatus(),
      location: {
        lat: centerLat + (Math.random() - 0.5) * 0.1,
        lng: centerLng + (Math.random() - 0.5) * 0.1
      },
      rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
      totalRides: Math.floor(100 + Math.random() * 2000),
      vehicle: {
        model: this.getRandomVehicleModel(),
        plateNumber: this.generatePlateNumber(),
        type: Math.random() > 0.7 ? 'premium' : 'standard' as VehicleType
      }
    }));
  }

  private updateSimulatedDrivers(currentDrivers: Driver[]): Driver[] {
    return currentDrivers.map(driver => ({
      ...driver,
      location: {
        lat: driver.location.lat + (Math.random() - 0.5) * 0.002,
        lng: driver.location.lng + (Math.random() - 0.5) * 0.002
      },
      status: this.shouldUpdateStatus(driver.status) ? 
        this.getRandomStatus() : 
        driver.status
    }));
  }

  private shouldUpdateStatus(currentStatus: DriverStatus): boolean {
    // 10% chance to change status on each update
    return Math.random() < 0.1;
  }

  private getRandomStatus(): DriverStatus {
    const statuses: DriverStatus[] = ['available', 'busy', 'offline'];
    const weights = [0.6, 0.3, 0.1]; // 60% available, 30% busy, 10% offline
    
    const random = Math.random();
    let sum = 0;
    
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (random < sum) return statuses[i];
    }
    
    return 'available';
  }

  private getRandomDriverName(): string {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'James', 'Emily'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller'];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
      lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  }

  private getRandomVehicleModel(): string {
    const models = [
      'Toyota Corolla',
      'Honda Civic',
      'Toyota RAV4',
      'Hyundai Elantra',
      'Toyota Camry',
      'Honda CR-V',
      'Nissan Sentra'
    ];
    return models[Math.floor(Math.random() * models.length)];
  }

  private generatePlateNumber(): string {
    const letters = 'RAC';
    const numbers = Math.floor(100 + Math.random() * 900);
    const lastLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    return `${letters} ${numbers}${lastLetter}`;
  }

  calculateStats(drivers: Driver[]): MapStats {
    if (!drivers.length) {
      return {
        totalDrivers: 0,
        activeDrivers: 0,
        busyDrivers: 0,
        availableDrivers: 0,
        averageRating: 0
      };
    }

    const activeDrivers = drivers.filter(d => d.status !== 'offline');
    
    return {
      totalDrivers: drivers.length,
      activeDrivers: activeDrivers.length,
      busyDrivers: drivers.filter(d => d.status === 'busy').length,
      availableDrivers: drivers.filter(d => d.status === 'available').length,
      averageRating: Number((
        drivers.reduce((acc, d) => acc + d.rating, 0) / drivers.length
      ).toFixed(1))
    };
  }
}

export default MapService;