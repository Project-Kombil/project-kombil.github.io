import Header from "../Header/Header";
import { useEffect, useState } from "react";
import Footer from "../Footer/Footer";
import Preloader from "../Preloader/Preloader";

const Layout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(loadingTimer);
  }, []);

  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <div className="st-get-sidebar">
          <Header />
          <main id="main-content">
            {children}
          </main>
          <Footer />
        </div>
      )}
    </>
  );
};
export default Layout;
