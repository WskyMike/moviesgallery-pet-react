import * as Icon from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom"; 
import "./BackwardButton.css";

function BackwardButton() {
  const navigate = useNavigate(); 
  const handleClick = () => {
    navigate(-1); 
  };

  return (
    <button
      className={`backward__button d-none d-xl-block`}
      onClick={handleClick} 
    >
      <Icon.ArrowLeftShort />
    </button>
  );
}

export default BackwardButton;
