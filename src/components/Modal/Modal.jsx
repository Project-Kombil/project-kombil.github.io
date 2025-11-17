import "./Modal.scss";

const Modal = ({ img, title, subTitle, link, technology, modalClose }) => {
  const modalStyle = {
    backgroundColor: "rgba(0,0,0,0.8)",
    display: "block",
  };
  return (
    <div
      className="modal show fade bd-example-modal-lg modal"
      style={modalStyle}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">{title}</h4>
            <button
              type="button"
              className="btn-close"
              onClick={modalClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="st-flex-center">
              <img src={img} alt={title} />
            </div>
            <p className="modal-subtitle">{subTitle}</p>
            <br />
            <p className="modal-subtitle">Technologies Utilized:</p>
            {technology && technology.length > 0 && (
              <ul>
                {technology.map((item, index) => (
                  <li className="modal-subtitle" key={index}>
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {link && link.trim() !== "" && (
              <a
                href={link}
                className="modal-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                LINK to Website
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
