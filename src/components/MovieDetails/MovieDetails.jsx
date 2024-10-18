/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLoading } from "../../contexts/LoadingContext";

import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastProvider";

// Firebase
import { db } from "../../utils/firebase";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";

import { movieDetailsData } from "../../utils/MovieDetailApi";
import { creditsMovieData } from "../../utils/CreditsMovieApi";
import { videosData } from "../../utils/VideosApi";
import ActorsCarousel from "../ActorsCarousel/ActorsCarousel";

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
      const fetchBookmarkStatus = async () => {
        try {
          const docRef = doc(db, "users", user.uid, "bookmarks", String(id));
          const docSnap = await getDoc(docRef);
          setIsBookmarked(docSnap.exists());
        } catch (err) {
          setError(err.message);
          triggerToast(
            `Error fetching bookmark(${err.message})`,
            "danger-subtle",
            "danger-emphasis"
          );
        }
      };
      fetchBookmarkStatus();
    }
  }, [user, id]);

  // Добавление или удаление фильма из закладок
  const handleBookmarkClick = async () => {
    if (!user) {
      triggerToast(
        "Необходимо войти в аккаунт",
        "info-subtle",
        "info-emphasis",
        "top-center"
      );
      return;
    }

    if (!authLoading && user) {
      const docRef = doc(db, "users", user.uid, "bookmarks", String(id));
      try {
        if (isBookmarked) {
          await deleteDoc(docRef);
          setIsBookmarked(false);
          triggerToast(
            "Удалили фильм",
            "info-subtle",
            "info-emphasis",
            "top-center"
          );
        } else {
          await setDoc(docRef, { movieId: id });
          setIsBookmarked(true);
          triggerToast(
            "Сохранили фильм",
            "info-subtle",
            "info-emphasis",
            "top-center"
          );
        }
      } catch (err) {
        setError(err.message);
        triggerToast("Ошибка сохранения фильма", "danger-subtle", "black");
      }
    }
  };

  useEffect(() => {
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
      <section className="moviedetails-backdrop pt-5 pb-5">
        <Container fluid="xl">
          <Row className="gx-5 mb-5">
            <Col md={4}>
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
                <h3 className="text-start fw-semibold fs-5 my-4">Трейлер</h3>
                {loadingTrailer ? (
                  <div className="spinner-border text-dark m-5" role="status">
                    <span className="visually-hidden">Загрузка...</span>
                  </div>
                ) : videoKeys.length > 0 ? (
                  videoKeys.map((key) => (
                    <iframe
                      key={key}
                      src={`https://youtube.com/embed/${key}?rel=0`}
                      title="Video Trailer"
                      allowFullScreen
                      // loading="lazy"
                      // width="560"
                      height="200vh"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    ></iframe>
                  ))
                ) : (
                  <p>Ничего нет &#128532;</p>
                )}
              </Row>
            </Col>
            <Col md={8}>
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
                  <Row className="text-start fs-6">
                    <Col md>
                      <small>
                        {movie?.tagline && (
                          <blockquote className="fst-italic text-start">
                            {movie.tagline}
                          </blockquote>
                        )}
                      </small>
                    </Col>
                  </Row>
                  <Row className="text-start fs-6 text-secondary">
                    <Col md={4}>
                      <p>
                        <small>Жанр</small>
                      </p>
                    </Col>
                    <Col md={8}>
                      <p className="text-black">
                        <small>{movie?.genres.join(", ") || "-"}</small>
                      </p>
                    </Col>
                  </Row>
                  <Row className="text-start fs-6 text-secondary">
                    <Col md={4}>
                      <p>
                        <small>Продолжительность</small>
                      </p>
                    </Col>
                    <Col md={8}>
                      <p className="text-black">
                        <small>{movie?.runtime || "-"}</small>
                      </p>
                    </Col>
                  </Row>
                  <Row className="text-start fs-6 text-secondary">
                    <Col md={4}>
                      <p>
                        <small>Страна</small>
                      </p>
                    </Col>
                    <Col md={8}>
                      <p className="text-black">
                        <small>{movie?.production_countries || "-"}</small>
                      </p>
                    </Col>
                  </Row>
                  <Row className="text-start fs-6 text-secondary">
                    <Col md={4}>
                      <p>
                        <small>Оригинальный язык</small>
                      </p>
                    </Col>
                    <Col md={8}>
                      <p className="text-black">
                        <small>{movie?.original_language || "-"}</small>
                      </p>
                    </Col>
                  </Row>
                  <Row className="text-start fs-6 text-secondary">
                    <Col md={4}>
                      <p>
                        <small>Дата выхода</small>
                      </p>
                    </Col>
                    <Col md={8}>
                      <p className="text-black">
                        <small>{movie?.release_date || "-"}</small>
                      </p>
                    </Col>
                  </Row>
                  <Row className="text-start fs-6 text-secondary">
                    <Col md={4}>
                      <p>
                        <small>Режиссер</small>
                      </p>
                    </Col>
                    <Col md={8}>
                      <p className="text-black">
                        <small>{credits?.directors || "-"}</small>{" "}
                      </p>
                    </Col>
                  </Row>
                  <Row className="text-start fs-6 text-secondary">
                    <Col md={4}>
                      <p>
                        <small>Кинокомпания</small>
                      </p>
                    </Col>
                    <Col md={8}>
                      <p className="text-black">
                        <small>{movie?.production_companies || "-"}</small>
                      </p>
                    </Col>
                  </Row>
                  <Row className="text-start fs-6 text-secondary">
                    <Col md={4}>
                      <p>
                        <small>Бюджет</small>
                      </p>
                    </Col>
                    <Col md={8}>
                      <p className="text-black">
                        <small>{movie?.budget || "-"}</small>
                      </p>
                    </Col>
                  </Row>
                  <Row className="text-start fs-6 text-secondary">
                    <Col md={4}>
                      <p>
                        <small>Сборы в мире</small>
                      </p>
                    </Col>
                    <Col md={8}>
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
                      <Icon.Bookmark className="me-2" width="26" height="26" />
                    )}
                    Буду смотреть
                  </button>
                </Col>
              </Row>
              <Row>
                <hr className="my-4"></hr>
                <p className="text-start">
                  {movie?.overview || "Простите, но описания нет."}
                </p>
              </Row>
            </Col>
          </Row>
          <ActorsCarousel />
        </Container>
      </section>
    </>
  );
}

export default MovieDetailsPage;
