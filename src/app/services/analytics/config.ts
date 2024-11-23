// // services/analytics/config.ts
// export const ANALYTICS_CONFIG = {
//     rollbar: {
//       accessToken: process.env.NEXT_PUBLIC_ROLLBAR_TOKEN,
//       environment: process.env.NEXT_PUBLIC_ENV || 'development',
//       captureUncaught: true,
//       captureUnhandledRejections: true,
//       payload: {
//         client: {
//           javascript: {
//             source_map_enabled: true,
//             code_version: '1.0.0',
//             guess_uncaught_frames: true
//           }
//         }
//       }
//     },
//     hotjar: {
//       hjid: parseInt(process.env.NEXT_PUBLIC_HOTJAR_ID || '0'),
//       hjsv: parseInt(process.env.NEXT_PUBLIC_HOTJAR_SNIPPET_VERSION || '6')
//     },
//     mixpanel: {
//       token: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
//       config: {
//         debug: process.env.NODE_ENV === 'development',
//         track_pageview: true,
//         persistence: 'localStorage'
//       }
//     }
//   };