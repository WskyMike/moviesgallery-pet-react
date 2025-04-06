/* eslint-disable react/prop-types */
import { Card, Row, Col } from 'react-bootstrap';

function SeasonCard({ season, isLoading }) {
  return (
    <Card className="border-0 text-start seasons_card my-4 w-100">
      <Row>
        <Col xs={4} sm={2}>
          {isLoading ? (
            <div className="loading-placeholder">Загрузка...</div>
          ) : (
            <Card.Img
              src={season.poster}
              alt={`Poster of ${season.name}`}
              className="img-fluid"
            />
          )}
        </Col>
        <Col xs={8} sm={10} className="d-flex">
          <Card.Body className="d-flex flex-column ps-0 ps-md-5 pt-0 pe-0 pe-md-3">
            <Card.Title className="fw-semibold">{season.name}</Card.Title>
            <Card.Text className="mb-3">
              {season.vote_average > 0 && (
                <span
                  className="badge fw-semibold text-bg-secondary"
                  style={{ fontSize: '0.875em' }}>
                  {season.vote_average}
                </span>
              )}
              <small className="text-muted">
                {' '}
                {season.episode_count} эпизодов
              </small>
            </Card.Text>
            <Card.Text
              className="mb-4 mb-md-5"
              style={{
                fontSize: window.innerWidth <= 576 ? '0.8em' : '0.875em',
              }}>
              {season.air_date ? (
                new Date(season.air_date) > new Date() ? (
                  <>
                    Выход сезона планируется{' '}
                    <span className="d-md-none">
                      <br />
                    </span>
                    {new Date(season.air_date).toLocaleDateString('ru-RU', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </>
                ) : (
                  <>
                    Сезон вышел{' '}
                    <span className="d-md-none">
                      <br />
                    </span>
                    {new Date(season.air_date).toLocaleDateString('ru-RU', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </>
                )
              ) : (
                'Нет данных или сезон ещё не вышел'
              )}
            </Card.Text>
            <Card.Text
              style={{
                fontSize: window.innerWidth <= 576 ? '0.8em' : '0.875em',
              }}>
              {season.overview}
            </Card.Text>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
}

export default SeasonCard;
