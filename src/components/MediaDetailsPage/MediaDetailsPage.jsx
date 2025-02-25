/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Row, Col, Image, Card } from "react-bootstrap";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLoading } from "../../contexts/LoadingContext";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastProvider";
import { toggleBookmark, checkBookmarkStatus } from "../../utils/BookmarkUtils";
import { movieDetailsData } from "../../utils/MovieDetailApi";
import { creditsMovieData } from "../../utils/CreditsMovieApi";
import { videosData } from "../../utils/VideosApi";
import { tvDetailsData } from "../../utils/TvDetailApi";
import { tvVideosData } from "../../utils/TvVideosApi";
import ActorsCarousel from "../ActorsCarousel/ActorsCarousel";
import useMobileLayout from "../../hooks/useMobileLayout";
import SearchForm from "../SearchForm/SearchForm";
import RecommendationsCarousel from "../MediaDetailspage/RecommendationsCarousel/RecommendationsCarousel";
import "./MediaDetailsPage.css";
import {
  Bookmark,
  BookmarkStar,
  BookmarkStarFill,
} from "react-bootstrap-icons";
import { VscQuote } from "react-icons/vsc";
import { ImYoutube2 } from "react-icons/im";
import { BsCalendar3, BsCheck2Square } from "react-icons/bs";
import NotFoundVideoImg from "../../images/pixeltrue-seo.svg";
import CustomGradientButton from "../CustomButton/CustomGradientButton";

