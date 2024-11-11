/* eslint-disable react/prop-types */
import { ChevronLeft, ChevronRight, ChevronCompactLeft, ChevronCompactRight } from 'react-bootstrap-icons';
import './customArrows.css'

const CustomLeftArrow = ({ onClick }) => {
  return (
    <button onClick={onClick} className="custom-arrow custom-arrow--left d-none d-lg-block">
      <ChevronLeft />
    </button>
  );
};

const CustomRightArrow = ({ onClick }) => {
  return (
    <button onClick={onClick} className="custom-arrow custom-arrow--right d-none d-lg-block">
      <ChevronRight />
    </button>
  );
};

const CustomLeftArrowThin = ({ onClick }) => {
  return (
    <button onClick={onClick} className="custom-arrow custom-arrow--left d-none d-md-block px-0">
      <ChevronCompactLeft />
    </button>
  );
};

const CustomRightArrowThin = ({ onClick }) => {
  return (
    <button onClick={onClick} className="custom-arrow custom-arrow--right d-none d-md-block px-0">
      <ChevronCompactRight />
    </button>
  );
};

export { CustomLeftArrow, CustomRightArrow, CustomLeftArrowThin, CustomRightArrowThin };
