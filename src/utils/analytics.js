import ReactGA from "react-ga4";

let initialized = false;

const getGoogleAnalyticsId = () => import.meta.env.VITE_GA_ID;

export const initializeAnalytics = () => {
  const gaId = getGoogleAnalyticsId();
  if (!gaId || initialized) return;

  if (!window.gtag) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", gaId, { send_page_view: false });
  }

  ReactGA.initialize(gaId);
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
