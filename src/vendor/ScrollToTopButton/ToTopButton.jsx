import { useState, useEffect } from "react";
import * as Icon from "react-bootstrap-icons";
import "./ToTopButton.css";

function ScrollToTopButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className={`scroll-to-top__button ${
        !showButton ? "scroll-to-top__button_hidden" : ""
      }`}
      onClick={handleClick}
    >
      <Icon.ArrowUp />
    </button>
  );
}

export default ScrollToTopButton;
