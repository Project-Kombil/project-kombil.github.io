import { useEffect, useRef, useState } from "react";
import "./Modal.scss";
import { trackEvent } from "../../utils/analytics";

const Modal = ({ img, title, subtitle, link, technology, modalClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const isClosingRef = useRef(false);
  const closeButtonRef = useRef(null);
  const closeTimerRef = useRef(null);
  const modalStyle = {
    display: "block",
  };

  const handleClose = () => {
    if (isClosingRef.current) return;

    isClosingRef.current = true;
    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      modalClose();
    }, 220);
  };

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") handleClose();
    };

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(closeTimerRef.current);
      previouslyFocused?.focus?.();
    };
  }, []);

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
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <p className="modal-eyebrow">{subtitle}</p>
              <h4 className="modal-title" id="creation-modal-title">
                {title}
              </h4>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Close project details"
              onClick={handleClose}
              ref={closeButtonRef}
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
