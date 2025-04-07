/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';

function SearchResultCard({ item, isLoading }) {
  return (
    <Link
      to={`/${item.media_type}/${item.id}`}
      className="text-decoration-none text-reset">
      <Card className="border-0 text-start search-results__card mb-4 w-100">
        <Row>
          <Col xs={4} sm={2}>
            <div className="search-results__poster-container">
              {isLoading ? (
                <div className="loading-placeholder">Загрузка...</div>
              ) : (
                <>
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
                </>
              )}
            </div>
          </Col>
          <Col xs={8} sm={10} className="d-flex">
            <Card.Body className="d-flex flex-column ps-1 p-0 pt-1 p-md-2">
              <Card.Title className="fw-semibold mb-md-0 search-results__card-title">
                {item.title}&nbsp;
                <span className="mb-4 mb-md-5 fw-light">
                  {item.release_year || ''}
                </span>
                <h2 className="text-secondary search-results__card-subtitle">
                  {item.original_title}
                </h2>
                <span
                  className="text-secondary fw-light d-block d-md-none mb-2"
                  style={{ fontSize: '0.8em' }}>
                  {item.genreNames?.join(', ') || ''}{' '}
                  {/* Используем готовые жанры */}
                </span>
              </Card.Title>
              <Card.Text className="mb-2 mb-md-3 d-none d-md-block">
                <span
                  className="badge fw-semibold"
                  style={{ fontSize: '0.875em', backgroundColor: '#f05723' }}>
                  {item.rating || null}
                </span>
                &emsp;
                <span
                  className="text-secondary"
                  style={{ fontSize: '0.8em', verticalAlign: 'bottom' }}>
                  {item.genreNames?.join(', ') || ''}{' '}
                </span>
              </Card.Text>
              <Card.Text
                className="search-results__text-clamp lh-sm"
                style={{
                  fontSize: window.innerWidth <= 576 ? '0.8em' : '0.875em',
                }}>
                {item.overview}
              </Card.Text>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Link>
  );
}

export default SearchResultCard;
