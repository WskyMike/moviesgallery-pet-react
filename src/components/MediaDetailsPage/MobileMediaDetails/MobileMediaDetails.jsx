import { Container, Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import {
  BookmarkStar,
  BookmarkStarFill,
  Bookmark,
} from 'react-bootstrap-icons';
import { VscQuote } from 'react-icons/vsc';
import { ImYoutube } from 'react-icons/im';
import RatingIndicator from '../../../utils/other/RatingIndicator.jsx';
import LastSeasonCard from '../../Seasons/LastSeasonCard/LastSeasonCard.jsx';
import CustomGradientButton from '../../CustomButton/CustomGradientButton.jsx';

function MobileMediaDetails({
  media,
  type,
  id,
  movieCreators,
  videoKeys,
  loadingTrailer,
  isHovered,
  isBookmarked,
  showButton,
  setIsHovered,
  handleBookmarkClick,
  handleShowTrailer,
  renderOverview,
}) {
  return (
    <Container fluid="xl">
      <div className="d-flex align-items-center justify-content-center flex-column px-1">
        <Col xs={8} sm={6} className="mb-4">
          {media?.poster ? (
            <img
              src={media.poster}
              alt={media.title || media.name}
              className="img-fluid rounded-3"
              loading="lazy"
            />
          ) : (
            <div>Постер не доступен</div>
          )}
        </Col>
        <Row className="mb-2">
          <h1 className="mb-1 fs-2 text-center fw-bold">
            {media?.title || media?.name}
          </h1>
          <h2 className="fs-4 text-center fw-light">
            <small>{media?.original_title || media?.original_name}</small>
          </h2>
        </Row>
        <Row className="mb-5 mx-2">
          <div>
            <small className="text-secondary">
              {type === 'movie'
                ? media?.release_year || ''
                : `${media?.first_air_year || null} - ${
                    media?.status === 'Завершился' ||
                    media?.status === 'Отменён'
                      ? media?.last_air_year
                      : 'н.в.'
                  }`}
              &nbsp;
              <br />
              {media?.genres.join(', ') || ''}
            </small>
          </div>
          <div>
            <small className="text-secondary">
              {media?.production_countries}
              {(type === 'movie' && media?.runtime) ||
              (type === 'tv' && media?.episode_run_time)
                ? `, ${media?.runtime || media?.episode_run_time}`
                : ''}
            </small>
          </div>
        </Row>
        <Row className="mb-5 mt-3 align-items-center w-100">
          <Col xs={6} className="text-center">
            <div className="text-secondary">Рейтинг TMDB:</div>
            <div className="fw-bold display-5">
              <RatingIndicator rating={media?.rating} size={85} />
            </div>
          </Col>

          <Col xs={6} className="px-0">
            <button
              type="button"
              className="btn btn-light text-nowrap fw-bold border-0 rounded-2"
              onClick={handleBookmarkClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}>
              {isBookmarked ? (
                <BookmarkStarFill className="me-2" width="18" height="18" />
              ) : isHovered ? (
                <BookmarkStar className="me-2" width="18" height="18" />
              ) : (
                <Bookmark className="me-2" width="18" height="18" />
              )}
              Буду смотреть
            </button>
          </Col>
        </Row>
        <Row className="mb-5">
          <Row className="pe-0">
            {media?.tagline && (
              <figure className="mb-4">
                <VscQuote className="d-flex fs-4" />
                <blockquote
                  className="fst-italic text-start text-secondary blockquote mt-1 ps-4"
                  style={{ fontSize: '0.9rem' }}>
                  <p>{media.tagline}</p>
                </blockquote>
              </figure>
            )}
          </Row>
          <h3 className="text-start fw-bold fs-5 mb-4">
            {type === 'movie' ? 'О фильме' : 'О сериале'}
          </h3>
          {type === 'tv' && media?.status && (
            <Row className="text-start fs-6 text-secondary pe-0">
              <Col xs={6} className="pe-0">
                <p>
                  <small>Статус</small>
                </p>
              </Col>
              <Col xs={6} className="pe-0">
                <p className="text-black text-end">
                  <small
                    className={`badge fw-normal ${
                      {
                        Продолжается: 'text-bg-success',
                        Завершился: 'text-bg-danger',
                        'В производстве': 'text-bg-warning',
                        Запланирован: 'text-bg-info',
                        Отменён: 'text-bg-secondary',
                        'Пилотный выпуск': 'text-bg-primary',
                      }[media?.status] || 'text-bg-secondary'
                    }`}
                    style={{ fontSize: '0.875em' }}>
                    {media?.status || 'Неизвестен'}
                  </small>
                </p>
              </Col>
            </Row>
          )}
          <Row className="text-start fs-6 text-secondary pe-0">
            <Col xs={6} className="pe-0">
              <p>
                <small>Оригинальный язык</small>
              </p>
            </Col>
            <Col xs={6} className="pe-0">
              <p className="text-black text-end">
                <small>{media?.original_language || '-'}</small>
              </p>
            </Col>
          </Row>
          <Row className="text-start fs-6 text-secondary pe-0">
            <Col xs={6} className="pe-0">
              <p>
                <small>
                  {type === 'movie' ? 'Дата выхода' : 'Первый эпизод'}
                </small>
              </p>
            </Col>
            <Col xs={6} className="pe-0">
              <p className="text-black text-end">
                <small>
                  {type === 'movie'
                    ? media?.release_date || ''
                    : media?.first_air_date || ''}
                </small>
              </p>
            </Col>
          </Row>
          {type === 'tv' && media?.last_air_date && (
            <Row className="text-start fs-6 text-secondary pe-0">
              <Col xs={6} className="pe-0">
                <p>
                  <small>Последний эпизод</small>
                </p>
              </Col>
              <Col xs={6} className="pe-0">
                <p className="text-black text-end">
                  <small>{media?.last_air_date || '-'}</small>
                </p>
              </Col>
            </Row>
          )}
          <Row className="text-start fs-6 text-secondary pe-0">
            <Col xs={6} className="pe-0">
              <p>
                <small>{type === 'movie' ? 'Режиссеры' : 'Создатели'}</small>
              </p>
            </Col>
            <Col xs={6} className="pe-0">
              <p className="text-black text-end">
                <small>
                  {type === 'movie'
                    ? movieCreators.directors.length > 0
                      ? movieCreators.directors.map((d) => d.name).join(', ')
                      : '-'
                    : media?.creators?.length > 0
                      ? media.creators.join(', ')
                      : '-'}
                </small>
              </p>
            </Col>
          </Row>
          <Row className="text-start fs-6 text-secondary pe-0">
            <Col xs={6} className="pe-0">
              <p>
                <small>Кинокомпания</small>
              </p>
            </Col>
            <Col xs={6} className="pe-0">
              <p className="text-black text-end">
                {media?.production_companies &&
                media.production_companies.length > 0 ? (
                  media.production_companies.map((company, index) => (
                    <small
                      key={`company-mobile-${index}`}
                      className="d-block text-end">
                      {company}
                    </small>
                  ))
                ) : (
                  <small>Нет информации</small>
                )}
              </p>
            </Col>
          </Row>
          {type === 'movie' && media?.budget && (
            <Row className="text-start fs-6 text-secondary pe-0">
              <Col xs={6} className="pe-0">
                <p>
                  <small>Бюджет</small>
                </p>
              </Col>
              <Col xs={6} className="pe-0">
                <p className="text-black text-end">
                  <small>{media?.budget}</small>
                </p>
              </Col>
            </Row>
          )}
          {type === 'movie' && media?.revenue && (
            <Row className="text-start fs-6 text-secondary pe-0">
              <Col xs={6} className="pe-0">
                <p>
                  <small>Сборы в мире</small>
                </p>
              </Col>
              <Col xs={6} className="pe-0">
                <p className="text-black text-end">
                  <small>{media?.revenue}</small>
                </p>
              </Col>
            </Row>
          )}
          <Row className="m-0 d-flex justify-content-center">
            <hr className="my-4"></hr>
            {renderOverview()}
            {showButton && (
              <Row className="mt-1">
                <CustomGradientButton />
              </Row>
            )}
          </Row>
          {type === 'tv' && media?.last_production_season && (
            <Row className="text-start mx-0 mb-5 mt-2">
              <LastSeasonCard
                seasonData={{
                  name: media.last_production_season.name,
                  vote_average: media.last_production_season.vote_average,
                  episode_count: media.last_production_season.episode_count,
                  season_poster_path:
                    media.last_production_season.season_poster_path,
                  last_episode_to_air: media.last_episode_to_air,
                  next_episode_to_air: media.next_episode_to_air,
                }}
                tvId={id}
              />
            </Row>
          )}
        </Row>
        <Row className="mb-3 w-100">
          {/* Кнопка смотреть трейлер */}
          <Button
            variant="btn btn-lg btn-light"
            className="rounded-3 border-0 w-100 fw-bold"
            onClick={handleShowTrailer}
            disabled={videoKeys.length === 0 && !loadingTrailer}>
            <div className="d-flex align-items-center justify-content-center">
              <ImYoutube className="fs-2 ImYoutube-icon" />
              <span className="mx-2">
                {loadingTrailer
                  ? 'Загрузка...'
                  : videoKeys.length > 0
                    ? 'Смотреть трейлер'
                    : 'Трейлер не найден'}
              </span>
            </div>
          </Button>
        </Row>
      </div>
    </Container>
  );
}

MobileMediaDetails.propTypes = {
  media: PropTypes.object,
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  movieCreators: PropTypes.object.isRequired,
  videoKeys: PropTypes.array.isRequired,
  loadingTrailer: PropTypes.bool.isRequired,
  isHovered: PropTypes.bool.isRequired,
  isBookmarked: PropTypes.bool.isRequired,
  showButton: PropTypes.bool.isRequired,
  isTranslating: PropTypes.bool.isRequired,
  setIsHovered: PropTypes.func.isRequired,
  handleBookmarkClick: PropTypes.func.isRequired,
  handleShowTrailer: PropTypes.func.isRequired,
  renderOverview: PropTypes.func.isRequired,
};

export default MobileMediaDetails;
