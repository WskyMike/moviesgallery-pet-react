/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import { ChevronRight } from "react-bootstrap-icons";
import "react-multi-carousel/lib/styles.css";
import movieCarouselSettings from "../../vendor/movieСarouselSettings";
import { CustomLeftArrow, CustomRightArrow } from "../../vendor/customArrows";
import MovieCard from "../MovieCard/Moviecard";
import "./MovieCarousel.css";

function MovieCarousel({ fetchMoviesApi, title, category, onCarouselLoaded }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadedImagesCount, setLoadedImagesCount] = useState(0);
  const carouselRef = useRef(null); // Реф для управления каруселью

  // Обновляем счетчик загруженных изображений на основе состояния `imageLoaded` в MovieCard для последовательной загрузки
  useEffect(() => {
    if (loadedImagesCount >= movies.length && movies.length > 0) {
      onCarouselLoaded();
    }
  }, [loadedImagesCount, movies.length]);

  async function fetchMovies() {
    try {
      const { movies = [], totalPages } = await fetchMoviesApi();
      // Сохраняем фильмы и общее количество страниц в sessionStorage
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
      sessionStorage.getItem(`${category}Movies`) || "[]"
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

  // заглушки
  const placeholderMovies = Array.from({ length: 5 }, (_, index) => ({
    id: index,
    title: (
      <div className="spinner-border text-light spinner_touch" role="status">
        <span className="visually-hidden">Загрузка...</span>
      </div>
    ),
    original_title: "",
    rating: "",
    release_date: "",
  }));

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

        <Carousel {...movieCarouselSettings} ref={carouselRef}>
          {(loading ? placeholderMovies : movies).map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isLoading={loading}
              onImageLoaded={() => setLoadedImagesCount((prev) => prev + 1)}
            />
          ))}
        </Carousel>
        <CustomRightArrow onClick={goToNext} />
      </div>
    </div>
  );
}

export default MovieCarousel;
