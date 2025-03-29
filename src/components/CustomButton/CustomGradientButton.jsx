import './CustomGradientButton.css';
import { Link } from 'react-router-dom';

function CustomGradientButton() {
  return (
    <div className="custom-gradient-button__container">
      {' '}
      <Link to="/" rel="noopener noreferrer" className="btn-grad">
        Больше фильмов и сериалов в наших подборках
      </Link>
    </div>
  );
}

export default CustomGradientButton;
