/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLoading } from "../../contexts/LoadingContext";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastProvider";

import { toggleBookmark, checkBookmarkStatus } from "../../utils/BookmarkUtils";

import { movieDetailsData } from "../../utils/MovieDetailApi";
import { creditsMovieData } from "../../utils/CreditsMovieApi";
import { videosData } from "../../utils/VideosApi";
import ActorsCarousel from "../ActorsCarousel/ActorsCarousel";
import useMobileLayout from "../../hooks/useMobileLayout";
import "./MovieDetails.css";
import * as Icon from "react-bootstrap-icons";

function MovieDetailsPage() {
  const { triggerToast } = useToast();
  const { id } = useParams(); // Получаем ID фильма из URL
  const [movie, setMovie] = useState(null);
  const { movieDetailsLoading, setMovieDetailsLoading } = useLoading();
  const [credits, setCredits] = useState({
    directors: "",
  });
  const [videoKeys, setVideoKeys] = useState([]);
  const [error, setError] = useState(null);
  const [loadingTrailer, setLoadingTrailer] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const { user, authLoading } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const isMobile = useMobileLayout();

  // Фильм
  async function fetchMovieDetails() {
    try {
      setMovieDetailsLoading(true);
      const data = await movieDetailsData(id);
      setMovie(data);
      setMovieDetailsLoading(false);
      // Устанавливаем переменную CSS для фонового изображения
      // document.documentElement.style.setProperty(
      //   "--backdrop-url",
      //   `url(${data.backdrop})`
      // );
    } catch (err) {
      setError(err.message);
      triggerToast(
        `Ошибка запроса данных (${err.message})`,
        "danger-subtle",
        "danger-emphasis"
      );
      setMovieDetailsLoading(false);
    }
  }

  // Актеры
  async function fetchCredits() {
    try {
      const data = await creditsMovieData(id);
      setCredits(data);
    } catch (err) {
      setError(err.message);
      triggerToast(
        `Ошибка запроса данных (${err.message})`,
        "danger-subtle",
        "danger-emphasis"
      );
    }
  }

  // Трейлер
  async function fetchVideos() {
    try {
      const keys = await videosData(id);
      setVideoKeys(keys);
      setLoadingTrailer(false);
    } catch (err) {
      setError(err.message);
      triggerToast(
        `Ошибка запроса данных (${err.message})`,
        "danger-subtle",
        "danger-emphasis"
      );
    }
  }

  // Проверка, есть ли фильм в закладках
  useEffect(() => {
    if (user && id) {
      checkBookmarkStatus({
        userId: user.uid,
        movieId: id,
        setIsBookmarked,
        triggerToast,
      });
    }
  }, [user, id, triggerToast]);

  // Добавление или удаление фильма из закладок
  const handleBookmarkClick = () => {
    if (authLoading || !user) {
      triggerToast(
        "Необходимо войти в аккаунт",
        "info-subtle",
        "info-emphasis",
        "top-center"
      );
      return;
    }

    toggleBookmark({
      userId: user.uid,
      movieId: id,
      isBookmarked,
      setIsBookmarked,
      triggerToast,
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setMovieDetailsLoading(true);
    fetchMovieDetails();
    fetchCredits();
    fetchVideos();
  }, [id]);

  if (movieDetailsLoading) {
    return (
      <div className="spinner-border text-primary m-5" role="status">
        <span className="visually-hidden">Загрузка...</span>
      </div>
    );
  }
  if (error) {
    return <div className="m-5">Ошибка: {error}</div>;
  }

  return (
    <>
      <section className="moviedetails-backdrop pt-md-5 pt-4 pb-5 px-sm-4 px-md-5">
        <Container fluid="xl">
          {/* Мобильная версия */}
          {isMobile ? (
            <div className="d-flex align-items-center justify-content-center flex-column">
              <Col xs={8} sm={6} className="mb-4">
                {movie?.poster ? (
                  <img
                    src={movie.poster}
                    alt={movie.title || movie.name}
                    className="img-fluid rounded-3"
                  />
                ) : (
                  <div>Постер не доступен</div>
                )}
              </Col>
              <Row className="mb-2">
                <h1 className="mb-1 fs-2 text-center fw-bold">
                  {movie?.title}
                </h1>
                <h2 className="fs-4 text-center fw-light">
                  <small>{movie?.original_title}</small>
                </h2>
              </Row>
              <Row className="mb-5 mx-2">
                <div>
                  <small className="text-secondary">
                    {movie?.release_year || "-"},&nbsp;
                    {movie?.genres.join(", ") || "-"}
                  </small>
                </div>
                <div>
                  <small className="text-secondary">
                    {movie?.production_countries || "-"},&nbsp;
                    {movie?.runtime || "-"}{" "}
                  </small>
                </div>
              </Row>
              <Row className="mb-5 align-items-center w-100">
                <Col xs={6} className="text-center">
                  <div className="text-secondary">Рейтинг TMDB:</div>
                  <div className="fw-bold display-5">
                    {movie?.rating || "-"}{" "}
                    <span className="fs-5 text-secondary fw-semibold">
                      / 10
                    </span>
                  </div>
                </Col>

                <Col xs={6}>
                  <button
                    type="button"
                    className="btn btn-warning text-nowrap bookmark-button"
                    onClick={handleBookmarkClick}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    {isBookmarked ? (
                      <Icon.BookmarkStarFill
                        className="me-2"
                        width="18"
                        height="18"
                      />
                    ) : isHovered ? (
                      <Icon.BookmarkStar
                        className="me-2"
                        width="18"
                        height="18"
                      />
                    ) : (
                      <Icon.Bookmark className="me-2" width="18" height="18" />
                    )}
                    Буду смотреть
                  </button>
                </Col>
              </Row>
              <Row className="mb-5">
                <h3 className="text-start fw-bold fs-5 mb-4">О фильме</h3>
                <Row className="pe-0">
                  <figure>
                    {movie?.tagline && (
                      <figcaption className="fst-italic text-end blockquote-footer">
                        {movie.tagline}
                      </figcaption>
                    )}
                  </figure>
                </Row>
                <Row className="text-start fs-6 text-secondary pe-0">
                  <Col xs={6}>
                    <p>
                      <small>Оригинальный язык</small>
                    </p>
                  </Col>
                  <Col xs={6}>
                    <p className="text-black text-end">
                      <small>{movie?.original_language || "-"}</small>
                    </p>
                  </Col>
                </Row>
                <Row className="text-start fs-6 text-secondary pe-0">
                  <Col xs={6}>
                    <p>
                      <small>Дата выхода</small>
                    </p>
                  </Col>
                  <Col xs={6}>
                    <p className="text-black text-end">
                      <small>{movie?.release_date || "-"}</small>
                    </p>
                  </Col>
                </Row>
                <Row className="text-start fs-6 text-secondary pe-0">
                  <Col xs={6}>
                    <p>
                      <small>Режиссер</small>
                    </p>
                  </Col>
                  <Col xs={6}>
                    <p className="text-black text-end">
                      <small>{credits?.directors || "-"}</small>{" "}
                    </p>
                  </Col>
                </Row>
                <Row className="text-start fs-6 text-secondary pe-0">
                  <Col xs={6}>
                    <p>
                      <small>Кинокомпания</small>
                    </p>
                  </Col>
                  <Col xs={6}>
                    <p className="text-black text-end">
                      <small>{movie?.production_companies || "-"}</small>
                    </p>
                  </Col>
                </Row>
                <Row className="text-start fs-6 text-secondary pe-0">
                  <Col xs={6}>
                    <p>
                      <small>Бюджет</small>
                    </p>
                  </Col>
                  <Col xs={6}>
                    <p className="text-black text-end">
                      <small>{movie?.budget || "-"}</small>
                    </p>
                  </Col>
                </Row>
                <Row className="text-start fs-6 text-secondary pe-0">
                  <Col xs={6}>
                    <p>
                      <small>Сборы в мире</small>
                    </p>
                  </Col>
                  <Col xs={6}>
                    <p className="text-black text-end">
                      <small>{movie?.revenue || "-"}</small>
                    </p>
                  </Col>
                </Row>
                <Row className="m-0">
                  <hr className="my-4"></hr>
                  <small className="text-start p-0">
                    {movie?.overview || "Простите, но описания не нашлось."}
                  </small>
                </Row>
              </Row>
              <Row className="mb-5 mt-4 w-100">
                <h3 className="text-start fw-bold fs-5 ps-0 mb-4">Трейлер</h3>
                {loadingTrailer ? (
                  <div className="spinner-border text-dark m-5" role="status">
                    <span className="visually-hidden">Загрузка...</span>
                  </div>
                ) : videoKeys.length > 0 ? (
                  videoKeys.map((key) => (
                    <div key={key} className="ratio ratio-16x9 mb-4">
                      <iframe
                        src={`https://youtube.com/embed/${key}?rel=0`}
                        title="Video Trailer"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      ></iframe>
                    </div>
                  ))
                ) : (
                  <p>Трейлеров нет &#128532;</p>
                )}
              </Row>
            </div>
          ) : (
            <div>
              {/* Десктопная версия */}
              <Row className="gx-5 mb-5 justify-content-center">
                <Col lg={4}>
                  {movie?.poster ? (
                    <img
                      src={movie.poster}
                      alt={movie.title || movie.name}
                      className="img-fluid rounded-3"
                    />
                  ) : (
                    <div>Постер не доступен</div>
                  )}
                  <Row className="text-start mt-3 justify-content-center">
                    <h3 className="text-start fw-bold fs-5 mt-5 mb-4 px-0">
                      Трейлер
                    </h3>
                    {loadingTrailer ? (
                      <div
                        className="spinner-border text-dark m-5"
                        role="status"
                      >
                        <span className="visually-hidden">Загрузка...</span>
                      </div>
                    ) : videoKeys.length > 0 ? (
                      videoKeys.map((key) => (
                        <div key={key} className="ratio ratio-16x9 mb-4">
                          <iframe
                            src={`https://youtube.com/embed/${key}?rel=0`}
                            title="Video Trailer"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          ></iframe>
                        </div>
                      ))
                    ) : (
                      <p>Ничего нет &#128532;</p>
                    )}
                  </Row>
                </Col>
                <Col lg={8} className="px-5 px-lg-4">
                  <Row className="mb-5">
                    <h1 className="fs-2 text-md-start text-center fw-bold">
                      {movie?.title}
                      <small className="fw-light">
                        &nbsp;({movie?.release_year || "-"})
                      </small>
                    </h1>
                    <h2 className="fs-5 text-md-start text-center text-secondary">
                      {movie?.original_title}
                    </h2>
                  </Row>
                  <Row>
                    <Col md={8}>
                      <h3 className="text-start fw-bold fs-5 mb-4">О фильме</h3>
                      <Row>
                        <figure>
                          {movie?.tagline && (
                            <figcaption className="fst-italic text-start blockquote-footer">
                              {movie.tagline}
                            </figcaption>
                          )}
                        </figure>
                      </Row>
                      <Row className="text-start fs-6 text-secondary">
                        <Col md={5}>
                          <p>
                            <small>Жанр</small>
                          </p>
                        </Col>
                        <Col md={7}>
                          <p className="text-black">
                            <small>{movie?.genres.join(", ") || "-"}</small>
                          </p>
                        </Col>
                      </Row>
                      <Row className="text-start fs-6 text-secondary">
                        <Col md={5}>
                          <p>
                            <small>Продолжительность</small>
                          </p>
                        </Col>
                        <Col md={7}>
                          <p className="text-black">
                            <small>{movie?.runtime || "-"}</small>
                          </p>
                        </Col>
                      </Row>
                      <Row className="text-start fs-6 text-secondary">
                        <Col md={5}>
                          <p>
                            <small>Страна</small>
                          </p>
                        </Col>
                        <Col md={7}>
                          <p className="text-black">
                            <small>{movie?.production_countries || "-"}</small>
                          </p>
                        </Col>
                      </Row>
                      <Row className="text-start fs-6 text-secondary">
                        <Col md={5}>
                          <p>
                            <small>Оригинальный язык</small>
                          </p>
                        </Col>
                        <Col md={7}>
                          <p className="text-black">
                            <small>{movie?.original_language || "-"}</small>
                          </p>
                        </Col>
                      </Row>
                      <Row className="text-start fs-6 text-secondary">
                        <Col md={5}>
                          <p>
                            <small>Дата выхода</small>
                          </p>
                        </Col>
                        <Col md={7}>
                          <p className="text-black">
                            <small>{movie?.release_date || "-"}</small>
                          </p>
                        </Col>
                      </Row>
                      <Row className="text-start fs-6 text-secondary">
                        <Col md={5}>
                          <p>
                            <small>Режиссер</small>
                          </p>
                        </Col>
                        <Col md={7}>
                          <p className="text-black">
                            <small>{credits?.directors || "-"}</small>{" "}
                          </p>
                        </Col>
                      </Row>
                      <Row className="text-start fs-6 text-secondary">
                        <Col md={5}>
                          <p>
                            <small>Кинокомпания</small>
                          </p>
                        </Col>
                        <Col md={7}>
                          <p className="text-black">
                            <small>{movie?.production_companies || "-"}</small>
                          </p>
                        </Col>
                      </Row>
                      <Row className="text-start fs-6 text-secondary">
                        <Col md={5}>
                          <p>
                            <small>Бюджет</small>
                          </p>
                        </Col>
                        <Col md={7}>
                          <p className="text-black">
                            <small>{movie?.budget || "-"}</small>
                          </p>
                        </Col>
                      </Row>
                      <Row className="text-start fs-6 text-secondary">
                        <Col md={5}>
                          <p>
                            <small>Сборы в мире</small>
                          </p>
                        </Col>
                        <Col md={7}>
                          <p className="text-black">
                            <small>{movie?.revenue || "-"}</small>
                          </p>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={4}>
                      <div className="text-secondary">Рейтинг TMDB:</div>
                      <div className="fw-bold display-5">
                        {movie?.rating || "-"}{" "}
                        <span className="fs-5 text-secondary fw-semibold">
                          / 10
                        </span>
                      </div>
                      <button
                        type="button"
                        className="btn btn-warning my-5 bookmark-button"
                        onClick={handleBookmarkClick}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        {isBookmarked ? (
                          <Icon.BookmarkStarFill
                            className="me-2"
                            width="26"
                            height="26"
                          />
                        ) : isHovered ? (
                          <Icon.BookmarkStar
                            className="me-2"
                            width="26"
                            height="26"
                          />
                        ) : (
                          <Icon.Bookmark
                            className="me-2"
                            width="26"
                            height="26"
                          />
                        )}
                        Буду смотреть
                      </button>
                    </Col>
                  </Row>
                  <Row>
                    <hr className="my-4"></hr>
                    <p className="text-start">
                      {movie?.overview || "Простите, но описания не нашлось."}
                    </p>
                  </Row>
                </Col>
              </Row>
            </div>
          )}
          <Row className="mx-0 px-0 mt-3 mt-lg-5">
            <h3 className="text-start fw-bold fs-5 ps-0 mb-4">Актеры</h3>
            <ActorsCarousel />
          </Row>
        </Container>
      </section>
    </>
  );
}

export default MovieDetailsPage;
