import { Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { BsCheck2Square, BsCalendar3 } from 'react-icons/bs';

function LastSeasonCard({ seasonData, tvId }) {
  if (!seasonData) return null;

  const {
    name,
    vote_average,
    episode_count,
    season_poster_path,
    last_episode_to_air,
    next_episode_to_air,
  } = seasonData;

  return (
    <>
      <h3 className="text-start fw-bold fs-5 mb-4 mt-5">Текущий сезон</h3>
      <Card className="border-0 text-start">
        <Row>
          <Col xs={8} sm={5} md={3} className="mx-auto mx-md-0">
            <Card.Img
              src={season_poster_path || ''}
              alt={`Постер ${name}`}
              loading="lazy"
              className="img-fluid"
            />
          </Col>
          <Col md={9} className="d-flex">
            <Card.Body className="d-flex flex-column justify-content-end rounded bg-body-tertiary ps-5">
              <Card.Title className="fw-semibold">{name || '-'}</Card.Title>
              <Card.Text className="mb-4">
                {vote_average > 0 && (
                  <span
                    className="badge fw-semibold text-bg-secondary"
                    style={{ fontSize: '0.875em' }}>
                    {vote_average}
                  </span>
                )}
                <small className="text-muted">
                  {' '}
                  {episode_count || '-'} эпизодов
                </small>
              </Card.Text>
              <Card.Text style={{ fontSize: '0.875rem' }}>
                <BsCheck2Square />
                &ensp; Последний эпизод сезона вышел{' '}
                {last_episode_to_air || '-'}
              </Card.Text>
              <Card.Text style={{ fontSize: '0.875rem' }}>
                <BsCalendar3 /> &ensp;
                {next_episode_to_air
                  ? `Следующий эпизод планируется ${next_episode_to_air}`
                  : 'Новые эпизоды не планируются.'}
              </Card.Text>
              <Card.Text className="mt-auto fs-5 text-primary">
                <Link
                  to={`/tv/${tvId}/seasons`}
                  className="text-decoration-none">
                  Все сезоны
                </Link>
              </Card.Text>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </>
  );
}

LastSeasonCard.propTypes = {
  seasonData: PropTypes.shape({
    name: PropTypes.string,
    vote_average: PropTypes.number,
    episode_count: PropTypes.number,
    season_poster_path: PropTypes.string,
    last_episode_to_air: PropTypes.string,
    next_episode_to_air: PropTypes.string,
  }),
  tvId: PropTypes.string.isRequired,
};

export default LastSeasonCard;
