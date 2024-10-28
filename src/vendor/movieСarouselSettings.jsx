import "./carouselSettings.css"

const movieCarouselSettings = {
  additionalTransfrom: 0,
  arrows: false,
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
      slidesToSlide: 5,
    },
    smallDesktop: {
      breakpoint: { max: 1199, min: 768 },
      items: 4,
      slidesToSlide: 4,
    },
    tablet: {
      breakpoint: { max: 767, min: 576 },
      items: 3,
      slidesToSlide: 3,
    },
    mobile: {
      breakpoint: { max: 575, min: 316 },
      items: 2,
      slidesToSlide: 2,
    },
    smallMobile: {
      breakpoint: { max: 315, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  },
  rewind: false,
  rewindWithAnimation: false,
  rtl: false,
  showDots: false,
  sliderClass: "",
  swipeable: true,
};

export default movieCarouselSettings;
