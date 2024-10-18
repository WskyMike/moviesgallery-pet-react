/* eslint-disable react/prop-types */
import * as Icon from "react-bootstrap-icons";
import './customArrows.css'

const CustomLeftArrow = ({ onClick }) => {
  return (
    <button onClick={onClick} className="custom-arrow custom-arrow--left">
      <Icon.ChevronLeft />
    </button>
  );
};

const CustomRightArrow = ({ onClick }) => {
  return (
    <button onClick={onClick} className="custom-arrow custom-arrow--right">
      <Icon.ChevronRight />
    </button>
  );
};

export { CustomLeftArrow, CustomRightArrow };
