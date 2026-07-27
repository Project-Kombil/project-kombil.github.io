import { useState } from "react";
import "./Modal.scss";
import { trackEvent } from "../../utils/analytics";

const Modal = ({ img, title, subTitle, link, technology, modalClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const modalStyle = {
    display: "block",
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      modalClose();
    }, 220);
  };

  const handleProjectClick = () => {
    trackEvent("project_outbound_click", {
      project_title: title,
      project_url: link,
    });
  };

  return (
    <div
      className={`modal show fade bd-example-modal-lg modal st-modal ${
        isClosing ? "st-modal-closing" : "st-modal-open"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="creation-modal-title"
      style={modalStyle}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <p className="modal-eyebrow">{subTitle}</p>
              <h4 className="modal-title" id="creation-modal-title">
                {title}
              </h4>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Close project details"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="modal-media">
              <img
                src={img}
                alt={title}
                width="1200"
                height="900"
                loading="lazy"
                decoding="async"
              />
            </div>
            {technology && technology.length > 0 && (
              <div className="modal-tech-list" aria-label="Technologies used">
                {technology.map((item, index) => (
                  <span key={index}>
                    {item}
                  </span>
                ))}
              </div>
            )}
            {link && link.trim() !== "" && (
              <a
                href={link}
                className="modal-link"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleProjectClick}
              >
                Visit project
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
