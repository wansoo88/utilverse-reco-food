declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? '';

export const isAnalyticsEnabled = () => Boolean(GA_ID);

export const pageview = (url: string) => {
  if (!isAnalyticsEnabled() || typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', GA_ID, {
    page_path: url,
  });
};

export const trackEvent = (
  action: string,
  params: Record<string, string | number | boolean | null | undefined> = {},
) => {
  if (!isAnalyticsEnabled() || typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', action, params);
};
