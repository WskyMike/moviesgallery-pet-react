/* eslint-disable react/prop-types */
import {
  ChevronLeft,
  ChevronRight,
  ChevronCompactLeft,
  ChevronCompactRight,
} from 'react-bootstrap-icons';
import './customArrows.css';

// isHidden - пропс для скрытия стрелок
const CustomLeftArrow = ({ onClick, isHidden = false }) => {
  return (
    <button
      onClick={onClick}
      className={`custom-arrow custom-arrow--left d-none d-lg-block ${
        isHidden ? 'hidden-arrow' : ''
      }`}>
      <ChevronLeft />
    </button>
  );
};

const CustomRightArrow = ({ onClick, isHidden = false }) => {
  return (
    <button
      onClick={onClick}
      className={`custom-arrow custom-arrow--right d-none d-lg-block ${
        isHidden ? 'hidden-arrow' : ''
      }`}>
      <ChevronRight />
    </button>
  );
};

const CustomLeftArrowThin = ({ onClick, isHidden = false }) => {
  return (
    <button
      onClick={onClick}
      className={`custom-arrow custom-arrow--left d-none d-md-block px-0 ${
        isHidden ? 'hidden-arrow' : ''
      }`}>
      <ChevronCompactLeft />
    </button>
  );
};

const CustomRightArrowThin = ({ onClick, isHidden = false }) => {
  return (
    <button
      onClick={onClick}
      className={`custom-arrow custom-arrow--right d-none d-md-block px-0 ${
        isHidden ? 'hidden-arrow' : ''
      }`}>
      <ChevronCompactRight />
    </button>
  );
};

export {
  CustomLeftArrow,
  CustomRightArrow,
  CustomLeftArrowThin,
  CustomRightArrowThin,
};
