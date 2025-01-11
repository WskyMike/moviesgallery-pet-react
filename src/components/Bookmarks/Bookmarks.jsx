/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Container, Row, Col, NavDropdown } from "react-bootstrap";
import MovieCard from "../MovieCarousel/MovieCard/Moviecard";
import SearchForm from "../SearchForm/SearchForm";
import ScrollToTopButton from "../../vendor/ScrollToTopButton/ToTopButton";
import ScrollToEndButton from "../../vendor/ScrollToEndButton/ScrollToEndButton";
import BackwardButton from "../../vendor/BackwardButton/BackwardButton";

import { useAuth } from "../../contexts/AuthContext";
import { useLoading } from "../../contexts/LoadingContext";
import { MovieCardByIdData } from "../../utils/MovieCardByIdApi";
import { TvCardByIdData } from "../../utils/TvCardByIdApi";

import { db } from "../../utils/firebase";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";

function Bookmarks() {
  const { user } = useAuth();
  const [bookmarkedMovies, setBookmarkedMovies] = useState([]);
  const { bookmarksLoading, setBookmarksLoading } = useLoading();
  const [filterType, setFilterType] = useState("all");

  // Запрос данных из Firestore
  const fetchBookmarks = async (type) => {
    if (!user) return;

    setBookmarksLoading(true);
    try {
      // Создаём запрос к Firestore
      let bookmarksQuery = query(
        collection(db, "users", user.uid, "bookmarks"),
        orderBy("timestamp", "asc")
      );

      if (type !== "all") {
        bookmarksQuery = query(
          collection(db, "users", user.uid, "bookmarks"),
          where("mediaType", "==", type),
          orderBy("timestamp", "asc")
        );
      }

      const querySnapshot = await getDocs(bookmarksQuery);
      const bookmarks = querySnapshot.docs.map((doc) => ({
        id: doc.data().itemId,
        mediaType: doc.data().mediaType,
      }));

      // Получаем данные для каждого фильма или сериала
      const items = await Promise.all(
        bookmarks.map((bookmark) =>
          bookmark.mediaType === "movie"
            ? MovieCardByIdData(bookmark.id)
            : TvCardByIdData(bookmark.id)
        )
      );

      setBookmarkedMovies(items);
    } catch (error) {
      console.error("Ошибка при загрузке закладок:", error);
    } finally {
      setBookmarksLoading(false);
    }
  };

  // Обновляем закладки при изменении фильтра
  useEffect(() => {
    fetchBookmarks(filterType);
  }, [filterType]);

  return (
    <>
      <Container fluid="xxl">
        <ScrollToTopButton />
        <ScrollToEndButton />
        <BackwardButton />
        <SearchForm />
        <Container fluid="xl">
          <Row className="pt-2 sticky-header d-flex justify-content-between align-items-center">
            <Col xs="auto">
              <h2 className="text-start display-5">Буду смотреть</h2>
            </Col>
            {!bookmarksLoading && bookmarkedMovies.length > 0 && (
              <Col xs="auto" className="ms-md-3">
                <NavDropdown
                  id="filter-dropdown"
                  title={
                    filterType === "all"
                      ? "Тип контента "
                      : filterType === "movie"
                      ? "Фильмы "
                      : "Сериалы "
                  }
                  variant="light"
                  className="movie-list__dropdown-button"
                  onSelect={(selectedKey) => setFilterType(selectedKey)}
                >
                  <div className="movie-list__custom-scroll">
                    <NavDropdown.Item eventKey="all">Все</NavDropdown.Item>
                    <NavDropdown.Item eventKey="movie" className="fw-light">
                      Фильмы
                    </NavDropdown.Item>
                    <NavDropdown.Item eventKey="tv" className="fw-light">
                      Сериалы
                    </NavDropdown.Item>
                  </div>
                </NavDropdown>
              </Col>
            )}
          </Row>
          <Row className="mb-2 mb-md-5 mt-4">
            {bookmarksLoading ? (
              <Col className="text-center">
                <div className="spinner-border text-primary m-5" role="status">
                  <span className="visually-hidden">Загрузка...</span>
                </div>
              </Col>
            ) : bookmarkedMovies.length > 0 ? (
              bookmarkedMovies.map((movie) => (
                <Col
                  xs={6}
                  sm={4}
                  md={4}
                  lg={3}
                  className="mb-4 px-1 px-sm-2"
                  key={movie.id}
                >
                  <MovieCard movie={movie} isLoading={false} />
                </Col>
              ))
            ) : (
              <Col
                className="text-center"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <p className="mt-5 fs-5 fw-bold">У вас ещё нет закладок.</p>
                <p className="text-muted mt-5 fs-6">
                  Добавьте{" "}
                  <a
                    href="http://localhost:5173/list/popular"
                    className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                  >
                    фильмы
                  </a>{" "}
                  или{" "}
                  <a
                    href="http://localhost:5173/list/popularTv"
                    className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                  >
                    сериалы
                  </a>
                  , которые хотите посмотреть.
                </p>
              </Col>
            )}
          </Row>
        </Container>
      </Container>
    </>
  );
}

export default Bookmarks;
