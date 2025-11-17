import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Aos from "aos";
import "aos/dist/aos.css";
import Layout from "./components/Layout/Layout";
import ReactGA from "react-ga";

// Tracks page views on route change
function GAListener({ children }) {
  const location = useLocation();

  useEffect(() => {
    ReactGA.initialize("G-VX8LXY705E");
  }, []);

  useEffect(() => {
    ReactGA.pageview(location.pathname + location.search);
  }, [location]);

  return children;
}

function App() {
  useEffect(() => {
    Aos.init({ once: true });

    const handleScroll = () => {
      ReactGA.event({
        category: "Scroll",
        action: "User Scrolled",
      });
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
