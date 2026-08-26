import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const Layout = ({ children }) => {
  return (
    <div className="st-get-sidebar">
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </div>
  );
};
export default Layout;
