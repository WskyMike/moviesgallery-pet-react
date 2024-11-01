/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import * as Icon from "react-bootstrap-icons";
import { Col, Row } from "react-bootstrap";
import "./Moviecard.css";
import placeholder from "../../images/mesh-gradient.webp";

import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastProvider";

import { toggleBookmark, checkBookmarkStatus } from "../../utils/BookmarkUtils";

function MovieCard({ movie, isLoading }) {
  const navigate = useNavigate();
  const { triggerToast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const { user, authLoading } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Проверяем, есть ли фильм в закладках
  useEffect(() => {
    if (user && movie.id) {
      checkBookmarkStatus({
        userId: user.uid,
        movieId: movie.id,
        setIsBookmarked,
        triggerToast,
      });
    }
  }, [user, movie.id, triggerToast]);

  // Сохраняем или удаляем закладку
  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleBookmark({
      userId: user.uid,
      movieId: movie.id,
      isBookmarked,
      setIsBookmarked,
      triggerToast,
      preventPropagation: true,
      event: e,
    });
  };

  const handleClick = () => {
    if (!isLoading) {
      navigate(`/movie/${movie.id}`);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isHovered) {
        setIsHovered(false);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <a
      href={!isLoading ? `/movie/${movie.id}` : undefined}
      tabIndex={!isLoading ? 0 : -1} // фокусируемая только если !isLoading
      role={!isLoading ? "link" : undefined}
      className="text-decoration-none text-black"
    >
      <div
        className="movie-card pt-3"
        onClick={!isLoading ? handleClick : undefined}
      >
        {imageLoaded && !isLoading && !authLoading && user && (
          <div
            className="bookmark-icon"
            onClick={handleBookmarkClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isBookmarked ? (
              <Icon.BookmarkStarFill
                className="text-warning"
                width="24"
                height="24"
              />
            ) : isHovered ? (
              <Icon.BookmarkStar
                className="text-warning"
                width="24"
                height="24"
              />
            ) : (
              <Icon.Bookmark className="text-warning" width="24" height="24" />
            )}
          </div>
        )}

        <div className="poster-container">
          {!isLoading && movie.rating && (
            <div className="movie-rating border-0">
              <span>{movie.rating}</span>
            </div>
          )}
          <img
            src={
              isLoading || !imageLoaded || imageError
                ? placeholder
                : movie.poster
            }
            alt={movie.title || movie.name}
            className="movie-poster"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        </div>
        <div className="movie-info flex-row">
          <Col xs={11} className="d-flex flex-column text-start pe-1 pt-1">
            <Row>
              <small className="movie-info-title fw-bold">
                {movie.title ||
                  movie.name ||
                  movie.original_title ||
                  movie.original_name}
              </small>
            </Row>
            <Row>
              <small className="text-secondary">
                {movie.release_date || movie.first_air_date}
              </small>
            </Row>
          </Col>
        </div>
      </div>
    </a>
  );
}

export default MovieCard;
