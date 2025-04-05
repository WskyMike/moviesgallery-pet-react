/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import { ChevronRight } from 'react-bootstrap-icons';
import 'react-multi-carousel/lib/styles.css';
import movieCarouselSettings from '../../vendor/movieСarouselSettings';
import { CustomLeftArrow, CustomRightArrow } from '../../vendor/customArrows';
import LazyLoadWrapper from '../LazyLoadWrapper/LazyLoadWrapper';
import MovieCard from './MovieCard/Moviecard';

import './MovieCarousel.css';

function MovieCarousel({ fetchMoviesApi, title, category, onCarouselLoaded }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null); // Реф для управления каруселью

  async function fetchMovies() {
    try {
      const { movies = [], totalPages } = await fetchMoviesApi(
        undefined,
        undefined,
        true
      );
      // Сохраняем фильмы и общее количество страниц в sessionStorage
      sessionStorage.setItem(`${category}Carousel`, JSON.stringify(movies));
      sessionStorage.setItem(`${category}Movies`, JSON.stringify(movies));
      sessionStorage.setItem(`${category}TotalPages`, totalPages.toString());

      setMovies(movies);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const savedMovies = JSON.parse(
      sessionStorage.getItem(`${category}Carousel`) || '[]'
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

  return (
    <div className="py-4 mx-0 mx-lg-5">
      <Link
        to={`/list/${category}`}
        className="link-underline link-underline-opacity-0 custom-link-hover text-dark">
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
          containerClass="movie-carousel-container">
          {movies.map((movie) => (
            <LazyLoadWrapper
              key={movie.id}
              component={MovieCard}
              data={movie}
              dataPropName="movie"
              onImageLoaded={onCarouselLoaded}
              isLoading={loading}
            />
          ))}
        </Carousel>

        <CustomRightArrow onClick={goToNext} />
      </div>
    </div>
  );
}

export default MovieCarousel;
