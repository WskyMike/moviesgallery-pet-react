/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Form,
  Row,
  Col,
  Button,
  NavDropdown,
} from "react-bootstrap";
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
import { popularTvApi } from "../../utils/PopularTvApi";
import { GenresApi } from "../../utils/GenresApi";

function MovieList() {
  const { category } = useParams(); // Получаем параметр из URL
  const { triggerToast } = useToast();
  const [genres, setGenres] = useState([]); // Список жанров

  // Категории на заголовки
  const titleMap = useMemo(
    () => ({
      popular: "Популярные фильмы",
      topRated: "Лучшие фильмы",
      nowPlaying: "Сейчас в кино",
      popularRus: "Популярные российские фильмы",
      popularTv: "Лучшие сериалы",
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
      popularTv: popularTvApi,
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
      popularTv: {
        moviesKey: "popularTvMovies",
        pageKey: "popularTvPage",
        totalPagesKey: "popularTvTotalPages",
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
  const [selectedGenre, setSelectedGenre] = useState(""); //Выбранный жанр
  const [showRussianOnly, setShowRussianOnly] = useState(
    JSON.parse(sessionStorage.getItem("showRussianOnly")) || false
  );

  async function fetchMovies(
    page,
    genre = selectedGenre,
    isReset = false,
    lang = showRussianOnly ? "ru" : ""
  ) {
    try {
      const { movies: newMovies, totalPages } = await currentApi(
        page,
        genre,
        false,
        lang
      );

      const updatedMovies = isReset ? newMovies : [...movies, ...newMovies];

      setMovies(updatedMovies);
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

  // Обработчик для изменения состояния жанра
  const handleGenreChange = (genreId) => {
    setLoading(true);
    setSelectedGenre(genreId);
    setMovies([]);
    setPage(1);
    fetchMovies(1, genreId, true);
  };

  // Обработчик переключателя
  const handleSwitchChange = (e) => {
    const isRussian = e.target.checked;
    setShowRussianOnly(isRussian);
    setLoading(true);
    setMovies([]);
    setPage(1);
    fetchMovies(1, selectedGenre, true, isRussian ? "ru" : "");
  };

  // Сохраняем состояния в sessionStorage при каждом изменении зависимостей
  useEffect(() => {
    sessionStorage.setItem(moviesKey, JSON.stringify(movies));
    sessionStorage.setItem(pageKey, page.toString());
    sessionStorage.setItem(totalPagesKey, totalPages.toString());
    sessionStorage.setItem("showRussianOnly", JSON.stringify(showRussianOnly));
  }, [movies, page, totalPages, showRussianOnly]);

  // Проверим наличе данных в storage
  useEffect(() => {
    if (!savedMovies.length) {
      setLoading(true);
      fetchMovies(1, selectedGenre, true);
    }
  }, []);

  // Функция загрузки следующей страницы
  const loadMoreMovies = () => {
    setIsLoadingMore(true);
    fetchMovies(page + 1, selectedGenre);
  };

  // Загружаем жанры
  useEffect(() => {
    async function fetchGenres() {
      try {
        const isTvSeries = category === "popularTv";
        const data = await GenresApi(isTvSeries);

        // Преобразуем название жанра каждого объекта в массиве в верхний регистр
        const updatedGenres = data.genres.map((genre) => ({
          ...genre,
          name: genre.name.charAt(0).toUpperCase() + genre.name.slice(1),
        }));

        setGenres(updatedGenres);
      } catch (error) {
        console.error("Ошибка загрузки жанров:", error);
      }
    }
    fetchGenres();
  }, [category]);

  return (
    <>
      <Container fluid="xxl">
        <ScrollToTopButton />
        <ScrollToEndButton />
        <BackwardButton />
        <SearchForm />
        <Container fluid="xl">
          <Row className="pt-2 pb-2 pb-md-0 sticky-header d-flex align-items-center justify-content-between">
            <Col xs="auto">
              <h2 className="text-start display-5">{title}</h2>
            </Col>
            {(category === "nowPlaying" ||
              category === "topRated" ||
              category === "popularTv") && (
              <Col xs="auto" className="ms-md-auto">
                <Form.Check
                  reverse
                  type="switch"
                  className="movie-list__dropdown-button"
                  id="russian-movies-switch"
                  label="Только российские"
                  checked={showRussianOnly}
                  onChange={handleSwitchChange}
                />
              </Col>
            )}

            <Col xs="auto" className="ms-md-3">
              <NavDropdown
                id="nav-dropdown"
                title={
                  selectedGenre
                    ? genres.find((g) => g.id === selectedGenre)?.name + " " ||
                      "Фильтр по жанру "
                    : "Фильтр по жанру "
                }
                variant="light"
                className="movie-list__dropdown-button"
              >
                <div className="movie-list__custom-scroll">
                  <NavDropdown.Item
                    onClick={() => handleGenreChange("")}
                    key="all"
                    href="#/all"
                  >
                    Все
                  </NavDropdown.Item>
                  {genres.map((genre) => (
                    <NavDropdown.Item
                      onClick={() => handleGenreChange(genre.id)}
                      className="fw-light"
                      key={genre.id}
                      href={`#/genre-${genre.id}`}
                    >
                      {genre.name}
                    </NavDropdown.Item>
                  ))}
                </div>
              </NavDropdown>
            </Col>
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
