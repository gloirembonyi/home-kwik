// // src/utils/analytics.ts
// import Rollbar from 'rollbar';
// import { hotjar } from 'react-hotjar';
// import mixpanel from 'mixpanel-browser';

// export class AnalyticsService {
//   private static instance: AnalyticsService;
//   private isInitialized = false;
//   private rollbar: Rollbar = new Rollbar();

//   private constructor() {
//     this.initializeServices();
//   }

//   static getInstance() {
//     if (!AnalyticsService.instance) {
//       AnalyticsService.instance = new AnalyticsService();
//     }
//     return AnalyticsService.instance;
//   }

//   private initializeServices() {
//     if (this.isInitialized) return;

//     try {
//       if (process.env.NEXT_PUBLIC_ENV === "production") {
//         if (process.env.NEXT_PUBLIC_ROLLBAR_TOKEN) {
//           this.rollbar = new Rollbar({
//             accessToken: process.env.NEXT_PUBLIC_ROLLBAR_TOKEN,
//             environment: process.env.NEXT_PUBLIC_ENV,
//             captureUncaught: true,
//             captureUnhandledRejections: true,
//           });
//         }

//         if (process.env.NEXT_PUBLIC_HOTJAR_ID) {
//           const hotjarId = parseInt(process.env.NEXT_PUBLIC_HOTJAR_ID || "0");
//           const hjsv = parseInt(process.env.NEXT_PUBLIC_HOTJAR_SNIPPET_VERSION || "6");
//           hotjar.initialize({ id: hotjarId, sv: hjsv });
//         }

//         if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
//           mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN);
//         }
//       }

//       this.isInitialized = true;
//     } catch (error) {
//       console.error("Failed to initialize analytics services:", error);
//     }
//   }

//   trackEvent(eventName: string, properties?: Record<string, any>) {
//     try {
//       mixpanel.track(eventName, properties);
//       hotjar.event(eventName);
//     } catch (error) {
//       console.error("Failed to track event:", error);
//     }
//   }

//   trackError(error: Error, context?: Record<string, any>) {
//     try {
//       this.rollbar.error(error, context);
//     } catch (rollbarError) {
//       console.error("Failed to track error:", rollbarError);
//     }
//   }
// }