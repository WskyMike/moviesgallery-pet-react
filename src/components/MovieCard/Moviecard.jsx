/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import {
  Bookmark,
  BookmarkStar,
  BookmarkStarFill,
} from "react-bootstrap-icons";
import { Col, Row } from "react-bootstrap";
import "./Moviecard.css";
import placeholder from "../../images/mesh-gradient.webp";

import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastProvider";

import { toggleBookmark, checkBookmarkStatus } from "../../utils/BookmarkUtils";

function MovieCard({ movie, isLoading, onImageLoaded }) {
  const navigate = useNavigate();
  const { triggerToast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const { user, authLoading } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholder);

  // Обновляем `currentSrc` при смене `isLoading`
  useEffect(() => {
    setCurrentSrc(isLoading ? placeholder : movie.poster);
  }, [isLoading, movie.poster]);

  useEffect(() => {
    if (imageLoaded && onImageLoaded) {
      onImageLoaded();
    }
  }, [imageLoaded]);

  // Проверяем, есть ли фильм в закладках
  useEffect(() => {
    if (user && movie?.id && movie?.media_type) {
      checkBookmarkStatus({
        userId: user.uid,
        itemId: movie.id,
        mediaType: movie.media_type,
        setIsBookmarked,
        triggerToast,
      });
    }
  }, [user, movie?.id, movie?.media_type, triggerToast]);

  // Сохраняем или удаляем закладку
  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleBookmark({
      userId: user.uid,
      itemId: movie.id,
      mediaType: movie.media_type,
      isBookmarked,
      setIsBookmarked,
      triggerToast,
      preventPropagation: true,
      event: e,
    });
  };

  const handleClick = () => {
    if (!isLoading) {
      const path =
        movie.media_type === "tv" ? `/tv/${movie.id}` : `/movie/${movie.id}`;
      navigate(path);
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
      href={
        !isLoading
          ? `/${movie.media_type === "tv" ? "tv" : "movie"}/${movie.id}`
          : undefined
      }
      tabIndex={!isLoading ? 0 : -1} // фокусируемая только если !isLoading
      role={!isLoading ? "link" : undefined}
      className="text-decoration-none text-black"
    >
      <div
        className="movie-card pt-3"
        onClick={!isLoading ? handleClick : undefined}
      >
        <div className="movie-content d-flex flex-column justify-content-end h-100">
          <div className="poster-container">
            {imageLoaded && !isLoading && !authLoading && user && (
              <div
                className="bookmark-icon"
                onClick={handleBookmarkClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {isBookmarked ? (
                  <BookmarkStarFill
                    className="text-warning"
                    width="24"
                    height="24"
                  />
                ) : isHovered ? (
                  <BookmarkStar
                    className="text-warning"
                    width="24"
                    height="24"
                  />
                ) : (
                  <Bookmark className="text-warning" width="24" height="24" />
                )}
              </div>
            )}
            {!isLoading && imageLoaded && movie.rating && (
              <div className="movie-rating border-0">
                <span>{movie.rating}</span>
              </div>
            )}
            <img
              src={currentSrc}
              alt={movie.title || movie.name}
              className="movie-poster"
              onLoad={() => {
                if (currentSrc === movie.poster) {
                  setImageLoaded(true);
                }
              }}
              onError={() => setCurrentSrc(placeholder)}
            />
          </div>
          <div className="movie-info flex-row">
            <Col xs={11} className="d-flex flex-column text-start pe-1 pt-1">
              <Row>
                <small className="movie-info-title fw-bold">
                  {(!isLoading &&
                    (movie.title ||
                      movie.name ||
                      movie.original_title ||
                      movie.original_name)) ||
                    ""}
                </small>
              </Row>
              <Row>
                <small className="text-secondary">
                  {movie.release_date || movie.first_air_date || "Загрузка..."}
                </small>
              </Row>
            </Col>
          </div>
        </div>
      </div>
    </a>
  );
}

export default MovieCard;
