import mixpanel from 'mixpanel-browser';

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

export interface UserProperties {
  userId: string;
  userType: 'rider' | 'driver';
  email: string;
  deviceType: string;
  appVersion: string;
}

export class Analytics {
  private static isInitialized = false;

  static init() {
    if (this.isInitialized) return;
    
    mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || 'af9227f551110121e7d949ac7356d942', {
      debug: process.env.NODE_ENV === 'development',
      persistence: "localStorage"
    });
    
    this.isInitialized = true;
  }

  static trackPageView(page: string, properties?: Record<string, any>) {
    mixpanel.track('Page View', {
      page,
      timestamp: new Date().toISOString(),
      ...properties
    });
  }

  static trackUserBehavior(event: AnalyticsEvent) {
    mixpanel.track(event.name, {
      timestamp: new Date().toISOString(),
      ...event.properties
    });
  }

  static identifyUser(properties: UserProperties) {
    mixpanel.identify(properties.userId);
    mixpanel.people.set({
      $email: properties.email,
      $user_type: properties.userType,
      $device_type: properties.deviceType,
      $app_version: properties.appVersion,
      last_seen: new Date().toISOString()
    });
  }

  static trackRideMetrics(rideId: string, metrics: {
    duration: number;
    distance: number;
    fare: number;
    pickupLocation: string;
    dropoffLocation: string;
    rating?: number;
  }) {
    mixpanel.track('Ride Completed', {
      ride_id: rideId,
      ...metrics,
      timestamp: new Date().toISOString()
    });
  }

  static trackAppPerformance(metrics: {
    loadTime: number;
    errorCount: number;
    screenName: string;
    deviceInfo: string;
  }) {
    mixpanel.track('App Performance', {
      ...metrics,
      timestamp: new Date().toISOString()
    });
  }

  static trackUserFeedback(feedback: {
    type: 'nps' | 'rating' | 'review';
    score: number;
    comment?: string;
    category?: string;
  }) {
    mixpanel.track('User Feedback', {
      ...feedback,
      timestamp: new Date().toISOString()
    });
  }
}