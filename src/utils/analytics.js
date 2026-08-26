import ReactGA from "react-ga4";

let initialized = false;

const getGoogleAnalyticsId = () => import.meta.env.VITE_GA_ID;

export const initializeAnalytics = () => {
  const gaId = getGoogleAnalyticsId();
  if (!gaId || initialized) return;

  ReactGA.initialize(gaId, { gaOptions: { send_page_view: false } });
  initialized = true;
};

export const trackPageView = (
  page = window.location.pathname + window.location.search
) => {
  if (!getGoogleAnalyticsId()) return;

  ReactGA.send({
    hitType: "pageview",
    page,
  });
};

export const trackEvent = (eventName, params = {}) => {
  if (!getGoogleAnalyticsId()) return;

  ReactGA.event(eventName, params);
};
