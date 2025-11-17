import SectionHeading from "../SectionHeading/SectionHeading";
import SocialLinks from "../SocialLinks/SocialLinks";
import ContactForm from "./ContactForm";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import "./Contact.scss";


const Contact = ({ data, socialData }) => {
  const { title, text, subTitle } = data;

  return (
    <section id="contact">
      <div className="st-height-b100 st-height-lg-b80"></div>
      <SectionHeading title="Contact" />
      <div
        className="container"
        data-aos="fade-up"
        data-aos-duration="800"
        data-aos-delay="500"
      >
        <div className="row d-flex">
          <div className="col-lg-6">
            <h3 className="st-contact-title">Get in Touch</h3>
            <div id="st-alert"></div>
            <ContactForm />
            <div className="st-height-b0 st-height-lg-b30"></div>
          </div>
          <div className="col-lg-6">
            <div className="st-height-b0 st-height-lg-b40"></div>
            <h3 className="st-contact-title">{title}</h3>
            <div className="st-contact-text">{text}</div>
            <div className="st-contact-info-wrap">
              <div className="st-single-contact-info">
                <div className="st-icon-wrap">
                  <Icon icon="fa-regular:envelope" />
                </div>
                <div className="st-single-info-details">
                  <h4>Email</h4>
                  <a href="mailto:alefay.bunes@gmail.com">
                    alefay.bunes@gmail.com
                  </a>
                </div>
              </div>
              {/* <div className="st-single-contact-info">
								<div className="st-icon-wrap">
									<Icon icon="fa-solid:phone-alt" />
								</div>
								<div className="st-single-info-details">
									<h4>Phone</h4>
									<span>+675 7123-2456</span>
								</div>
							</div> */}
              <div className="st-single-contact-info">
                <div className="st-icon-wrap">
                  <Icon icon="mdi:location" />
                </div>
                <div className="st-single-info-details">
                  <h4>Address</h4>
                  <span>National Capital District, Papua New Guinea</span>
                </div>
              </div>
              <div className="st-social-info">
                <div className="st-social-text">{subTitle}</div>
                <SocialLinks data={socialData} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="st-height-b100 st-height-lg-b80"></div>
    </section>
  );
};

Contact.propTypes = {
  data: PropTypes.object,
  socialData: PropTypes.array,
};

export default Contact;
