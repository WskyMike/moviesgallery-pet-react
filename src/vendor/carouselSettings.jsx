import "./carouselSettings.css"

const carouselSettings = {
  additionalTransfrom: 0,
  arrows: false,
  // autoPlay: true,
  // autoPlaySpeed: 20000,
  className: "carousel",
  dotListClass: "",
  focusOnSelect: false,
  infinite: true,
  itemClass: "",
  keyBoardControl: true,
  minimumTouchDrag: 80,
  renderArrowsWhenDisabled: false,
  renderButtonGroupOutside: false,
  renderDotsOutside: false,
  removeArrowOnDeviceType: ["tablet", "mobile", "smallMobile"],
  responsive: {
    largeDesktop: {
      breakpoint: { max: 3000, min: 1200 },
      items: 5,
    },
    smallDesktop: {
      breakpoint: { max: 1199, min: 768 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 767, min: 576 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 576, min: 0 },
      items: 2,
    },
    smallMobile: {
      breakpoint: { max: 380, min: 0 },
      items: 1,
    },
  },
  rewind: false,
  rewindWithAnimation: false,
  rtl: false,
  showDots: false,
  sliderClass: "",
  slidesToSlide: 5,
  swipeable: true,
};

export default carouselSettings;
