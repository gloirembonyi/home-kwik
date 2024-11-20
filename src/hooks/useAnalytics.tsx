// src/hooks/useAnalytics.tsx
"use client";

import { useEffect } from 'react';
import mixpanel from 'mixpanel-browser';

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
}

export const useAnalytics = () => {
  useEffect(() => {
    mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || '');

    // Initialize Hotjar
    const hotjarScript = document.createElement('script');
    hotjarScript.innerHTML = `
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:process.env.NEXT_PUBLIC_HOTJAR_ID,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    `;
    document.head.appendChild(hotjarScript);
  }, []);

  const trackEvent = ({ action, category, label, value, properties }: AnalyticsEvent) => {
    mixpanel.track(action, {
      category,
      label,
      value,
      ...properties,
    });
  };

  const trackNPS = (score: number, feedback?: string) => {
    trackEvent({
      action: 'NPS_Survey_Submitted',
      category: 'Feedback',
      value: score,
      properties: {
        feedback,
        timestamp: new Date().toISOString(),
      },
    });
  };

  return { trackEvent, trackNPS };
};