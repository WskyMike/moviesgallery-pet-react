import { useState, useEffect, useRef } from 'react';
import { popularTvApi } from '../../utils/PopularTvApi';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import carouselSettings from '../../vendor/carouselSettings';
import { CustomLeftArrow, CustomRightArrow } from '../../vendor/customArrows';
import MovieCard from '../MovieCard/Moviecard';

function PopularRow() {
  const [movies, setMovies] = useState([]);
  const carouselRef = useRef(null); // Реф для управления каруселью

  useEffect(() => {
    async function fetchMovies() {
      try {
        const data = await popularTvApi();
        setMovies(data);
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    }

    fetchMovies();
  }, []);

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
    <div className="mb-5 mx-5">
      <div className="d-flex justify-content-center align-items-center my-2 mx-3">
        <h2 className="text-start fw-semibold my-0">Лучшие сериалы и шоу</h2>
        <p className="ms-auto fw-normal text-primary my-0">Смотреть ещё</p>
      </div>

      <div className="d-flex align-items-center">
        <CustomLeftArrow onClick={goToPrevious} />

        <Carousel {...carouselSettings} ref={carouselRef}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </Carousel>
        <CustomRightArrow onClick={goToNext} />
      </div>
    </div>
  );
}

export default PopularRow;
