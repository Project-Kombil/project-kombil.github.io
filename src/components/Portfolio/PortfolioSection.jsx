import PropTypes from "prop-types";
import SectionHeading from "../SectionHeading/SectionHeading";
import "./Portfolio.scss";
import SinglePortfolio from "./SinglePortfolio";

const PortfolioSection = ({ data }) => {
  const { experience } = data;
  return (
    <section id="portfolio">
      <div className="st-height-b100 st-height-lg-b80"></div>
      <SectionHeading title={"Portfolio"} />
      <div
        className="container"
        data-aos="fade-up"
        data-aos-duration="800"
        data-aos-delay="200"
      >
        <div className="row">
          <div className="col-lg-12">
            <div className="st-height-b0 st-height-lg-b50"></div>
            <div className="st-resume-wrap">
              <div className="st-resume-heading">
                {/* <img src="./images/icon/resume-icon2.png" alt="resume-icon" /> */}
                {/* <h2 className="st-resume-heading-title">{experienceTitle}</h2> */}
              </div>
              <div className="st-height-b50 st-height-lg-b30"></div>

              <div className="st-resume-timeline-wrap">
                {experience.map((experience, index) => (
                  <SinglePortfolio element={experience} key={index} />
                ))}
              </div>
            </div>
            <div className="st-height-b100 st-height-lg-b80"></div>
          </div>
          <div className="col-lg-6">
            <div className="st-height-b0 st-height-lg-b50"></div>
            {/* <div className="st-resume-wrap">
							<div className="st-resume-heading">
								<img src="./images/icon/resume-icon1.png" alt="resume-icon" />
								<h2 className="st-resume-heading-title">{educationTitle}</h2>
							</div>
							<div className="st-height-b50 st-height-lg-b30"></div>

							<div className="st-resume-timeline-wrap">
								{education.map((education, index) => (
									<SingleResume element={education} key={index} />
								))}
							</div>
						</div> */}
            <div className="st-height-b100 st-height-lg-b80"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

PortfolioSection.propTypes = {
  data: PropTypes.object,
};

export default PortfolioSection;
