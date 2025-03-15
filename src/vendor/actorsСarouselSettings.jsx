import "./carouselSettings.css"

const actorsСarouselSettings = {
  additionalTransfrom: 0,
  arrows: false,
  className: "carousel",
  dotListClass: "",
  focusOnSelect: false,
  infinite: false,
  itemClass: "",
  keyBoardControl: true,
  minimumTouchDrag: 40,
  renderArrowsWhenDisabled: false,
  renderButtonGroupOutside: false,
  renderDotsOutside: false,
  removeArrowOnDeviceType: ["tablet", "mobile", "smallMobile"],
  responsive: {
    largeDesktop: {
      breakpoint: { max: 3000, min: 1200 },
      items: 8,
      slidesToSlide: 8,
    },
    smallDesktop: {
      breakpoint: { max: 1199, min: 768 },
      items: 7,
      slidesToSlide: 7,
    },
    tablet: {
      breakpoint: { max: 767, min: 576 },
      items: 6,
      slidesToSlide: 6,
    },
    mobile: {
      breakpoint: { max: 575, min: 316 },
      items: 4,
      slidesToSlide: 4,
    },
    smallMobile: {
      breakpoint: { max: 315, min: 0 },
      items: 3,
      slidesToSlide: 3,
    },
  },
  rewind: false,
  rewindWithAnimation: false,
  rtl: false,
  showDots: false,
  sliderClass: "",
  swipeable: true,
};

export default actorsСarouselSettings;
