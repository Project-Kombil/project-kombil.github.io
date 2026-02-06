import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import Home from "./pages/Home";
import Aos from "aos";
import "aos/dist/aos.css";
import Layout from "./components/Layout/Layout";
import ReactGA from "react-ga4";

// Tracks page views on route change
function GAListener({ children }) {
  const location = useLocation();
  const initializedRef = useRef(false);
  const gaId = import.meta.env.VITE_GA_ID;

  useEffect(() => {
    if (!gaId) return;
    if (!initializedRef.current) {
      ReactGA.initialize(gaId);
      initializedRef.current = true;
    }
  }, [gaId]);

  useEffect(() => {
    if (!gaId) return;
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
    });
  }, [location, gaId]);

  return children;
}

function App() {
  useEffect(() => {
    Aos.init({ once: true });

    let sentFirstScroll = false;
    const handleScroll = () => {
      if (!import.meta.env.VITE_GA_ID) return;
      if (sentFirstScroll) return;
      sentFirstScroll = true;
      ReactGA.event({
        category: "Engagement",
        action: "First Scroll",
      });
      window.removeEventListener("scroll", handleScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <HashRouter>
      <GAListener>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            {/* optional catch-all route if you ever add more pages */}
            {/* <Route path="*" element={<Home />} /> */}
          </Route>
        </Routes>
      </GAListener>
    </HashRouter>
  );
}

export default App;