function MediaDetailsPage({ type }) {
  const { id } = useParams();
  const { triggerToast } = useToast();
  const { user, authLoading } = useAuth();
  const isMobile = useMobileLayout();
  const { movieDetailsLoading, setMovieDetailsLoading } = useLoading();
  const [media, setMedia] = useState(null);
  const [movieDirector, setMovieDirector] = useState({
    directors: "",
  });
  const [videoKeys, setVideoKeys] = useState([]);
  const [error, setError] = useState(null);
  const [loadingTrailer, setLoadingTrailer] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // Функция установки title страницы
  function setDocumentTitle(media) {
    if (media) {
      const title = media?.title || media?.name;
      const originalTitle = media?.original_title || media?.original_name;
      document.title = title
        ? originalTitle && title !== originalTitle
          ? `${title} • ${originalTitle}`
          : title
        : "Киногалерея";
    } else {
      document.title = "Киногалерея";
    }
  }

  // Функция установки мета-тега description
  const defaultDescription =
    "Популярные новинки, рейтинги лучших картин и актуальные премьеры. Присоединяйтесь и создавайте персональные подборки любимого кино.";

  function setMetaDescription(media) {
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        media?.overview || defaultDescription
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = media?.overview || defaultDescription;
      document.head.appendChild(meta);
    }
  }

  useEffect(() => {
    setDocumentTitle(media);
    setMetaDescription(media);
    return () => {
      document.title = "Киногалерея";
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute("content", defaultDescription);
      }
    };
  }, [media]);

  // Запрос API в зависимости от типа контента
  const fetchMediaDetails = async () => {
    try {
      const data =
        type === "movie" ? await movieDetailsData(id) : await tvDetailsData(id);
      setMedia(data);
      if (type === "movie") {
        const movieDirectorsData = await creditsMovieData(id);
        setMovieDirector(movieDirectorsData);
      }
    } catch (err) {
      setError(err.message);
      triggerToast(
        `Ошибка загрузки данных (${err.message})`,
        "danger-subtle",
        "danger-emphasis"
      );
    } finally {
      setMovieDetailsLoading(false);
    }
  };

  // Заропс видео-трейлера
  const fetchVideos = async () => {
    try {
      const keys =
        type === "movie" ? await videosData(id) : await tvVideosData(id);
      setVideoKeys(keys);
      setLoadingTrailer(false);
    } catch (err) {
      setError(err.message);
      triggerToast(
        `Ошибка загрузки видео-трейлера (${err.message})`,
        "danger-subtle",
        "danger-emphasis"
      );
    }
  };

  // Проверяем, есть ли фильм/сериал в закладках
  useEffect(() => {
    if (user && id && media?.media_type) {
      checkBookmarkStatus({
        userId: user.uid,
        itemId: id,
        mediaType: media.media_type,
        setIsBookmarked,
        triggerToast,
      });
    }
  }, [user, id, media?.media_type, triggerToast]);

  // Добавление или удаление из закладок
  const handleBookmarkClick = () => {
    if (authLoading || !user) {
      triggerToast("Необходимо войти в аккаунт");
      return;
    }

    toggleBookmark({
      userId: user.uid,
      itemId: id,
      mediaType: media.media_type,
      isBookmarked,
      setIsBookmarked,
      triggerToast,
    });
  };

  useEffect(() => {
    setMovieDetailsLoading(true);
    window.scrollTo(0, 0);
    fetchMediaDetails();
    fetchVideos();
  }, [id]);

  // Показываем кнопку только при переходе с других сайтов
  useEffect(() => {
    const referrer = document.referrer;
    if (!referrer || !referrer.startsWith(window.location.origin)) {
      setShowButton(true);
    }
  }, []);

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
      <SearchForm />
      <section className="mediadetails-backdrop pt-1 pb-5 px-sm-4 px-md-5">
        <Container fluid="xl">
          {/* Мобильная версия */}
          {isMobile ? (
            <div className="d-flex align-items-center justify-content-center flex-column px-1">
              <Col xs={8} sm={6} className="mb-4">
                {media?.poster ? (
                  <img
                    src={media.poster}
                    alt={media.title || media.name}
                    className="img-fluid rounded-3"
                  />
                ) : (
                  <div>Постер не доступен</div>
                )}
              </Col>
              <Row className="mb-2">
                <h1 className="mb-1 fs-2 text-center fw-bold">
                  {media?.title || media?.name}
                </h1>
                <h2 className="fs-4 text-center fw-light">
                  <small>{media?.original_title || media?.original_name}</small>
                </h2>
              </Row>
              <Row className="mb-5 mx-2">
                <div>
                  <small className="text-secondary">
                    {type === "movie"
                      ? media?.release_year || "-"
                      : `${media?.first_air_year || null} - ${
                          media?.status === "Завершился" ||
                          media?.status === "Отменён"
                            ? media?.last_air_year
                            : "н.в."
                        }`}
                    &nbsp;
                    <br />
                    {media?.genres.join(", ") || "-"}
                  </small>
                </div>
                <div>
                  <small className="text-secondary">
                    {media?.production_countries}
                    {(type === "movie" && media?.runtime) ||
                    (type === "tv" && media?.episode_run_time)
                      ? `, ${media?.runtime || media?.episode_run_time}`
                      : ""}
                  </small>
                </div>
              </Row>
              <Row className="mb-5 mt-3 align-items-center w-100">
                <Col xs={6} className="text-center">
                  <div className="text-secondary">Рейтинг TMDB:</div>
                  <div className="fw-bold display-5">
                    {media?.rating || "-"}{" "}
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
                  {media?.tagline && (
                    <figure className="mb-4">
                      <VscQuote className="d-flex fs-4" />
                      <blockquote
                        className="fst-italic text-start text-secondary blockquote mt-1 ps-4"
                        style={{ fontSize: "0.9rem" }}
                      >
                        <p>{media.tagline}</p>
                      </blockquote>
                    </figure>
                  )}
                </Row>
                <h3 className="text-start fw-bold fs-5 mb-4">
                  {type === "movie" ? "О фильме" : "О сериале"}
                </h3>
                {type === "tv" && media?.status && (
                  <Row className="text-start fs-6 text-secondary pe-0">
                    <Col xs={6} className="pe-0">
                      <p>
                        <small>Статус</small>
                      </p>
                    </Col>
                    <Col xs={6} className="pe-0">
                      <p className="text-black text-end">
                        <small
                          className={`badge fw-normal ${
                            {
                              Продолжается: "text-bg-success",
                              Завершился: "text-bg-danger",
                              "В производстве": "text-bg-warning",
                              Запланирован: "text-bg-info",
                              Отменён: "text-bg-secondary",
                              "Пилотный выпуск": "text-bg-primary",
                            }[media?.status] || "text-bg-secondary"
                          }`}
                          style={{ fontSize: "0.875em" }}
                        >
                          {media?.status || "Неизвестен"}
                        </small>
                      </p>
                    </Col>
                  </Row>
                )}
                <Row className="text-start fs-6 text-secondary pe-0">
                  <Col xs={6} className="pe-0">
                    <p>
                      <small>Оригинальный язык</small>
                    </p>
                  </Col>
                  <Col xs={6} className="pe-0">
                    <p className="text-black text-end">
                      <small>{media?.original_language || "-"}</small>
                    </p>
                  </Col>
                </Row>
                <Row className="text-start fs-6 text-secondary pe-0">
                  <Col xs={6} className="pe-0">
                    <p>
                      <small>
                        {type === "movie" ? "Дата выхода" : "Первый эпизод"}
                      </small>
                    </p>
                  </Col>
                  <Col xs={6} className="pe-0">
                    <p className="text-black text-end">
                      <small>
                        {type === "movie"
                          ? media?.release_date || "-"
                          : media?.first_air_date || "-"}
                      </small>
                    </p>
                  </Col>
                </Row>
                {type === "tv" && media?.last_air_date && (
                  <Row className="text-start fs-6 text-secondary pe-0">
                    <Col xs={6} className="pe-0">
                      <p>
                        <small>Последний эпизод</small>
                      </p>
                    </Col>
                    <Col xs={6} className="pe-0">
                      <p className="text-black text-end">
                        <small>{media?.last_air_date || "-"}</small>
                      </p>
                    </Col>
                  </Row>
                )}
                <Row className="text-start fs-6 text-secondary pe-0">
                  <Col xs={6} className="pe-0">
                    <p>
                      <small>
                        {type === "movie" ? "Режиссер" : "Создатель"}
                      </small>
                    </p>
                  </Col>
                  <Col xs={6} className="pe-0">
                    <p className="text-black text-end">
                      <small>
                        {movieDirector?.directors || media?.creator || "-"}
                      </small>{" "}
                    </p>
                  </Col>
                </Row>
                <Row className="text-start fs-6 text-secondary pe-0">
                  <Col xs={6} className="pe-0">
                    <p>
                      <small>Кинокомпания</small>
                    </p>
                  </Col>
                  <Col xs={6} className="pe-0">
                    <p className="text-black text-end">
                      <small>{media?.production_companies || "-"}</small>
                    </p>
                  </Col>
                </Row>
                {type === "movie" && media?.budget && (
                  <Row className="text-start fs-6 text-secondary pe-0">
                    <Col xs={6} className="pe-0">
                      <p>
                        <small>Бюджет</small>
                      </p>
                    </Col>
                    <Col xs={6} className="pe-0">
                      <p className="text-black text-end">
                        <small>{media?.budget}</small>
                      </p>
                    </Col>
                  </Row>
                )}
                {type === "movie" && media?.revenue && (
                  <Row className="text-start fs-6 text-secondary pe-0">
                    <Col xs={6} className="pe-0">
                      <p>
                        <small>Сборы в мире</small>
                      </p>
                    </Col>
                    <Col xs={6} className="pe-0">
                      <p className="text-black text-end">
                        <small>{media?.revenue}</small>
                      </p>
                    </Col>
                  </Row>
                )}
                <Row className="m-0 d-flex justify-content-center">
                  <hr className="my-4"></hr>
                  <div className="mediadetails__overview px-0">
                    {" "}
                    <small className="text-start p-0">
                      {media?.overview || (
                        <p className="text-center pb-5 mb-0">
                          Нет описания, переведённого на русский язык.
                        </p>
                      )}
                    </small>
                  </div>
                  {showButton && (
                    <Row>
                      <CustomGradientButton />
                    </Row>
                  )}
                </Row>
                {type === "tv" && media?.last_production_season && (
                  <Row className="text-start mx-0 mb-5 mt-2">
                    <h3 className=" fw-bold fs-5 mb-4 mt-3 px-0">
                      Текущий сезон
                    </h3>
                    <Card className="border-0 bg-light text-start px-0">
                      <Col className="d-flex">
                        <Card.Body className="d-flex flex-column justify-content-start">
                          <Card.Title className="fw-semibold">
                            {media?.last_production_season.name}{" "}
                          </Card.Title>
                          <Card.Text className="mb-2">
                            {media?.last_production_season.vote_average > 0 && (
                              <span
                                className="badge fw-semibold text-bg-secondary"
                                style={{ fontSize: "0.875em" }}
                              >
                                {media.last_production_season.vote_average}
                              </span>
                            )}
                            <small className="text-muted">
                              {" "}
                              {media?.last_production_season.episode_count}{" "}
                              эпизодов
                            </small>
                          </Card.Text>
                          <Card.Body className="px-0">
                            {" "}
                            <Card.Text style={{ fontSize: "0.875em" }}>
                              <BsCheck2Square />
                              &ensp;Последний эпизод сезона вышел&ensp;
                              <nobr>{media?.last_episode_to_air}</nobr>
                            </Card.Text>
                            <Card.Text style={{ fontSize: "0.875em" }}>
                              <BsCalendar3 />
                              &ensp;
                              {media?.next_episode_to_air ? (
                                <>
                                  Следующий эпизод планируется{" "}
                                  <nobr>{media?.next_episode_to_air}</nobr>
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
                )}
              </Row>
              <Row className="mb-3 mt-4 w-100">
                <h3 className="d-flex align-items-center gap-2 fw-bold fs-5 ps-0 mb-3">
                  Трейлер <ImYoutube2 className="display-1 text-secondary" />{" "}
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
                  <>
                    <div className="ratio ratio-4x3 d-flex justify-content-center align-items-center">
                      <Image
                        src={NotFoundVideoImg}
                        alt="Трейлер не найден"
                        fluid
                      ></Image>
                    </div>
                    <span className="text-center text-secondary ">
                      Видео не найдено
                    </span>
                  </>
                )}
              </Row>
            </div>
          ) : (
            <div>
              {/* Десктопная версия */}
              <Row className="gx-5 pb-4 justify-content-center">
                <Col lg={4}>
                  {media?.poster ? (
                    <img
                      src={media.poster}
                      alt={media.title || media.name}
                      className="img-fluid rounded-3"
                    />
                  ) : (
                    <div>Постер не доступен</div>
                  )}
                  <Row className="text-start mt-3">
                    <h3 className="d-flex align-items-center gap-2 mt-5 mb-2 px-0 fw-bold fs-5">
                      Трейлер{" "}
                      <ImYoutube2 className="display-4 text-secondary" />
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
                      <>
                        <div className="ratio ratio-4x3 d-flex justify-content-center align-items-center">
                          <Image
                            src={NotFoundVideoImg}
                            alt="Трейлер не найден"
                            fluid
                          ></Image>
                        </div>
                        <span className="text-center text-secondary ">
                          Видео не найдено
                        </span>
                      </>
                    )}
                  </Row>
                </Col>
                <Col lg={8} className="px-5 px-lg-4">
                  <Row className="mb-5">
                    <h1 className="fs-2 text-md-start text-center fw-bold">
                      {media?.title || media?.name}
                      <small className="fw-light">
                        &nbsp;(
                        {type === "movie"
                          ? media?.release_year || "-"
                          : `${media?.first_air_year || null} - ${
                              media?.status === "Завершился" ||
                              media?.status === "Отменён"
                                ? media?.last_air_year
                                : "..."
                            }`}
                        )
                      </small>
                    </h1>
                    <h2 className="fs-5 text-md-start text-center text-secondary">
                      {media?.original_title || media?.original_name}
                    </h2>
                  </Row>

                  <Row>
                    <Col md={8}>
                      <Row>
                        {media?.tagline && (
                          <figure>
                            <VscQuote className="d-flex fs-4" />
                            <blockquote
                              className="fst-italic text-start text-secondary blockquote mt-1 ps-4"
                              style={{ fontSize: "0.9rem" }}
                            >
                              <p>{media.tagline}</p>
                            </blockquote>
                          </figure>
                        )}
                      </Row>
                      <h3 className="text-start fw-bold fs-5 mb-4">
                        {type === "movie" ? "О фильме" : "О сериале"}
                      </h3>
                      <Row className="text-start fs-6 text-secondary">
                        {type === "tv" && (
                          <>
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
                                    }[media?.status] || "text-bg-secondary"
                                  }`}
                                  style={{ fontSize: "0.875em" }}
                                >
                                  {media?.status || "Неизвестен"}
                                </small>
                              </p>
                            </Col>
                          </>
                        )}
                      </Row>
                      <Row className="text-start fs-6 text-secondary">
                        <Col md={5}>
                          <p>
                            <small>Жанр</small>
                          </p>
                        </Col>
                        <Col md={7}>
                          <p className="text-black">
                            <small>{media?.genres.join(", ") || "-"}</small>
                          </p>
                        </Col>
                      </Row>
                      {(media?.runtime || media?.episode_run_time) && (
                        <Row className="text-start fs-6 text-secondary">
                          <Col md={5}>
                            <p>
                              <small>Продолжительность</small>
                            </p>
                          </Col>
                          <Col md={7}>
                            <p className="text-black">
                              <small>
                                {media?.runtime || media?.episode_run_time}
                              </small>
                            </p>
                          </Col>
                        </Row>
                      )}
                      <Row className="text-start fs-6 text-secondary">
                        <Col md={5}>
                          <p>
                            <small>Страна</small>
                          </p>
                        </Col>
                        <Col md={7}>
                          <p className="text-black">
                            <small>{media?.production_countries || "-"}</small>
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
                            <small>{media?.original_language || "-"}</small>
                          </p>
                        </Col>
                      </Row>
                      <Row className="text-start fs-6 text-secondary">
                        <Col md={5}>
                          <p>
                            <small>
                              {type === "movie"
                                ? "Дата выхода"
                                : "Первый эпизод"}
                            </small>
                          </p>
                        </Col>
                        <Col md={7}>
                          <p className="text-black">
                            <small>
                              {type === "movie"
                                ? media?.release_date || "-"
                                : media?.first_air_date || "-"}
                            </small>
                          </p>
                        </Col>
                      </Row>
                      {type === "tv" && media?.last_air_date && (
                        <Row className="text-start fs-6 text-secondary">
                          <Col md={5}>
                            <p>
                              <small>Последний эпизод</small>
                            </p>
                          </Col>
                          <Col md={7}>
                            <p className="text-black">
                              <small>{media?.last_air_date || "-"}</small>
                            </p>
                          </Col>
                        </Row>
                      )}
                      <Row className="text-start fs-6 text-secondary">
                        <Col md={5}>
                          <p>
                            <small>
                              {type === "movie" ? "Режиссер" : "Создатель"}
                            </small>
                          </p>
                        </Col>
                        <Col md={7}>
                          <p className="text-black">
                            <small>
                              {movieDirector?.directors ||
                                media?.creator ||
                                "-"}
                            </small>{" "}
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
                            <small>{media?.production_companies || "-"}</small>
                          </p>
                        </Col>
                      </Row>

                      {type === "movie" && media?.budget && (
                        <Row className="text-start fs-6 text-secondary">
                          <Col md={5}>
                            <p>
                              <small>Бюджет</small>
                            </p>
                          </Col>
                          <Col md={7}>
                            <p className="text-black">
                              <small>{media?.budget}</small>
                            </p>
                          </Col>
                        </Row>
                      )}
                      {type === "movie" && media?.revenue && (
                        <Row className="text-start fs-6 text-secondary">
                          <Col md={5}>
                            <p>
                              <small>Сборы в мире</small>
                            </p>
                          </Col>
                          <Col md={7}>
                            <p className="text-black">
                              <small>{media?.revenue}</small>
                            </p>
                          </Col>
                        </Row>
                      )}
                    </Col>
                    <Col md={4}>
                      <div className="text-secondary">Рейтинг TMDB:</div>
                      <div className="fw-bold display-5">
                        {media?.rating || "-"}{" "}
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
                  <Row className="pb-3">
                    <hr className="my-4"></hr>
                    <div className="mediadetails__overview">
                      <p className="text-start">
                        {media?.overview || (
                          <p className="text-center pb-5 mb-0">
                            Нет описания, переведённого на русский язык.
                          </p>
                        )}
                      </p>
                    </div>
                    {showButton && (
                      <Row>
                        <CustomGradientButton />
                      </Row>
                    )}
                  </Row>
                  {type === "tv" && media?.last_production_season && (
                    <>
                      <h3 className="text-start fw-bold fs-5 mb-4 mt-5">
                        Текущий сезон
                      </h3>
                      <Card className="border-0 text-start">
                        <Row>
                          <Col md={3}>
                            <Card.Img
                              src={
                                media?.last_production_season
                                  ?.season_poster_path || ""
                              }
                              alt="Card image"
                              className="img-fluid"
                            />
                          </Col>
                          <Col md={9} className="d-flex">
                            <Card.Body className="d-flex flex-column justify-content-end rounded bg-body-tertiary ps-5">
                              <Card.Title className="fw-semibold">
                                {media?.last_production_season?.name || "-"}
                              </Card.Title>
                              <Card.Text className="mb-4">
                                {media?.last_production_season?.vote_average >
                                  0 && (
                                  <span
                                    className="badge fw-semibold text-bg-secondary"
                                    style={{ fontSize: "0.875em" }}
                                  >
                                    {
                                      media?.last_production_season
                                        ?.vote_average
                                    }
                                  </span>
                                )}
                                <small className="text-muted">
                                  {" "}
                                  {media?.last_production_season
                                    ?.episode_count || "-"}{" "}
                                  эпизодов
                                </small>
                              </Card.Text>
                              <Card.Text style={{ fontSize: "0.875rem" }}>
                                <BsCheck2Square />
                                &ensp; Последний эпизод сезона вышел{" "}
                                {media?.last_episode_to_air || "-"}
                              </Card.Text>
                              <Card.Text style={{ fontSize: "0.875rem" }}>
                                <BsCalendar3 /> &ensp;
                                {media?.next_episode_to_air
                                  ? `Следующий эпизод планируется ${media?.next_episode_to_air}`
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
                    </>
                  )}
                </Col>
              </Row>
            </div>
          )}
          <div className="d-none media-content-loaded"></div>
          <Row className="mx-0 px-0 mt-5 pb-4 mt-lg-5">
            <h3 className="text-start fw-bold fs-5 ps-0 mb-4">
              Актёрский состав
            </h3>
            <ActorsCarousel />
          </Row>
          <Row className="mx-0 px-0 mt-5 mt-lg-5">
            <h3 className="text-start fw-bold fs-5 ps-0 mb-3">
              Рекомендуемые {type === "movie" ? "фильмы" : "сериалы"}
            </h3>
            <RecommendationsCarousel />
          </Row>
        </Container>
      </section>
    </>
  );
}

MediaDetailsPage.propTypes = {
  type: PropTypes.string.isRequired,
};

export default MediaDetailsPage;
