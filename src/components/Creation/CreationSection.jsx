import PropTypes from "prop-types";
import "./Creation.scss";
import SectionHeading from "../SectionHeading/SectionHeading";
import { useState } from "react";
import SingleCreation from "./SingleCreation";
import Modal from "../Modal/Modal";

const CreationSection = ({ data }) => {
  // Modal
  const [modal, setModal] = useState(false);
  const [tempData, setTempData] = useState([]);

  const getData = (imgLink, title, subTitle, link) => {
    let tempData = [imgLink, title, subTitle, link];
    setTempData((item) => [1, ...tempData]);
    setModal(true);
  };

  const modalClose = () => {
    setModal(false);
  };

  // Load Items
  const { creationItems } = data;
  const itemsPerPage = 6;
  const [visibleItems, setVisibleItems] = useState(
    creationItems.slice(0, itemsPerPage)
  );

  const [showLoadMore, setShowLoadMore] = useState(true);

  const loadMoreItems = () => {
    const currentLength = visibleItems.length;
    const nextChunk = creationItems.slice(
      currentLength,
      currentLength + itemsPerPage
    );
    setVisibleItems((prevItems) => [...prevItems, ...nextChunk]);

    if (currentLength + itemsPerPage >= creationItems.length) {
      setShowLoadMore(false);
    }
  };

  return (
    <>
      <section id="creations" className="st-dark-bg">
        <div className="st-height-b100 st-height-lg-b80"></div>
        <SectionHeading title={"Creations"} />
        <div className="container">
          <div className="row">
            {visibleItems.map((element, index) => (
              <SingleCreation data={element} key={index} getData={getData} />
            ))}
            <div className="col-lg-12 text-center">
              <div className="st-portfolio-btn">
                {showLoadMore && (
                  <button
                    className="st-btn st-style1 st-color1"
                    onClick={loadMoreItems}
                  >
                    Load more
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="st-height-b100 st-height-lg-b80"></div>
      </section>
      {modal === true ? (
        <Modal
          img={tempData[1]}
          title={tempData[2]}
          subTitle={tempData[3]}
          link={tempData[4]}
          modalClose={modalClose}
        />
      ) : (
        ""
      )}
    </>
  );
};

CreationSection.propTypes = {
  data: PropTypes.object,
};

export default CreationSection;
