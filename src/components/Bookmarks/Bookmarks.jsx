/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import MovieCard from "../MovieCard/Moviecard";
// import placeholder from "../../images/mesh-gradient.webp";
import SearchForm from "../SearchForm/SearchForm";
import ScrollToTopButton from "../../vendor/ScrollToTopButton/ToTopButton";
import ScrollToEndButton from "../../vendor/ScrollToEndButton/ScrollToEndButton";
import BackwardButton from "../../vendor/BackwardButton/BackwardButton";

import { useAuth } from "../../contexts/AuthContext";
import { useLoading } from "../../contexts/LoadingContext";
import { MovieCardByIdData } from "../../utils/MovieCardByIdApi";

import { db } from "../../utils/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

function Bookmarks() {
  const { user } = useAuth();
  const [bookmarkedMovies, setBookmarkedMovies] = useState([]);
  const { bookmarksLoading, setBookmarksLoading } = useLoading();

  // Запрос закладок из БД и фетчинг данных фильмов
  useEffect(() => {
    if (user) {
      const fetchBookmarks = async () => {
        setBookmarksLoading(true);
        try {
          const bookmarksQuery = query(
            collection(db, "users", user.uid, "bookmarks"),
            orderBy("timestamp", "asc")
          );
          const querySnapshot = await getDocs(bookmarksQuery);
          const movieIds = querySnapshot.docs.map((doc) => doc.data().movieId);

          const movies = await Promise.all(
            movieIds.map((id) => MovieCardByIdData(id))
          );
          setBookmarkedMovies(movies);
        } catch (error) {
          console.error("Error fetching bookmarks:", error);
        } finally {
          setBookmarksLoading(false);
        }
      };
      fetchBookmarks();
    }
  }, [user, setBookmarksLoading]);

  return (
    <>
      <Container fluid="xxl">
        <ScrollToTopButton />
        <ScrollToEndButton />
        <BackwardButton />
        <SearchForm />
        <Container fluid="xl">
          <Row className="pt-2 sticky-header">
            <h2 className="text-start display-5">Мои сохраненные фильмы</h2>
          </Row>
          <Row className="mb-2 mb-md-5 mt-4">
            {bookmarksLoading ? (
              <Col className="text-center">
                <div className="spinner-border text-primary m-5" role="status">
                  <span className="visually-hidden">Загрузка...</span>
                </div>
              </Col>
            ) : (
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
            )}
          </Row>
        </Container>
      </Container>
    </>
  );
}

export default Bookmarks;
