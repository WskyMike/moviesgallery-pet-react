import { useState, useEffect } from "react";
import * as Icon from "react-bootstrap-icons";
import "./ScrollToEndButton.css";

function ScrollToEndButton() {
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
      top: (0, document.body.scrollHeight),
      behavior: "smooth",
    });
  };

  return (
    <button
      className={`scroll-to-end__button ${
        !showButton ? "scroll-to-end__button_hidden" : ""
      }`}
      onClick={handleClick}
    >
      <Icon.ArrowDown />
    </button>
  );
}

export default ScrollToEndButton;
