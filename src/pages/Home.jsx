import data from "../Data.json";
import About from "../components/About/About";
import TechnicalSkill from "../components/TechnicalSkill/TechnicalSkill";
// import Skill from "../components/Skill/Skill";
import PortfolioSection from "../components/Portfolio/PortfolioSection";
// import ReviewSection from "../components/Review/ReviewSection";
import Contact from "../components/Contact/Contact";
import CreationSection from "../components/Creation/CreationSection";
import Hero from "../components/Hero/Hero";

const Home = () => {
  const {
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
      <About data={aboutData} data-aos="fade-right" />
      <TechnicalSkill data={serviceData} data-aos="fade-right" />
      <PortfolioSection data={portfolioData} />
      <CreationSection data={creationData} data-aos="fade-right" />
      {/* <Skill data={skillData} data-aos="fade-right" /> */}
      {/* <ReviewSection data={reviewData} data-aos="fade-right" /> */}
      <Contact
        data={contactData}
        socialData={socialData}
        data-aos="fade-right"
      />
    </>
  );
};

export default Home;
