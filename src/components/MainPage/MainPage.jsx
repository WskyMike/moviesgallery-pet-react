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
  return (
    <>
      <Container fluid="xxl">
        <SearchForm />
        <MovieCarousel
          title="Популярные фильмы"
          fetchMoviesApi={popularApi}
          category="popular"
        />
        <MovieCarousel
          title="Сейчас в кино"
          fetchMoviesApi={nowPlayingApi}
          category="nowPlaying"
        />
        <MovieCarousel
          title="Лучшие фильмы"
          fetchMoviesApi={topRatedApi}
          category="topRated"
        />
        <MovieCarousel
          title="Популярные российские фильмы"
          fetchMoviesApi={popularRusApi}
          category="popularRus"
        />
      </Container>
      {/* <MovieCarousel
          title="Популярные сериалы"
          fetchMoviesApi={popularTvApi}
        /> */}
    </>
  );
}

export default MainPage;
