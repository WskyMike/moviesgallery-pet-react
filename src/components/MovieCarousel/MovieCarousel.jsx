/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import { ChevronRight } from "react-bootstrap-icons";
import "react-multi-carousel/lib/styles.css";
import movieCarouselSettings from "../../vendor/movieСarouselSettings";
import { CustomLeftArrow, CustomRightArrow } from "../../vendor/customArrows";
import MovieCard from "./MovieCard/Moviecard";
import "./MovieCarousel.css";

function MovieCarousel({ fetchMoviesApi, title, category, onCarouselLoaded }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadedImagesCount, setLoadedImagesCount] = useState(0);
  const carouselRef = useRef(null); // Реф для управления каруселью

  // Состояния для ленивой загрузки: 
  // visibleCount – количество карточек, для которых выключен placeholder;
  // loadedPages – количество «загруженных» страниц;
  const [visibleCount, setVisibleCount] = useState(0);
  const [loadedPages, setLoadedPages] = useState(2);

  // Функция для вычисления количества карточек на страницу по ширине экрана (исходя из настроек react-multi-carousel)
  const getItemsPerPage = () => {
    const width = window.innerWidth;
    if (width >= 1200) return 5;
    else if (width >= 768) return 4;
    else if (width >= 576) return 3;
    else if (width >= 316) return 2;
    else return 1;
  };

  // После загрузки фильмов сразу активируем первые две страницы (visibleCount = itemsPerPage * 2)
  useEffect(() => {
    if (!loading && movies.length > 0) {
      const itemsPerPage = getItemsPerPage();
      setVisibleCount(Math.min(movies.length, itemsPerPage * 2));
      setLoadedPages(2);
    }
  }, [loading, movies]);

  // После загрузки всех активных карточек вызываем onCarouselLoaded
  useEffect(() => {
    if (loadedImagesCount >= visibleCount && visibleCount > 0) {
      onCarouselLoaded();
    }
  }, [loadedImagesCount, visibleCount]);

  async function fetchMovies() {
    try {
      const { movies = [], totalPages } = await fetchMoviesApi();
      // Сохраняем фильмы и общее количество страниц в sessionStorage
      sessionStorage.setItem(`${category}Carousel`, JSON.stringify(movies));
      sessionStorage.setItem(`${category}Movies`, JSON.stringify(movies));
      sessionStorage.setItem(`${category}TotalPages`, totalPages.toString());

      setMovies(movies);
      setLoading(false);
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    const savedMovies = JSON.parse(
      sessionStorage.getItem(`${category}Carousel`) || "[]"
    );

    if (savedMovies.length) {
      setMovies(savedMovies);
      setLoading(false);
    } else {
      fetchMovies();
    }
  }, [fetchMoviesApi, category]);

  // Функции для управления каруселью через реф
  const goToPrevious = () => {
    if (carouselRef.current) {
      carouselRef.current.previous();
    }
  };

  const goToNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  // Обработчик смены слайда: если пользователь движется вперед и доходит до конца загруженных страниц,
  // дозагружаем следующую страницу (увеличиваем loadedPages и visibleCount)
  const handleAfterChange = (currentSlideIndex) => {
    const itemsPerPage = getItemsPerPage();
    const currentPage = Math.floor(currentSlideIndex / itemsPerPage) + 1;
    if (currentPage >= loadedPages && visibleCount < movies.length) {
      const newLoadedPages = currentPage + 1; // загружаем следующую страницу
      const newVisibleCount = Math.min(
        movies.length,
        newLoadedPages * itemsPerPage
      );
      setLoadedPages(newLoadedPages);
      setVisibleCount(newVisibleCount);
    }
  };

  return (
    <div className="py-4 mx-0 mx-lg-5">
      <Link
        to={`/list/${category}`}
        className="link-underline link-underline-opacity-0 custom-link-hover text-dark"
      >
        <div className="d-flex justify-content-start justify-content-md-center align-items-center my-4 mx-0 mx-md-3">
          <h2 className="text-start fw-semibold my-0 fs-sm-custom-5">
            {title}
          </h2>
          <p className="ms-auto fw-normal fs-5 text-primary my-0">
            {/* Текстовое отображение для экранов LG и выше */}
            <span className="d-none d-lg-block">Смотреть ещё</span>

            {/* Иконка для экранов меньше SM */}
            <span className="d-block d-lg-none">
              <ChevronRight aria-hidden="true" className="text-black" />
            </span>
          </p>
        </div>
      </Link>

      <div className="d-flex align-items-center">
        <CustomLeftArrow onClick={goToPrevious} />

        <Carousel
          {...movieCarouselSettings}
          ref={carouselRef}
          afterChange={handleAfterChange}
        >
          {movies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              // Если данные ещё загружаются или карточка находится за пределами visibleCount – isLoading=true
              isLoading={loading || index >= visibleCount}
              onImageLoaded={() => {
                // Учитываем загрузку только активных карточек
                if (index < visibleCount) {
                  setLoadedImagesCount((prev) => prev + 1);
                }
              }}
            />
          ))}
        </Carousel>

        <CustomRightArrow onClick={goToNext} />
      </div>
    </div>
  );
}

export default MovieCarousel;
