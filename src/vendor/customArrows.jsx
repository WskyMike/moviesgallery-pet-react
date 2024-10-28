/* eslint-disable react/prop-types */
import * as Icon from "react-bootstrap-icons";
import './customArrows.css'

const CustomLeftArrow = ({ onClick }) => {
  return (
    <button onClick={onClick} className="custom-arrow custom-arrow--left d-none d-md-block">
      <Icon.ChevronLeft />
    </button>
  );
};

const CustomRightArrow = ({ onClick }) => {
  return (
    <button onClick={onClick} className="custom-arrow custom-arrow--right d-none d-md-block">
      <Icon.ChevronRight />
    </button>
  );
};

const CustomLeftArrowThin = ({ onClick }) => {
  return (
    <button onClick={onClick} className="custom-arrow custom-arrow--left d-none d-md-block px-0">
      <Icon.ChevronCompactLeft />
    </button>
  );
};

const CustomRightArrowThin = ({ onClick }) => {
  return (
    <button onClick={onClick} className="custom-arrow custom-arrow--right d-none d-md-block px-0">
      <Icon.ChevronCompactRight />
    </button>
  );
};

export { CustomLeftArrow, CustomRightArrow, CustomLeftArrowThin, CustomRightArrowThin };
