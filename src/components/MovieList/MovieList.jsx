/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import MovieCard from "../MovieCard/Moviecard";
import SearchForm from "../SearchForm/SearchForm";
import ScrollToTopButton from "../../vendor/ScrollToTopButton/ToTopButton";
import ScrollToEndButton from "../../vendor/ScrollToEndButton/ScrollToEndButton";
import BackwardButton from "../../vendor/BackwardButton/BackwardButton";
import "./MovieList.css";
import { useToast } from "../../contexts/ToastProvider";

import { popularApi } from "../../utils/PopularApi";
import { topRatedApi } from "../../utils/TopRatedApi";
import { nowPlayingApi } from "../../utils/NowPlayingApi";
import { popularRusApi } from "../../utils/PopularRusApi";

function MovieList() {
  const { category } = useParams(); // Получаем параметр из URL
  const { triggerToast } = useToast();

  // Категории на заголовки
  const titleMap = useMemo(
    () => ({
      popular: "Популярные фильмы",
      topRated: "Лучшие фильмы",
      nowPlaying: "Сейчас в кино",
      popularRus: "Популярные российские фильмы",
    }),
    []
  );

  const title = titleMap[category] || "";

  //  Маппинг категорий на API
  const apiMap = useMemo(
    () => ({
      popular: popularApi,
      topRated: topRatedApi,
      nowPlaying: nowPlayingApi,
      popularRus: popularRusApi,
    }),
    []
  );

  const currentApi = apiMap[category];

  // Определяем ключи для sessionStorage в зависимости от API
  const apiKeyMap = useMemo(
    () => ({
      popular: {
        moviesKey: "popularMovies",
        pageKey: "popularPage",
        totalPagesKey: "popularTotalPages",
      },
      topRated: {
        moviesKey: "topRatedMovies",
        pageKey: "topRatedPage",
        totalPagesKey: "topRatedTotalPages",
      },
      nowPlaying: {
        moviesKey: "nowPlayingMovies",
        pageKey: "nowPlayingPage",
        totalPagesKey: "nowPlayingTotalPages",
      },
      popularRus: {
        moviesKey: "popularRusMovies",
        pageKey: "popularRusPage",
        totalPagesKey: "popularRusTotalPages",
      },
    }),
    []
  );

  const { moviesKey, pageKey, totalPagesKey } = apiKeyMap[category];

  // Загружаем данные из sessionStorage при первом рендере
  const savedMovies = JSON.parse(sessionStorage.getItem(moviesKey) || "[]");
  const savedPage = parseInt(sessionStorage.getItem(pageKey), 10) || 1;
  const savedTotalPages =
    parseInt(sessionStorage.getItem(totalPagesKey), 10) || 0;

  const [movies, setMovies] = useState(savedMovies);
  const [page, setPage] = useState(savedPage);
  const [loading, setLoading] = useState(!savedMovies.length);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalPages, setTotalPages] = useState(savedTotalPages) || 0;

  async function fetchMovies(page) {
    try {
      const { movies: newMovies, totalPages } = await currentApi(page);

      // Фильтрация дубликатов по id
      const filteredMovies = newMovies.filter(
        (newMovie) =>
          !movies.some((existingMovie) => existingMovie.id === newMovie.id)
      );

      setMovies((prevMovies) => [...prevMovies, ...filteredMovies]);
      setTotalPages(totalPages);
      setPage(page);
      setLoading(false);
      setIsLoadingMore(false);
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
      triggerToast(
        "Ошибка при получении данных. Попробуйте немного позже.",
        "danger-subtle",
        "danger-emphasis",
        "top-center"
      );
      setLoading(false);
      setIsLoadingMore(false);
    }
  }

  // Сохраняем состояние в sessionStorage при каждом изменении списка фильмов или страницы
  useEffect(() => {
    sessionStorage.setItem(moviesKey, JSON.stringify(movies));
    sessionStorage.setItem(pageKey, page.toString());
    sessionStorage.setItem(totalPagesKey, totalPages.toString());
  }, [movies, page, totalPages]);

  // Загружаем фильмы при изменении страницы
  useEffect(() => {
    if (!savedMovies.length || page > savedPage) {
      fetchMovies(page);
    }
  }, [page]);

  // Функция загрузки следующей страницы
  const loadMoreMovies = () => {
    setIsLoadingMore(true);
    fetchMovies(page + 1);
  };

  return (
    <>
      <Container fluid="xxl">
        <ScrollToTopButton />
        <ScrollToEndButton />
        <BackwardButton />
        <SearchForm />
        <Container fluid="xl">
          <Row className="pt-2 sticky-header">
            <h2 className="text-start display-5">{title}</h2>
          </Row>
          <Row className="mb-5 mt-4">
            {loading ? (
              <Col className="text-center">
                <div className="spinner-border text-primary m-5" role="status">
                  <span className="visually-hidden">Загрузка...</span>
                </div>
              </Col>
            ) : (
              movies.map((movie, index) => (
                <Col
                  key={`${movie.id}-${index}`}
                  xs={6}
                  sm={4}
                  md={3}
                  lg={3}
                  className="mb-4 px-1 px-lg-2"
                >
                  <MovieCard movie={movie} />
                </Col>
              ))
            )}
          </Row>
          <div className="d-grid gap-2 pb-5 col-12 col-sm-6 mx-auto text-nowrap">
            {!loading && (
              <>
                {page < totalPages && (
                  <Button
                    onClick={loadMoreMovies}
                    variant="primary"
                    size="lg"
                    disabled={isLoadingMore}
                    className="d-flex align-items-center justify-content-center"
                  >
                    {isLoadingMore && (
                      <span
                        className="spinner-grow spinner-grow-sm me-3"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    )}
                    {isLoadingMore ? "Загружаю..." : "Показать ещё"}
                  </Button>
                )}
                {page >= totalPages && (
                  <Button disabled size="lg" variant="primary">
                    Фильмов больше нет
                  </Button>
                )}
              </>
            )}
          </div>
        </Container>
      </Container>
    </>
  );
}

export default MovieList;
