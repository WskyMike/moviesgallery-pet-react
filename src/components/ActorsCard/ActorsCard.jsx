/* eslint-disable react/prop-types */
import { Card } from "react-bootstrap";

import "./ActorsCard.css"

function ActorsCard({ actor }) {
  return (
    <Card className="h-100 actor-card mx-1 border-0">
      <Card.Img
        variant="top"
        src={actor.profile_path}
        alt={actor.name}
        className="actor-card-img"
      />
      <Card.Body className="p-2 text-start d-flex flex-column justify-content-between bg-light rounded-bottom">
        <Card.Title className="actors-card__title">{actor.name}</Card.Title>
        <Card.Text className="text-secondary lh-1 actors-card__text">
          <small>{actor.character}</small>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default ActorsCard;
