/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import "react-multi-carousel/lib/styles.css";
import { useParams, useLocation } from "react-router-dom";
import Carousel from "react-multi-carousel";
import RecommendationsCard from "./RecommendationsCard/RecommendationsCard";
import {
  CustomLeftArrowThin,
  CustomRightArrowThin,
} from "../../../vendor/customArrows";
import { recommendationsData } from "../../../utils/RecommendationApi";
import adviceСarouselSettings from "../../../vendor/adviceСarouselSettings";

function RecommendationsCarousel() {
  const { id } = useParams(); // Получаем ID фильма из URL
  const location = useLocation(); // Получаем текущий путь
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [recommendations, setRecommendations] = useState([]);

  async function fetchRecommendations() {
    try {
      const mediaType = location.pathname.includes("/movie/") ? "movie" : "tv";
      const data = await recommendationsData(id, mediaType);
      setRecommendations(data || []);
      setLoadingRecommendations(false);
    } catch (error) {
      console.error("Ошибка при загрузке рекомендаций:", error);
      setError(error.message);
      setLoadingRecommendations(false);
    }
  }

  useEffect(() => {
    fetchRecommendations();
  }, [id, location.pathname]);

  const goToPrevious = () => {
    if (carouselRef.current) {
      carouselRef.current.previous();
    }
  };

  const goToNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  if (error) {
    return <div className="m-5">Ошибка загрузки рекомендаций: {error}</div>;
  }

  return (
    <>
      {loadingRecommendations ? (
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border text-dark m-5" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="d-flex align-items-center px-0">
          <CustomLeftArrowThin onClick={goToPrevious} />
          <Carousel {...adviceСarouselSettings} ref={carouselRef}>
            {recommendations.map((item) => (
              <RecommendationsCard
                key={item.id}
                movie={item}
                isLoading={loadingRecommendations}
              />
            ))}
          </Carousel>
          <CustomRightArrowThin onClick={goToNext} />
        </div>
      ) : (
        <p className="text-center">Нет рекомендаций</p>
      )}
    </>
  );
}

export default RecommendationsCarousel;
