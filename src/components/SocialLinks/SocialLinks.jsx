import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import { useState } from "react";
const SocialLinks = ({ data }) => {
  const [activeLink, setActiveLink] = useState(0);
  const handleIconHover = (index) => {
    setActiveLink(index);
  };

  return (
    <div className="st-social-link">
      {data.map((item, index) => (
        <a
          href={item.link}
          className={
            index === activeLink ? "st-social-btn active" : "st-social-btn"
          }
          onMouseEnter={() => handleIconHover(index)}
          aria-label={item.title || item.icon}
          title={item.title || item.icon}
          target="_blank"
          rel="noopener noreferrer"
          key={index}
        >
          <span className="st-social-icon">
            <Icon icon={`fa6-brands:${item.icon}`} />
          </span>
          <span className="st-icon-name">{item.title}</span>
        </a>
      ))}
    </div>
  );
};

SocialLinks.propTypes = {
  data: PropTypes.array,
};

export default SocialLinks;
