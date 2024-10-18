/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import carouselSettings from "../../vendor/carouselSettings";
import { CustomLeftArrow, CustomRightArrow } from "../../vendor/customArrows";
import MovieCard from "../MovieCard/Moviecard";
import "./MovieCarousel.css";

function MovieCarousel({ fetchMoviesApi, title, category }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null); // Реф для управления каруселью

  async function fetchMovies() {
    try {
      const { movies = [] } = await fetchMoviesApi();
      setMovies(movies);
      setLoading(false);
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies();
  }, [fetchMoviesApi]);

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
      <div className="spinner-border text-light" role="status">
        <span className="visually-hidden">Загрузка...</span>
      </div>
    ),
    original_title: "",
    rating: "",
    release_date: "",
  }));

  return (
    <div className="py-4 mx-5">
      <div className="d-flex justify-content-center align-items-center my-4 mx-3">
        <Link
          to={`/list/${category}`}
          className="link-underline link-underline-opacity-0 custom-link-hover text-dark"
        >
          <h2 className="text-start fw-semibold my-0">{title}</h2>
        </Link>
        <p className="ms-auto fw-normal fs-5 text-primary my-0">
          <Link
            to={`/list/${category}`}
            className="link-underline link-underline-opacity-0 custom-link-hover"
          >
            Смотреть ещё
          </Link>
        </p>
      </div>

      <div className="d-flex align-items-center">
        <CustomLeftArrow onClick={goToPrevious} />

        <Carousel {...carouselSettings} ref={carouselRef}>
          {(loading ? placeholderMovies : movies).map((movie) => (
            <MovieCard key={movie.id} movie={movie} isLoading={loading} />
          ))}
        </Carousel>
        <CustomRightArrow onClick={goToNext} />
      </div>
    </div>
  );
}

export default MovieCarousel;
