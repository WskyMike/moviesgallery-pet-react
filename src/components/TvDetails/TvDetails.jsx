/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Row, Col, Card } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLoading } from "../../contexts/LoadingContext";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastProvider";

import { toggleBookmark, checkBookmarkStatus } from "../../utils/BookmarkUtils";

import { tvDetailsData } from "../../utils/TvDetailApi";
import { tvVideosData } from "../../utils/TvVideosApi";
import ActorsCarousel from "../ActorsCarousel/ActorsCarousel";
import useMobileLayout from "../../hooks/useMobileLayout";
import "./TvDetails.css";
import {
  Bookmark,
  BookmarkStar,
  BookmarkStarFill,
} from "react-bootstrap-icons";
import { VscQuote } from "react-icons/vsc";

import { BsCalendar3, BsCheck2Square } from "react-icons/bs";

function TvDetailsPage() {
  const { triggerToast } = useToast();
  const { id } = useParams(); // Получаем ID фильма из URL
  const [movie, setMovie] = useState(null);
  const { movieDetailsLoading, setMovieDetailsLoading } = useLoading();
  const [videoKeys, setVideoKeys] = useState([]);
  const [error, setError] = useState(null);
  const [loadingTrailer, setLoadingTrailer] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const { user, authLoading } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const isMobile = useMobileLayout();

  useEffect(() => {
    // Устанавливаем title в зависимости от названия фильма
    document.title = movie?.name
      ? movie.original_name && movie.name !== movie.original_name
        ? `${movie.name} • ${movie.original_name}`
        : movie.name
      : "Киногалерея";

    return () => {
      document.title = "Киногалерея";
    };
  }, [movie]);

  // Фильм
  async function fetchTvDetails() {
    try {
      const data = await tvDetailsData(id);
      setMovie(data);
    } catch (err) {
      setError(err.message);
      console.error(err);
      triggerToast(
        `Ошибка запроса данных (${err.message})`,
        "danger-subtle",
        "danger-emphasis"
      );
    } finally {
      setMovieDetailsLoading(false);
    }
  }

  // Трейлер
  async function fetchVideos() {
    try {
      const keys = await tvVideosData(id);
      setVideoKeys(keys);
      setLoadingTrailer(false);
    } catch (err) {
      setError(err.message);
      triggerToast(
        `Ошибка запроса данных для видео (${err.message})`,
        "danger-subtle",
        "danger-emphasis"
      );
    }
  }

  // Проверка, есть ли сериал в закладках
  useEffect(() => {
    if (user && id && movie?.media_type) {
      checkBookmarkStatus({
        userId: user.uid,
        itemId: id,
        mediaType: movie.media_type,
        setIsBookmarked,
        triggerToast,
      });
    }
  }, [user, id, movie?.media_type, triggerToast]);

  // Добавление или удаление сериала из закладок
  const handleBookmarkClick = () => {
    if (authLoading || !user) {
      triggerToast("Необходимо войти в аккаунт");
      return;
    }

    toggleBookmark({
      userId: user.uid,
      itemId: id,
      mediaType: movie.media_type,
      isBookmarked,
      setIsBookmarked,
      triggerToast,
    });
  };

  useEffect(() => {
    setMovieDetailsLoading(true);
    window.scrollTo(0, 0);
    fetchTvDetails();
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
                    alt={movie.name}
                    className="img-fluid rounded-3"
                  />
                ) : (
                  <div>Постер не доступен</div>
                )}
              </Col>
              <Row className="mb-2">
                <h1 className="mb-1 fs-2 text-center fw-bold">{movie?.name}</h1>
                <h2 className="fs-4 text-center fw-light">
                  <small>{movie?.original_name}</small>
                </h2>
              </Row>
              <Row className="mb-5 mx-2">
                <div>
                  <small className="text-secondary">
                    {movie?.first_air_year || null} -{" "}
                    {movie?.status === "Завершился" ||
                    movie?.status === "Отменён"
                      ? movie?.last_air_year
                      : "н.в."}
                    &nbsp;
                    <br />
                    {movie?.genres.join(", ") || "-"}
                  </small>
                </div>
                <div>
                  <small className="text-secondary">
                    {movie?.production_countries}
                    {movie?.episode_run_time
                      ? `, ${movie.episode_run_time}`
                      : ""}
                  </small>
                </div>
              </Row>
              <Row className="mb-5 mt-3 align-items-center w-100">
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
                      <BookmarkStarFill
                        className="me-2"
                        width="18"
                        height="18"
                      />
                    ) : isHovered ? (
                      <BookmarkStar className="me-2" width="18" height="18" />
                    ) : (
                      <Bookmark className="me-2" width="18" height="18" />
                    )}
                    Буду смотреть
                  </button>
                </Col>
              </Row>
              <Row className="mb-5">
                <Row className="pe-0">
                  {movie?.tagline && (
                    <figure className="mb-4">
                      <VscQuote className="d-flex fs-4" />
                      <blockquote
                        className="fst-italic text-start text-secondary blockquote mt-1 ps-4"
                        style={{ fontSize: "0.9rem" }}
                      >
                        <p>{movie.tagline}</p>
                      </blockquote>
                    </figure>
                  )}
                </Row>
                <h3 className="text-start fw-bold fs-5 mb-4">О сериале</h3>
                <Row className="text-start fs-6 text-secondary pe-0">
                  <Col xs={6}>
                    <p>
                      <small>Статус</small>
                    </p>
                  </Col>
                  <Col sx={6}>
                    <p className="text-end">
                      <small
                        className={`badge fw-normal ${
                          {
                            Продолжается: "text-bg-success",
                            Завершился: "text-bg-danger",
                            "В производстве": "text-bg-warning",
                            Запланирован: "text-bg-info",
                            Отменён: "text-bg-secondary",
                            "Пилотный выпуск": "text-bg-primary",
                          }[movie?.status] || "text-bg-secondary"
                        }`}
                        style={{ fontSize: "0.875em" }}
                      >
                        {movie?.status || "Неизвестен"}
                      </small>
                    </p>
                  </Col>
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
                      <small>Первый эпизод</small>
                    </p>
                  </Col>
                  <Col xs={6}>
                    <p className="text-black text-end">
                      <small>{movie?.first_air_date || "-"}</small>
                    </p>
                  </Col>
                </Row>
                <Row className="text-start fs-6 text-secondary pe-0">
                  <Col xs={6}>
                    <p>
                      <small>Последний эпизод</small>
                    </p>
                  </Col>
                  <Col xs={6}>
                    <p className="text-black text-end">
                      <small>{movie?.last_air_date || "-"}</small>
                    </p>
                  </Col>
                </Row>
                <Row className="text-start fs-6 text-secondary">
                  <Col xs={6}>
                    <p>
                      <small>Создатель</small>
                    </p>
                  </Col>
                  <Col xs={6}>
                    <p className="text-black text-end">
                      <small>{movie?.creator || "-"}</small>{" "}
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
                <Row className="m-0">
                  <hr className="my-4"></hr>
                  <small className="text-start p-0">
                    {movie?.overview || "Простите, но описания не нашлось."}
                  </small>
                </Row>
              </Row>
              {/* Карточка сезон */}
              <Row className="text-start mx-0 mb-5">
                <h3 className=" fw-bold fs-5 mb-4 mt-3 px-0">Текущий сезон</h3>
                <Card className="border-0 bg-light text-start px-0">
                  <Col className="d-flex">
                    <Card.Body className="d-flex flex-column justify-content-start">
                      <Card.Title className="fw-semibold">
                        {movie?.last_production_season.name}{" "}
                      </Card.Title>
                      <Card.Text className="mb-2">
                        {movie?.last_production_season.vote_average > 0 && (
                          <span
                            className="badge fw-semibold text-bg-secondary"
                            style={{ fontSize: "0.875em" }}
                          >
                            {movie.last_production_season.vote_average}
                          </span>
                        )}
                        <small className="text-muted">
                          {" "}
                          {movie?.last_production_season.episode_count} эпизодов
                        </small>
                      </Card.Text>
                      <Card.Body className="px-0">
                        {" "}
                        <Card.Text style={{ fontSize: "0.875em" }}>
                          <BsCheck2Square />
                          &ensp;Последний эпизод сезона вышел&ensp;
                          <nobr>{movie?.last_episode_to_air}</nobr>
                        </Card.Text>
                        <Card.Text style={{ fontSize: "0.875em" }}>
                          <BsCalendar3 />
                          &ensp;
                          {movie?.next_episode_to_air ? (
                            <>
                              Следующий эпизод планируется{" "}
                              <nobr>{movie?.next_episode_to_air}</nobr>
                            </>
                          ) : (
                            "Новые эпизоды не планируются."
                          )}
                        </Card.Text>
                      </Card.Body>
                      <Card.Text className="fs-5 text-center mt-3 text-primary">
                        <Link
                          to={`/tv/${id}/seasons`}
                          className="text-decoration-none"
                        >
                          Все сезоны
                        </Link>
                      </Card.Text>
                    </Card.Body>
                  </Col>
                </Card>
              </Row>
              <Row className="mb-5 mt-4 w-100">
                <h3 className="text-start fw-bold fs-5 ps-0 mb-4">
                  Трейлер <span className="text-body-tertiary">YouTube</span>
                </h3>
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
                      alt={movie.name}
                      className="img-fluid rounded-3"
                    />
                  ) : (
                    <div>Постер не доступен</div>
                  )}
                  <Row className="text-start mt-3 justify-content-center">
                    <h3 className="text-start fw-bold fs-5 mt-5 mb-4 px-0">
                      Трейлер{" "}
                      <span className="text-body-tertiary">YouTube</span>
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
                      {movie?.name}
                      <small className="fw-light">
                        &nbsp;(
                        {movie?.first_air_year || null} -{" "}
                        {movie?.status === "Завершился" ||
                        movie?.status === "Отменён"
                          ? movie?.last_air_year
                          : "..."}
                        )
                      </small>
                    </h1>
                    <h2 className="fs-5 text-md-start text-center text-secondary">
                      {movie?.original_name}
                    </h2>
                  </Row>

                  <Row>
                    <Col md={8}>
                      <Row>
                        {movie?.tagline && (
                          <figure>
                            <VscQuote className="d-flex fs-4" />
                            <blockquote
                              className="fst-italic text-start text-secondary blockquote mt-1 ps-4"
                              style={{ fontSize: "0.9rem" }}
                            >
                              <p>{movie.tagline}</p>
                            </blockquote>
                          </figure>
                        )}
                      </Row>
                      <h3 className="text-start fw-bold fs-5 mb-4">
                        О сериале
                      </h3>
                      <Row className="text-start fs-6 text-secondary">
                        <Col md={5}>
                          <p>
                            <small>Статус</small>
                          </p>
                        </Col>
                        <Col md={7}>
                          <p>
                            <small
                              className={`badge fw-normal ${
                                {
                                  Продолжается: "text-bg-success",
                                  Завершился: "text-bg-danger",
                                  "В производстве": "text-bg-warning",
                                  Запланирован: "text-bg-info",
                                  Отменён: "text-bg-secondary",
                                  "Пилотный выпуск": "text-bg-primary",
                                }[movie?.status] || "text-bg-secondary"
                              }`}
                              style={{ fontSize: "0.875em" }}
                            >
                              {movie?.status || "Неизвестен"}
                            </small>{" "}
                          </p>
                        </Col>
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
                            <small>Первый эпизод</small>
                          </p>
                        </Col>
                        <Col md={7}>
                          <p className="text-black">
                            <small>{movie?.first_air_date || "-"}</small>
                          </p>
                        </Col>
                      </Row>
                      <Row className="text-start fs-6 text-secondary">
                        <Col md={5}>
                          <p>
                            <small>Последний эпизод</small>
                          </p>
                        </Col>
                        <Col md={7}>
                          <p className="text-black">
                            <small>{movie?.last_air_date || "-"}</small>
                          </p>
                        </Col>
                      </Row>
                      <Row className="text-start fs-6 text-secondary">
                        <Col md={5}>
                          <p>
                            <small>Создатель</small>
                          </p>
                        </Col>
                        <Col md={7}>
                          <p className="text-black">
                            <small>{movie?.creator || "-"}</small>{" "}
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
                          <BookmarkStarFill
                            className="me-2"
                            width="26"
                            height="26"
                          />
                        ) : isHovered ? (
                          <BookmarkStar
                            className="me-2"
                            width="26"
                            height="26"
                          />
                        ) : (
                          <Bookmark className="me-2" width="26" height="26" />
                        )}
                        Буду смотреть
                      </button>
                    </Col>
                  </Row>
                  <Row>
                    <hr className="my-4"></hr>
                    <p className="text-start mb-5">
                      {movie?.overview || "Простите, но описания не нашлось."}
                    </p>
                  </Row>
                  {/* Карточка сезон */}
                  <h3 className="text-start fw-bold fs-5 mb-4 mt-5">
                    Текущий сезон
                  </h3>
                  <Card className="border-0 text-start">
                    <Row>
                      <Col md={3}>
                        <Card.Img
                          src={
                            movie?.last_production_season?.season_poster_path
                          }
                          alt="Card image"
                          className="img-fluid"
                        />
                      </Col>
                      <Col md={9} className="d-flex">
                        <Card.Body className="d-flex flex-column justify-content-end rounded bg-body-tertiary ps-5">
                          <Card.Title className="fw-semibold">
                            {movie?.last_production_season?.name}
                          </Card.Title>
                          <Card.Text className="mb-4">
                            {movie?.last_production_season?.vote_average >
                              0 && (
                              <span
                                className="badge fw-semibold text-bg-secondary"
                                style={{ fontSize: "0.875em" }}
                              >
                                {movie.last_production_season?.vote_average}
                              </span>
                            )}
                            <small className="text-muted">
                              {" "}
                              {
                                movie?.last_production_season?.episode_count
                              }{" "}
                              эпизодов
                            </small>
                          </Card.Text>
                          <Card.Text style={{ fontSize: "0.875rem" }}>
                            <BsCheck2Square />
                            &ensp; Последний эпизод сезона вышел{" "}
                            {movie?.last_episode_to_air}
                          </Card.Text>
                          <Card.Text style={{ fontSize: "0.875rem" }}>
                            <BsCalendar3 /> &ensp;
                            {movie?.next_episode_to_air
                              ? `Следующий эпизод планируется ${movie?.next_episode_to_air}`
                              : "Новые эпизоды не планируются."}
                          </Card.Text>
                          <Card.Text className="mt-auto fs-5 text-primary">
                            <Link
                              to={`/tv/${id}/seasons`}
                              className="text-decoration-none"
                            >
                              Все сезоны
                            </Link>
                          </Card.Text>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
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

export default TvDetailsPage;
