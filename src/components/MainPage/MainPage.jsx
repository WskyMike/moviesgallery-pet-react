import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLoading } from "../../contexts/LoadingContext";
import SearchForm from "../SearchForm/SearchForm";
import MovieCarousel from "../MovieCarousel/MovieCarousel";
import { popularApi } from "../../utils/PopularApi";
import { topRatedApi } from "../../utils/TopRatedApi";
import { nowPlayingApi } from "../../utils/NowPlayingApi";
import { popularRusApi } from "../../utils/PopularRusApi";
import { popularTvApi } from "../../utils/PopularTvApi";

function MainPage() {
  const [currentCarousel, setCurrentCarousel] = useState(0);
  const { setMainPageLoading } = useLoading();

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
      title: "Лучшие сериалы",
      fetchMoviesApi: popularTvApi,
      category: "popularTv",
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
  const handleCarouselLoadComplete = () => {
    setCurrentCarousel((prev) => prev + 1);
  };

  // Отслеживаем загрузку для футера
  useEffect(() => {
    if (currentCarousel >= carousels.length) {
      setMainPageLoading(false);
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
          // Только последняя (открытая) карусель уведомляет, что её первая страница полностью загрузилась,
          // и только тогда запускается загрузка следующей карусели.
          onCarouselLoaded={
            index === currentCarousel ? handleCarouselLoadComplete : () => {}
          }
        />
      ))}
    </Container>
  );
}

export default MainPage;
