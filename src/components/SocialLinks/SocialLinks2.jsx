import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
const SocialLinks2 = ({ data }) => {
  return (
    <div
      className="st-hero-social-links"
      data-aos="fade-up"
      data-aos-duration="800"
      data-aos-delay="500"
    >
      {data.map((item, index) => (
        <a
          href={item.link}
          className="st-social-btn"
          aria-label={item.title || item.icon}
          title={item.title || item.icon}
          target="_blank"
          rel="noopener noreferrer"
          key={index}
        >
          <span className="st-social-icon">
            <Icon icon={`fa6-brands:${item.icon}`} />
          </span>
        </a>
      ))}
    </div>
  );
};

SocialLinks2.propTypes = {
  data: PropTypes.array,
};

export default SocialLinks2;
