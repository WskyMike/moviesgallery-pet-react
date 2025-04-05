/* eslint-disable react/prop-types */
import { Col, Row } from 'react-bootstrap';
import './RecommendationsCard.css';

function RecommendationsCard({ movie, isLoading, onImageError }) {
  if (!movie || isLoading) {
    return null;
  }

  return (
    <a
      href={`/${movie.media_type === 'tv' ? 'tv' : 'movie'}/${movie.id}`}
      tabIndex={!isLoading ? 0 : -1}
      role={!isLoading ? 'link' : undefined}
      className="text-decoration-none text-black">
      <div
        className="recommendation-card pt-2"
        // onClick={!isLoading ? handleClick : undefined}
      >
        <div className="movie-content d-flex flex-column justify-content-end h-100">
          <div className="backdrop-container">
            {!isLoading && movie?.rating && (
              <div className="recommendation-rating border-0">
                <span>{movie.rating}</span>
              </div>
            )}
            <img
              src={movie.backdrop}
              alt={movie?.title || 'Нет названия'}
              className="movie-backdrop w-100 rounded"
              style={{ aspectRatio: '16 / 9' }}
              onError={onImageError}
            />
          </div>
          <div className="recommendation-card-info flex-row">
            <Col xs={11} className="d-flex flex-column text-start pe-1 pt-1">
              <Row>
                <small className="recommendation-card-title fw-bold">
                  {movie?.title || 'Нет названия'}
                </small>
              </Row>
              <Row>
                <small className="text-secondary">
                  {movie?.release_date || '-'}
                </small>
              </Row>
            </Col>
          </div>
        </div>
      </div>
    </a>
  );
}

export default RecommendationsCard;
