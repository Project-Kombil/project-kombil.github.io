import PropTypes from "prop-types";
// import { Icon } from "@iconify/react";

const SingleCreation = ({ data, getData }) => {
  const {
    imgLink,
    imgLinkLg,
    title,
    subTitle,
    link,
    technology,
    effect,
    duration,
    delay,
  } = data;

  return (
    <div
      className="col-lg-4 col-md-6"
      data-aos={effect}
      data-aos-duration={duration}
      data-aos-delay={delay}
    >
      <div
        className="st-portfolio-single st-style1"
        onClick={() => getData(imgLinkLg, title, subTitle, link, technology)}
      >
        <div className="st-portfolio-item">
          <div className="st-portfolio st-zoom">
            <div className="st-portfolio-img st-zoom-in">
              <img src={imgLink} alt="portfolio" />
            </div>
            <div className="st-portfolio-item-hover">
              {/* <Icon icon="mdi:eye" /> */}
              <h5>{title}</h5>
              {/* <p>{subTitle}</p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

SingleCreation.propTypes = {
  data: PropTypes.object,
};

export default SingleCreation;
