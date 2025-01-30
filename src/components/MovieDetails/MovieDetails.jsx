/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Row, Col, Image } from "react-bootstrap";
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
import SearchForm from "../SearchForm/SearchForm";
import RecommendationsCarousel from "./RecommendationsCarousel/RecommendationsCarousel";
import "./MovieDetails.css";
import {
  Bookmark,
  BookmarkStar,
  BookmarkStarFill,
} from "react-bootstrap-icons";
import { VscQuote } from "react-icons/vsc";
import { ImYoutube2 } from "react-icons/im";
import NotFoundVideoImg from "../../images/pixeltrue-seo.svg";
import CustomGradientButton from "../CustomButton/CustomGradientButton";

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
  const { user, authLoading } = useAuth(); // Проверка на авторизацию
  const [isBookmarked, setIsBookmarked] = useState(false); // Проверка на наличие фильма в закладках
  const isMobile = useMobileLayout(); // Проверка на мобильное устройство
  const [showButton, setShowButton] = useState(false); // Показывать кнопку с линком на главную страницу

  useEffect(() => {
    // Устанавливаем title в зависимости от названия фильма
    document.title = movie?.title
      ? movie.original_title && movie.title !== movie.original_title
        ? `${movie.title} • ${movie.original_title}`
        : movie.title
      : "Киногалерея";

    return () => {
      document.title = "Киногалерея";
    };
  }, [movie]);

  // Фильм
  async function fetchMovieDetails() {
    try {
      const data = await movieDetailsData(id);
      // Устанавливаем переменную CSS для фонового изображения
      // document.documentElement.style.setProperty(
      //   "--backdrop-url",
      //   `url(${data.backdrop})`
      // );
      setMovie(data);
    } catch (err) {
      setError(err.message);
      triggerToast(
        `Ошибка запроса данных (${err.message})`,
        "danger-subtle",
        "danger-emphasis"
      );
    } finally {
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
        `Ошибка запроса данных трейлера (${err.message})`,
        "danger-subtle",
        "danger-emphasis"
      );
    }
  }

  // Проверка, есть ли фильм в закладках
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

  // Добавление или удаление фильма из закладок
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
    fetchMovieDetails();
    fetchCredits();
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
      <section className="moviedetails-backdrop pt-1 pb-5 px-sm-4 px-md-5">
        <Container fluid="xl">
          {/* Мобильная версия */}
          {isMobile ? (
            <div className="d-flex align-items-center justify-content-center flex-column px-1">
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
                <h3 className="text-start fw-bold fs-5 mb-4">О фильме</h3>
                <Row className="text-start fs-6 text-secondary pe-0">
                  <Col xs={6} className="pe-0">
                    <p>
                      <small>Оригинальный язык</small>
                    </p>
                  </Col>
                  <Col xs={6} className="pe-0">
                    <p className="text-black text-end">
                      <small>{movie?.original_language || "-"}</small>
                    </p>
                  </Col>
                </Row>
                <Row className="text-start fs-6 text-secondary pe-0">
                  <Col xs={6} className="pe-0">
                    <p>
                      <small>Дата выхода</small>
                    </p>
                  </Col>
                  <Col xs={6} className="pe-0">
                    <p className="text-black text-end">
                      <small>{movie?.release_date || "-"}</small>
                    </p>
                  </Col>
                </Row>
                <Row className="text-start fs-6 text-secondary pe-0">
                  <Col xs={6} className="pe-0">
                    <p>
                      <small>Режиссер</small>
                    </p>
                  </Col>
                  <Col xs={6} className="pe-0">
                    <p className="text-black text-end">
                      <small>{credits?.directors || "-"}</small>{" "}
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
                      <small>{movie?.production_companies || "-"}</small>
                    </p>
                  </Col>
                </Row>
                <Row className="text-start fs-6 text-secondary pe-0">
                  <Col xs={6} className="pe-0">
                    <p>
                      <small>Бюджет</small>
                    </p>
                  </Col>
                  <Col xs={6} className="pe-0">
                    <p className="text-black text-end">
                      <small>{movie?.budget || "-"}</small>
                    </p>
                  </Col>
                </Row>
                <Row className="text-start fs-6 text-secondary pe-0">
                  <Col xs={6} className="pe-0">
                    <p>
                      <small>Сборы в мире</small>
                    </p>
                  </Col>
                  <Col xs={6} className="pe-0">
                    <p className="text-black text-end">
                      <small>{movie?.revenue || "-"}</small>
                    </p>
                  </Col>
                </Row>
                <Row className="m-0 d-flex justify-content-center">
                  <hr className="my-4"></hr>
                  <div className="moviedetails__overview px-0">
                    {" "}
                    <small className="text-start p-0">
                      {movie?.overview || (
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
                  {movie?.poster ? (
                    <img
                      src={movie.poster}
                      alt={movie.title || movie.name}
                      className="img-fluid rounded-3"
                    />
                  ) : (
                    <div>Постер не доступен</div>
                  )}
                  <Row className="text-start mt-3">
                    <h3 className="d-flex align-items-center gap-2 mt-5 mb-2 px-0 fw-bold fs-5  ">
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
                      <h3 className="text-start fw-bold fs-5 mb-4  ">
                        О фильме
                      </h3>
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
                    <div className="moviedetails__overview">
                      <p className="text-start">
                        {movie?.overview || (
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
                </Col>
              </Row>
            </div>
          )}
          <Row className="mx-0 px-0 mt-5 pb-4 mt-lg-5">
            <h3 className="text-start fw-bold fs-5 ps-0 mb-4">
              В главных ролях
            </h3>
            <ActorsCarousel />
          </Row>
          <Row className="mx-0 px-0 mt-5 mt-lg-5">
            <h3 className="text-start fw-bold fs-5 ps-0 mb-3">
              Рекомендуемые фильмы
            </h3>
            <RecommendationsCarousel />
          </Row>
        </Container>
      </section>
    </>
  );
}

export default MovieDetailsPage;
