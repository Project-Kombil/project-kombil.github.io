import "./Modal.scss";

const Modal = ({ img, title, subTitle, link, modalClose }) => {
	const modalStyle = {
		backgroundColor: "rgba(0,0,0,0.8)",
		display: "block",
	};
	return (
		
		<div className="modal show fade bd-example-modal-lg" style={modalStyle}>
			<div className="modal-dialog modal-lg">
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
							<img src={img} />
						</div>
						<a href={link} className="modal-subtitle"  target="_blank" rel="noopener noreferrer">{subTitle} - Link</a> 
						
					</div>
				</div>
			</div>
		</div>
	);
};

export default Modal;
