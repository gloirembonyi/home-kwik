// services/analytics/AnalyticsService.ts
import * as Rollbar from 'rollbar';
import { hotjar } from 'react-hotjar';
import mixpanel from 'mixpanel-browser';
import { ANALYTICS_CONFIG } from './config';

export class AnalyticsService {
  private static isInitialized = false;

  static init() {
    if (this.isInitialized) return;

    // Initialize Rollbar
    Rollbar.init(ANALYTICS_CONFIG.rollbar);

    // Initialize Hotjar
    hotjar.initialize(
      ANALYTICS_CONFIG.hotjar.hjid,
      ANALYTICS_CONFIG.hotjar.hjsv
    );

    // Initialize Mixpanel
    if (ANALYTICS_CONFIG.mixpanel.token) {
      mixpanel.init(
        ANALYTICS_CONFIG.mixpanel.token,
        ANALYTICS_CONFIG.mixpanel.config
      );
    }

    this.isInitialized = true;
  }

  // Track general events
  static trackEvent(eventName: string, properties?: Record<string, any>) {
    mixpanel.track(eventName, properties);
    hotjar.event(eventName);
  }

  // Track errors
  static trackError(error: Error, context?: Record<string, any>) {
    Rollbar.error(error, context);
  }

  // Track NPS score
  static trackNPS(score: number, feedback?: string) {
    this.trackEvent('nps_score_submitted', {
      score,
      feedback,
      timestamp: new Date().toISOString()
    });
  }

  // Track user session
  static trackSession(userId: string, userType: string) {
    mixpanel.identify(userId);
    mixpanel.people.set({
      'User Type': userType,
      'Last Login': new Date().toISOString()
    });
  }
}