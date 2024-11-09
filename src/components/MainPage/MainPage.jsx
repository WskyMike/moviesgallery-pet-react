import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchForm from "../SearchForm/SearchForm";
import MovieCarousel from "../MovieCarousel/MovieCarousel";
import { popularApi } from "../../utils/PopularApi";
import { topRatedApi } from "../../utils/TopRatedApi";
import { nowPlayingApi } from "../../utils/NowPlayingApi";
import { popularRusApi } from "../../utils/PopularRusApi";
// import { popularTvApi } from "../../utils/PopularTvApi";

function MainPage() {
  const [currentCarousel, setCurrentCarousel] = useState(0);

  console.log(currentCarousel);

  // Массив подборок фильмов (каруселей)
  const carousels = [
    {
      title: "Популярные фильмы",
      fetchMoviesApi: popularApi,
      category: "popular",
    },
    {
      title: "Сейчас в кино",
      fetchMoviesApi: nowPlayingApi,
      category: "nowPlaying",
    },
    {
      title: "Лучшие фильмы",
      fetchMoviesApi: topRatedApi,
      category: "topRated",
    },
    {
      title: "Популярные российские фильмы",
      fetchMoviesApi: popularRusApi,
      category: "popularRus",
    },
  ];

  // Последовательная загрузка каждой карусели
  useEffect(() => {
    if (currentCarousel < carousels.length) {
      const timeout = setTimeout(() => {
        setCurrentCarousel((prev) => prev + 1);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [currentCarousel, carousels.length]);

  return (
    <Container fluid>
      <SearchForm />
      {carousels.slice(0, currentCarousel + 1).map((carousel, index) => (
        <MovieCarousel
          key={index}
          title={carousel.title}
          fetchMoviesApi={carousel.fetchMoviesApi}
          category={carousel.category}
        />
      ))}
    </Container>
  );
}

export default MainPage;
