import { useEffect, useRef } from "react";
import Home from "./pages/Home";
import Aos from "aos";
import "aos/dist/aos.css";
import Layout from "./components/Layout/Layout";
import {
  initializeAnalytics,
  trackEvent,
  trackPageView,
} from "./utils/analytics";

function GAListener({ children }) {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      initializeAnalytics();
      initializedRef.current = true;
    }
  }, []);

  useEffect(() => {
    trackPageView();
  }, []);

  return children;
}

function App() {
  useEffect(() => {
    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    Aos.init({ once: true, disable: prefersReducedMotion });

    let sentFirstScroll = false;
    const handleScroll = () => {
      if (sentFirstScroll) return;
      sentFirstScroll = true;
      trackEvent("first_scroll", {
        event_category: "engagement",
      });
      window.removeEventListener("scroll", handleScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <GAListener>
      <Layout>
        <Home />
      </Layout>
    </GAListener>
  );
}

export default App;
