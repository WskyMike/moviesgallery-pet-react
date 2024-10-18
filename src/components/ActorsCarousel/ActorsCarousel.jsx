/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { creditsMovieData } from "../../utils/CreditsMovieApi";

import "./ActorsCarousel.css"

function ActorsCarousel() {
  const { id } = useParams(); // Получаем ID фильма из URL
  const [credits, setCredits] = useState({
    actors: [],
  });
  const [error, setError] = useState(null);
  const [loadingCredits, setLoadingCredits] = useState(true);

  async function fetchCredits() {
    try {
      const data = await creditsMovieData(id);
      setCredits(data);
      setLoadingCredits(false);
    } catch (err) {
      setError(err.message);
      setLoadingCredits(false);
    }
  }

  useEffect(() => {
    fetchCredits();
  }, [id]); // Повторный запрос при изменении ID

  if (error) {
    return <div className="m-5">Ошибка: {error}</div>;
  }

  return (
    <Row>
      <h3 className="text-start fw-bold fs-5 mb-3">Актеры</h3>
      <Row xl={8} className="g-2 justify-content-start">
        {loadingCredits ? (
          <div className="spinner-border text-dark m-5" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        ) : credits.actors.length > 0 ? (
          credits.actors.map((actor, idx) => (
            <Col key={idx} className="actor-card-col">
              <Card className="h-100">
                <Card.Img
                  variant="top"
                  src={actor.profile_path}
                  alt={actor.name}
                />
                <Card.Body className="text-start p-2 d-flex flex-column justify-content-between">
                  <Card.Title className="text-semibold fs-6">
                    {actor.name}
                  </Card.Title>
                  <Card.Text className="lh-1">
                    <small>{actor.character}</small>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>Нет информации об актерах</p>
        )}
      </Row>
    </Row>
  );
}

export default ActorsCarousel;
