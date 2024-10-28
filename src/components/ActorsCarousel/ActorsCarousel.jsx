/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import Carousel from "react-multi-carousel";
import actorsСarouselSettings from "../../vendor/actorsСarouselSettings";
import ActorsCard from "../ActorsCard/ActorsCard";
import "react-multi-carousel/lib/styles.css";
import {
  CustomLeftArrowThin,
  CustomRightArrowThin,
} from "../../vendor/customArrows";
import { useParams } from "react-router-dom";
import { creditsMovieData } from "../../utils/CreditsMovieApi";

function ActorsCarousel() {
  const { id } = useParams(); // Получаем ID фильма из URL
  const [actors, setActors] = useState([]);
  const [error, setError] = useState(null);
  const [loadingCredits, setLoadingCredits] = useState(true);
  const carouselRef = useRef(null);

  async function fetchActors() {
    try {
      const data = await creditsMovieData(id);
      // Фильтрация дубликатов по id
      const uniqueActors = data.actors.filter(
        (actor, index, self) =>
          index === self.findIndex((a) => a.id === actor.id)
      );

      setActors(uniqueActors || []);
      setLoadingCredits(false);
    } catch (error) {
      console.error("Ошибка при загрузке актеров:", error);
      setError(error.message);
      setLoadingCredits(false);
    }
  }

  useEffect(() => {
    fetchActors();
  }, [id]);

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
    return <div className="m-5">Ошибка: {error}</div>;
  }

  return (
    <>
      {loadingCredits ? (
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border text-dark m-5" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        </div>
      ) : actors.length > 0 ? (
        <div className="d-flex align-items-center px-0">
          <CustomLeftArrowThin onClick={goToPrevious} />
          <Carousel {...actorsСarouselSettings} ref={carouselRef}>
            {actors.map((actor) => (
              <ActorsCard key={actor.id} actor={actor} />
            ))}
          </Carousel>
          <CustomRightArrowThin onClick={goToNext} />
        </div>
      ) : (
        <p className="text-center">Нет информации об актерах</p>
      )}
    </>
  );
}

export default ActorsCarousel;
