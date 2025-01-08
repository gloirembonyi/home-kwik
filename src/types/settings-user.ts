// types/user.ts
export interface UserData {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    country: string;
    state: string;
    address1: string;
    address2?: string;
    profileImage?: string;
    roleSwitching: boolean;
    twoFactorAuth: boolean;
    privacyLevel: 'low' | 'medium' | 'high';
    accountCreated: Date;
    lastLogin: Date;
    passwordLastChanged?: Date;
    failedLoginAttempts?: number;
    securityQuestions?: SecurityQuestion[];
    loginHistory?: LoginHistoryEntry[];
    deviceHistory?: DeviceHistoryEntry[];
    notifications: NotificationSettings;
    driverLicense?: {
      number: string;
      expiry: Date;
      state: string;
      verified: boolean;
    };
    vehiclePreferences?: {
      preferredTypes: string[];
      seatingCapacity: number[];
      transmission: 'automatic' | 'manual' | 'both';
    };
    paymentInfo?: {
      defaultMethod: string;
      methods: PaymentMethod[];
    };
    ridePreferences?: {
      maxDistance: number;
      preferredPickupLocations: string[];
      availabilitySchedule: AvailabilitySchedule[];
    };
    communications?: {
      preferredLanguage: string;
      translator: boolean;
      emergencyContact: EmergencyContact;
    };
  }

  export interface PaymentMethod {
    id: string;
    type: 'credit' | 'debit' | 'paypal' | 'other';
    last4: string;
    expiryMonth?: number;
    expiryYear?: number;
    isDefault: boolean;
  }
  
  export interface AvailabilitySchedule {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }
  
  export interface EmergencyContact {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  }

  export interface NotificationSettings {
    email: {
      security: boolean;
      updates: boolean;
      marketing: boolean;
      newsletter: boolean;
    };
    push: {
      security: boolean;
      updates: boolean;
      reminders: boolean;
      messages: boolean;
    };
    frequency: 'immediate' | 'daily' | 'weekly';
    quiet_hours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  }
  
  export interface SecurityQuestion {
    id: string;
    question: string;
    answer: string; // Should be stored hashed
  }
  
  export interface LoginHistoryEntry {
    timestamp: Date;
    ipAddress: string;
    deviceInfo: string;
    location?: string;
    status: 'success' | 'failed';
  }
  
  export interface DeviceHistoryEntry {
    id: string;
    deviceName: string;
    browser: string;
    os: string;
    lastActive: Date;
    isCurrent: boolean;
  }

  export interface SystemResource {
    name: string;
    usage: number;
    limit: number;
    status: 'good' | 'warning' | 'critical';
  }
  
  export interface Device {
    id: number;
    name: string;
    type: 'computer' | 'mobile' | 'tablet';
    lastActive: string;
    isCurrentDevice?: boolean;
  }
  
  // New interfaces
  export interface SystemResource {
      name: string;
      usage: number;
      limit: number;
      status: 'good' | 'warning' | 'critical';
      trend: 'up' | 'down' | 'stable';
      history: number[];
    }
    
  export interface AuditLog {
      id: number;
      action: string;
      user: string;
      timestamp: string;
      details: string;
      severity: 'low' | 'medium' | 'high';
    }

