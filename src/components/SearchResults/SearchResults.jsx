/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSearch } from "../../contexts/SearchContext";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import ScrollToTopButton from "../../vendor/ScrollToTopButton/ToTopButton";
import ScrollToEndButton from "../../vendor/ScrollToEndButton/ScrollToEndButton";
import BackwardButton from "../../vendor/BackwardButton/BackwardButton";
import SearchForm from "../SearchForm/SearchForm";
import { SearchApi } from "../../utils/SearchApi";
import "./SearchResult.css";

function SearchResults() {
  const { searchTrigger } = useSearch();
  const [selectedCategory, setSelectedCategory] = useState("movie");
  const [isLoading, setIsLoading] = useState(true);
  const [filteredResults, setFilteredResults] = useState([]);
  const [movieCount, setMovieCount] = useState(0);
  const [tvCount, setTvCount] = useState(0);

  const handleStorageChange = async () => {
    const query = sessionStorage.getItem("searchQuery");
    if (!query) {
      setFilteredResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await SearchApi(query);
      const filtered = data.result.filter(
        (item) => item.media_type?.toLowerCase() === selectedCategory
      );
      setFilteredResults(filtered);
      setMovieCount(data.movieCount || 0);
      setTvCount(data.tvCount || 0);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
      setFilteredResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleStorageChange();
  }, [selectedCategory, searchTrigger]);

  return (
    <Container fluid="xxl">
      <ScrollToTopButton />
      <ScrollToEndButton />
      <BackwardButton />
      <SearchForm />
      <Container fluid="xl">
        <Row>
          {/* Левая колонка */}
          <Col md={3} className="mb-5 mb-md-0">
            <ListGroup variant="flush">
              <ListGroup.Item
                as="button"
                action
                active={selectedCategory === "movie"}
                onClick={() => setSelectedCategory("movie")}
                className="d-flex justify-content-between align-items-center search-results__custom-active rounded border-0"
              >
                Фильмы
                <span className="badge bg-primary rounded-pill fw-normal">
                  {movieCount || ""}
                </span>
              </ListGroup.Item>
              <ListGroup.Item
                as="button"
                action
                active={selectedCategory === "tv"}
                onClick={() => setSelectedCategory("tv")}
                className="d-flex justify-content-between align-items-center search-results__custom-active rounded border-0 mt-0"
              >
                Сериалы
                <span className="badge bg-primary rounded-pill fw-normal">
                  {tvCount || ""}
                </span>
              </ListGroup.Item>
            </ListGroup>
          </Col>

          {/* Правая колонка */}
          <Col md={9}>
            {isLoading ? (
              <div className="d-flex justify-content-center my-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Загрузка...</span>
                </div>
              </div>
            ) : filteredResults.length > 0 ? (
              filteredResults.map((item) => (
                <Link
                  to={`/${item.media_type}/${item.id}`}
                  key={item.id}
                  className="text-decoration-none text-reset"
                >
                  <Card className="border-0 text-start search-results__card mb-4 w-100">
                    <Row>
                      <Col xs={4} sm={2}>
                        <div className="search-results__poster-container">
                          {item?.rating && (
                            <div className="search-results__movie-rating fw-semibold border-0 d-md-none">
                              <span>{item.rating}</span>
                            </div>
                          )}
                          <Card.Img
                            src={item.poster}
                            alt={`Poster of ${item.title}`}
                            className="img-fluid"
                          />
                        </div>
                      </Col>
                      <Col xs={8} sm={10} className="d-flex">
                        <Card.Body className="d-flex flex-column ps-1 p-0 p-md-2">
                          <Card.Title className="fw-semibold mb-md-0 search-results__card-title">
                            {item.title}&nbsp;
                            <span className="mb-4 mb-md-5 fw-light">
                              {item.release_year || ""}
                            </span>
                            <h2 className="text-secondary search-results__card-subtitle">
                              {item.original_title}
                            </h2>
                          </Card.Title>
                          <Card.Text className="mb-2 mb-md-3 d-none d-md-block">
                            <span
                              className="badge fw-semibold"
                              style={{ fontSize: "0.875em", backgroundColor: "#f05723" }}
                            >
                              {item.rating || null}
                            </span>
                            &emsp;
                          </Card.Text>
                          <Card.Text
                            className="search-results__text-clamp lh-sm"
                            style={{
                              fontSize:
                                window.innerWidth <= 576 ? "0.8em" : "0.875em",
                            }}
                          >
                            {item.overview}
                          </Card.Text>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="text-muted">
                Ничего не найдено для выбранной категории.
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default SearchResults;
