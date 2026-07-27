import PropTypes from "prop-types";
import "./Hero.scss";
import perser from "html-react-parser";
import SocialLinks2 from "../SocialLinks/SocialLinks2";

const Hero = ({ data, socialData }) => {
  const { title, text, imgAuthor, bgImgLink } = data;

  return (
    <section
      id="home"
      className="st-hero st-style2 st-bg st-dynamic-bg st-ripple-version"
      style={{
        backgroundImage: `url(${bgImgLink})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="st-hero-dot-field" aria-hidden="true"></div>
      <div className="container">
        <div className="st-hero-text">
          <div
            className="st-author"
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay="200"
          >
            <img
              src={imgAuthor}
              alt="Author Image"
              width="800"
              height="800"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </div>
          <h1 data-aos="fade-up" data-aos-duration="800" data-aos-delay="300">
            {perser(title)}
          </h1>
          <p data-aos="fade-up" data-aos-duration="800" data-aos-delay="400">
            {perser(text)}
          </p>
          <SocialLinks2 data={socialData} />
        </div>
      </div>
    </section>
  );
};

Hero.propTypes = {
  data: PropTypes.object,
  socialData: PropTypes.array,
};

export default Hero;
