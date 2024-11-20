// import Rollbar from 'rollbar';
// import mixpanel from 'mixpanel-browser';
// import { hotjar } from 'react-hotjar';

// export interface ErrorDetails {
//   message: string;
//   stack?: string;
//   metadata?: Record<string, any>;
//   severity?: 'critical' | 'error' | 'warning' | 'info';
// }

// export interface UserAction {
//   action: string;
//   metadata?: Record<string, any>;
//   timestamp?: string;
// }

// class MonitoringService {
//   private static instance: MonitoringService;
//   private rollbar: Rollbar;
//   private isInitialized = false;

//   private constructor() {
//     // Initialize Rollbar
//     this.rollbar = new Rollbar({
//       accessToken: process.env.NEXT_PUBLIC_ROLLBAR_TOKEN,
//       environment: process.env.NODE_ENV,
//       captureUncaught: true,
//       captureUnhandledRejections: true,
//       payload: {
//         client: {
//           javascript: {
//             code_version: process.env.NEXT_PUBLIC_APP_VERSION,
//             source_map_enabled: true,
//           }
//         }
//       }
//     });

//     // Initialize Mixpanel
//     mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || 'af9227f551110121e7d949ac7356d942', {
//       debug: process.env.NODE_ENV === 'development',
//       persistence: "localStorage"
//     });

//     // Initialize Hotjar
//     const HOTJAR_CONFIG = {
//       hjid: Number(process.env.NEXT_PUBLIC_HOTJAR_ID),
//       hjsv: 6
//     };

//     if (typeof window !== 'undefined') {
//       hotjar.initialize(HOTJAR_CONFIG.hjid, HOTJAR_CONFIG.hjsv);
//     }

//     this.isInitialized = true;
//   }

//   static getInstance(): MonitoringService {
//     if (!MonitoringService.instance) {
//       MonitoringService.instance = new MonitoringService();
//     }
//     return MonitoringService.instance;
//   }

//   // ** Error Tracking **
//   trackError(error: ErrorDetails): void {
//     if (!this.isInitialized) return;

//     // Rollbar error tracking
//     this.rollbar.error(error.message, {
//       ...error.metadata,
//       severity: error.severity,
//       stack: error.stack,
//     });

//     // Mixpanel error tracking for user context
//     mixpanel.track('Error Occurred', {
//       error_message: error.message,
//       severity: error.severity,
//       timestamp: new Date().toISOString(),
//       ...error.metadata
//     });
//   }

//   // ** User Feedback Tracking (NPS) **
//   trackNPSScore(score: number, feedback?: string): void {
//     if (!this.isInitialized) return;

//     // Track in Mixpanel
//     mixpanel.track('NPS Feedback', {
//       score,
//       feedback,
//       timestamp: new Date().toISOString(),
//     });

//     // Log in Rollbar for correlation
//     this.rollbar.info('NPS Feedback Received', { score, feedback });
//   }

//   // ** User Session Tracking **
//   trackUserSession(userId: string, metadata: Record<string, any>): void {
//     if (!this.isInitialized) return;

//     // Mixpanel user identification and property setting
//     mixpanel.identify(userId);
//     mixpanel.people.set({
//       ...metadata,
//       last_seen: new Date().toISOString(),
//     });

//     // Set Rollbar person context
//     this.rollbar.configure({
//       payload: {
//         person: {
//           id: userId,
//           ...metadata
//         }
//       }
//     });
//   }

//   // ** Performance Monitoring **
//   trackPerformance(metrics: {
//     name: string;
//     duration: number;
//     metadata?: Record<string, any>;
//   }): void {
//     if (!this.isInitialized) return;

//     // Track in Mixpanel
//     mixpanel.track('Performance Metric', {
//       ...metrics,
//       timestamp: new Date().toISOString()
//     });

//     // Log performance metrics in Rollbar
//     this.rollbar.log('Performance Metric', {
//       ...metrics
//     });
//   }

//   // ** Feature Usage Tracking **
//   trackFeatureUsage(feature: string, metadata?: Record<string, any>): void {
//     if (!this.isInitialized) return;

//     // Track in Mixpanel
//     mixpanel.track('Feature Usage', {
//       feature,
//       ...metadata,
//       timestamp: new Date().toISOString()
//     });
//   }

//   // ** Error Boundary Handler **
//   errorBoundaryHandler(error: Error, componentStack: string): void {
//     this.trackError({
//       message: error.message,
//       stack: error.stack,
//       metadata: {
//         componentStack,
//         type: 'React Error Boundary'
//       },
//       severity: 'error'
//     });
//   }
// }

// export const monitoring = MonitoringService.getInstance();
