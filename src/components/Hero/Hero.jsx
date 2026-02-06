import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import "./Hero.scss";
import perser from "html-react-parser";
import SocialLinks2 from "../SocialLinks/SocialLinks2";
import * as THREE from "three";

const Hero = ({ data, socialData }) => {
  const { title, text, imgAuthor, bgImgLink } = data;
  const vantaRef = useRef(null);
  const vantaEffectRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const initVanta = async () => {
      if (import.meta.env.MODE === "test" || import.meta.env.VITEST) return;
      if (!vantaRef.current || vantaEffectRef.current) return;
      window.THREE = THREE;
      const { default: DOTS } = await import("vanta/dist/vanta.dots.min");
      if (!isMounted || !vantaRef.current) return;
      vantaEffectRef.current = DOTS({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0x44f8fe,
        color2: 0x0a101e,
        backgroundColor: 0x070d1b,
        size: 3.0,
        spacing: 34.0,
        showLines: false,
      });
    };

    initVanta();

    return () => {
      isMounted = false;
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, []);

  return (
    <section
      id="home"
      ref={vantaRef}
      className="st-hero st-style2 st-bg st-dynamic-bg st-ripple-version"
      style={{
        backgroundImage: `url(${bgImgLink})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container">
        <div className="st-hero-text">
          <div
            className="st-author"
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay="200"
          >
            <img src={imgAuthor} alt="Author Image" />
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
