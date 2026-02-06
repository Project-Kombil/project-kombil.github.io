import { Suspense, lazy } from "react";
import data from "../Data.json";
import Hero from "../components/Hero/Hero";

const About = lazy(() => import("../components/About/About"));
const TechnicalSkill = lazy(
  () => import("../components/TechnicalSkill/TechnicalSkill")
);
const PortfolioSection = lazy(
  () => import("../components/Portfolio/PortfolioSection")
);
const Contact = lazy(() => import("../components/Contact/Contact"));
const CreationSection = lazy(
  () => import("../components/Creation/CreationSection")
);

const Home = () => {
  const {
    // skillData,
    heroData,
    aboutData,
    serviceData,
    creationData,
    portfolioData,
    contactData,
    socialData,
    socialData2,
  } = data;
  return (
    <>
      <Hero data={heroData.data} socialData={socialData2} />
      <Suspense fallback={null}>
        <About data={aboutData} data-aos="fade-right" />
      </Suspense>
      <Suspense fallback={null}>
        <TechnicalSkill data={serviceData} data-aos="fade-right" />
      </Suspense>
      <Suspense fallback={null}>
        <PortfolioSection data={portfolioData} />
      </Suspense>
      <Suspense fallback={null}>
        <CreationSection data={creationData} data-aos="fade-right" />
      </Suspense>
      {/* <Skill data={skillData} data-aos="fade-right" /> */}
      {/* <ReviewSection data={reviewData} data-aos="fade-right" /> */}
      <Suspense fallback={null}>
        <Contact
          data={contactData}
          socialData={socialData}
          data-aos="fade-right"
        />
      </Suspense>
    </>
  );
};

export default Home;
