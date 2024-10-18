/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import * as Icon from "react-bootstrap-icons";
import "./Moviecard.css";
import placeholder from "../../images/mesh-gradient.webp";

import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastProvider";


// Firebase
import { db } from "../../utils/firebase";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";


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
      const fetchBookmarkStatus = async () => {
        try {
          const docRef = doc(
            db,
            "users",
            user.uid,
            "bookmarks",
            String(movie.id)
          );
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setIsBookmarked(true);
          } else {
            setIsBookmarked(false);
          }
        } catch (error) {
          console.error("Error fetching bookmark status:", error);
          triggerToast(
            `Error fetching bookmark(${error.message})`,
            "danger-subtle",
            "danger-emphasis"
          );
        }
      };
      fetchBookmarkStatus();
    }
  }, [user, movie.id, triggerToast]);

  // Сохраняем или удаляем закладку
  const handleBookmarkClick = async (e) => {
    e.stopPropagation(); 
    if (!authLoading && user) {
      const docRef = doc(db, "users", user.uid, "bookmarks", String(movie.id)); 
      try {
        if (isBookmarked) {
          await deleteDoc(docRef); 
          setIsBookmarked(false);
          triggerToast(
            "Удалили фильм",
            "info-subtle",
            "info-emphasis",
            "top-center"
          );        } else {
          await setDoc(docRef, { movieId: movie.id });
          setIsBookmarked(true);
          triggerToast(
            "Сохранили фильм",
            "info-subtle",
            "info-emphasis",
            "top-center"
          );        }
      } catch (error) {
        console.error("Error updating bookmark:", error);
        triggerToast(
          `Error updating bookmark(${error.message})`,
          "danger-subtle",
          "danger-emphasis"
        );
      }
    }
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

  const getRatingColor = (rating) => {
    if (rating >= 1 && rating < 4) {
      return "#FF6B6B";
    } else if (rating >= 4 && rating < 5.5) {
      return "#FFA94D";
    } else if (rating >= 5.5 && rating < 7) {
      return "#FFD93D";
    } else if (rating >= 7 && rating <= 10) {
      return "#69DB7C";
    }
    return "#FFFFFF";
  };

  return (
    <div
      className="movie-card"
      role={!isLoading ? "button" : undefined}
      onClick={handleClick}
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

      <img
        src={
          isLoading || !imageLoaded || imageError ? placeholder : movie.poster
        }
        alt={movie.title || movie.name}
        className="movie-poster"
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
      />

      <div className="movie-info">
        <h3 className="fs-4 movie-title">{movie.title || movie.name}</h3>
        <h4 className="fs-6 fw-light movie-original-title">
          {movie.original_title || movie.original_name}
        </h4>
        <div className="movie-details">
          <span
            className="fs-2 movie-rating"
            style={{ color: getRatingColor(movie.rating) }}
          >
            {movie.rating}
          </span>
          <span className="fw-light movie-release-date">
            {movie.release_date || movie.first_air_date}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
