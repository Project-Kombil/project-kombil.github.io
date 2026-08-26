import PropTypes from "prop-types";
import SectionHeading from "../SectionHeading/SectionHeading";
import "./TechnicalSkill.scss";

const TechnicalSkill = ({ data }) => {
  const { services } = data;
  return (
    <section className="st-dark-bg">
      <div className="st-height-b100 st-height-lg-b80"></div>
      <SectionHeading title={"Technical Skills"} />
      <div className="container">
        <div className="row">
          {services.map((element, index) => (
            <div
              className="col-lg-4 col-md-6"
              key={index}
              data-aos="zoom-out-up"
              data-aos-duration="500"
              data-aos-delay={element.delay ? element.delay : "200"}
            >
              <div className={`st-iconbox st-style1`}>
                <div className="st-iconbox-icon">
                  <img
                    src={element.imgLink}
                    alt="Icon"
                    width="52"
                    height="52"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <h2 className="st-iconbox-title">{element.title}</h2>
                <div className="st-iconbox-text">{element.text}</div>
              </div>
              <div className="st-height-b30 st-height-lg-b30"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="st-height-b70 st-height-lg-b50"></div>
    </section>
  );
};

TechnicalSkill.propTypes = {
  data: PropTypes.object,
};

export default TechnicalSkill;
