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
import CustomGradientButton from '../../CustomButton/CustomGradientButton.jsx';
import BackdropColorExtractor from '../../../utils/other/BackdropColorExtractor.jsx';
import LastSeasonCard from '../../Seasons/LastSeasonCard/LastSeasonCard.jsx';

function DesktopMediaDetails({
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
  openSearchInYandex,
}) {
  return (
    <div>
      <BackdropColorExtractor
        backdropUrl={media?.backdrop || ''}
        className="mediadetails-backdrop">
        <Container fluid="lg">
          <Row className="justify-content-center text-white">
            {/* Левая колонка с постером и кнопкой трейлера */}
            <Col md={4} className="pe-4">
              {/* Постер */}
              <div className="poster-container mb-3">
                {media?.poster ? (
                  <img
                    src={media.poster}
                    alt={media.title || media.name}
                    className="img-fluid rounded-3"
                    loading="lazy"
                  />
                ) : (
                  <div>Здесь должен быть постер, но его нет.</div>
                )}
              </div>

              {/* Кнопка смотреть трейлер */}
              <div className="mt-4">
                <Button
                  variant="btn btn-light"
                  className="rounded-3 border-0 w-100 fw-bold youtube-button"
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
              </div>
            </Col>

            {/* Правая колонка с информацией */}
            <Col md={8}>
              {/* Название + оригинальное название */}
              <Row className="mb-3">
                <div>
                  <h1
                    className="fs-2 text-md-start text-center fw-bold"
                    style={{ letterSpacing: '0.5px' }}>
                    {media?.title || media?.name}
                    <small className="fw-light">
                      &nbsp;(
                      {type === 'movie'
                        ? media?.release_year || ''
                        : `${media?.first_air_year || null} - ${
                            media?.status === 'Завершился' ||
                            media?.status === 'Отменён'
                              ? media?.last_air_year
                              : '...'
                          }`}
                      )
                    </small>
                  </h1>{' '}
                  <h2 className="fs-5 text-md-start text-center original-title">
                    {media?.original_title || media?.original_name}
                  </h2>
                </div>
              </Row>

              {/* Жанр, продолжительность, страна */}
              <Row className="mb-3">
                <div className="d-flex flex-wrap align-items-center gap-1">
                  {media?.genres?.map((genre, index) => (
                    <span key={index} className="badge me-1 genres-badge">
                      {genre}
                    </span>
                  ))}
                  {media?.production_countries && (
                    <>
                      <span className="mx-1">•</span>
                      <span className="">
                        <small>{media.production_countries}</small>
                      </span>
                    </>
                  )}
                  {(media?.runtime || media?.episode_run_time) && (
                    <>
                      <span className="mx-1">•</span>
                      <span className="">
                        <small>
                          {media?.runtime || media?.episode_run_time}
                        </small>
                      </span>
                    </>
                  )}
                </div>
              </Row>

              {/* Рейтинг и кнопка "Буду смотреть" */}
              <Row className="my-3">
                <div className="d-flex gap-5 align-items-center">
                  <div className="d-flex flex-column align-items-center">
                    <div style={{ color: '#cccccc' }}>Рейтинг TMDB:</div>
                    <div className="display-5">
                      <RatingIndicator rating={media?.rating} size={80} />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-light my-5 bookmark-button fw-bold border-0 rounded-2"
                    onClick={handleBookmarkClick}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}>
                    {isBookmarked ? (
                      <BookmarkStarFill
                        className="me-2 text-warning"
                        width="26"
                        height="26"
                      />
                    ) : isHovered ? (
                      <BookmarkStar
                        className="me-2 Bookmark-icon"
                        width="26"
                        height="26"
                      />
                    ) : (
                      <Bookmark className="me-2" width="26" height="26" />
                    )}
                    Буду смотреть
                  </button>
                </div>
              </Row>

              {/* Секция с информацией */}
              <Row className="mb-3 d-flex flex-column">
                {/* Секция с создателями фильма */}
                <div className="d-flex flex-wrap mb-4">
                  {type === 'movie' ? (
                    // Для фильмов отображаем режиссеров и сценаристов
                    <>
                      {movieCreators.directors.map((director) => (
                        <Col
                          xs={3}
                          className="mb-3 text-start px-2"
                          key={`director-${director.id}`}>
                          <div className="fw-bold">{director.name}</div>
                          <small>{director.job}</small>
                        </Col>
                      ))}
                      {movieCreators.screenwriters.map((writer) => (
                        <Col
                          xs={3}
                          className="mb-3 text-start px-2"
                          key={`writer-${writer.id}`}>
                          <div className="fw-bold">{writer.name}</div>
                          <small>{writer.job}</small>
                        </Col>
                      ))}
                    </>
                  ) : (
                    // Для сериалов отображаем создателей
                    <>
                      {media?.creators?.map((creator) => (
                        <Col
                          xs={3}
                          className="mb-3 text-start px-2"
                          key={`creator-${creator.id}`}>
                          <div className="fw-bold">{creator.name}</div>
                          <small>{creator.job}</small>
                        </Col>
                      ))}
                    </>
                  )}
                </div>

                {/* Дополнительная информация - начинается с новой строки */}
                <div className="d-flex flex-wrap mt-3 justify-content-between">
                  {/* Статус для сериалов */}
                  {type === 'tv' && media?.status && (
                    <Col xs={6} md={4} lg={3} className="mb-3 text-start px-1">
                      <div
                        className="small mb-1"
                        style={{
                          color: '#cccccc',
                        }}>
                        Статус
                      </div>
                      <div
                        className={`badge fw-bold ${
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
                      </div>
                    </Col>
                  )}
                  {/* Следующий эпизод для сериалов */}
                  {type === 'tv' && media?.next_episode_to_air && (
                    <Col xs={6} md={4} lg={3} className="mb-3 text-start px-1">
                      <div
                        className="small mb-1"
                        style={{
                          color: '#cccccc',
                        }}>
                        Следующий эпизод
                      </div>
                      <div>{media?.next_episode_to_air || '-'}</div>
                    </Col>
                  )}
                  {/* Дата выхода или первый эпизод*/}
                  <Col xs={6} md={4} lg={3} className="mb-3 text-start px-1">
                    <div className="small mb-1" style={{ color: '#cccccc' }}>
                      Дата выхода
                    </div>
                    <div className="fw-medium">
                      {type === 'movie'
                        ? media?.release_date || '-'
                        : media?.first_air_date || '-'}
                    </div>
                  </Col>

                  {/* Бюджет */}
                  {type === 'movie' && media?.budget && (
                    <Col xs={6} md={4} lg={3} className="mb-3 text-start px-1">
                      <div className="small mb-1" style={{ color: '#cccccc' }}>
                        Бюджет
                      </div>
                      <div className="fw-medium">{media?.budget}</div>
                    </Col>
                  )}

                  {/* Сборы в мире */}
                  {type === 'movie' && media?.revenue && (
                    <Col xs={6} md={4} lg={3} className="mb-3 text-start px-1">
                      <div className="small mb-1" style={{ color: '#cccccc' }}>
                        Сборы в мире
                      </div>
                      <div className="fw-medium">{media?.revenue}</div>
                    </Col>
                  )}

                  {/* Оригинальный язык */}
                  {media?.original_language && (
                    <Col xs={6} md={4} lg={3} className="mb-3 text-start px-1">
                      <div
                        className="small mb-1"
                        style={{
                          color: '#cccccc',
                        }}>
                        {' '}
                        Оригинальный язык
                      </div>
                      <div className="fw-medium">
                        {media?.original_language}
                      </div>
                    </Col>
                  )}
                </div>
              </Row>
            </Col>
          </Row>
        </Container>
      </BackdropColorExtractor>

      <Container fluid="lg">
        <Row className="mb-3 pt-5">
          {/* Кинокомпания */}
          <Col xs={4}>
            {media?.production_companies &&
              media.production_companies.length > 0 && (
                <div className="mb-3">
                  <div className="text-start">
                    <div className="small text-secondary mb-3">
                      Кинокомпания:
                    </div>
                    <div className="fw-bold">
                      {media?.production_companies.map((company, index) => (
                        <div
                          key={`company-${index}`}
                          onClick={() => openSearchInYandex(company)}
                          style={{
                            cursor: 'pointer',
                            textDecoration: 'none',
                          }}
                          className="company-link my-1">
                          {company}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
          </Col>

          {/* Описание */}
          <Col xs={8}>
            <Row>
              {media?.tagline && (
                <figure>
                  <VscQuote className="d-flex fs-4" />
                  <blockquote
                    className="fst-italic text-start text-secondary blockquote mt-1 ps-4"
                    style={{ fontSize: '0.9rem' }}>
                    <p>{media.tagline}</p>
                  </blockquote>
                </figure>
              )}
            </Row>
            <Row className="pb-3">
              {renderOverview()}
              {showButton && (
                <Row className="mt-4">
                  <CustomGradientButton />
                </Row>
              )}
            </Row>
            {/* Текущий сезон */}
            {type === 'tv' && media?.last_production_season && (
              <Row className="mb-3">
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
          </Col>
        </Row>
      </Container>
    </div>
  );
}

DesktopMediaDetails.propTypes = {
  media: PropTypes.object,
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  movieCreators: PropTypes.object.isRequired,
  videoKeys: PropTypes.array.isRequired,
  loadingTrailer: PropTypes.bool.isRequired,
  isHovered: PropTypes.bool.isRequired,
  isBookmarked: PropTypes.bool.isRequired,
  showButton: PropTypes.bool.isRequired,
  setIsHovered: PropTypes.func.isRequired,
  handleBookmarkClick: PropTypes.func.isRequired,
  handleShowTrailer: PropTypes.func.isRequired,
  renderOverview: PropTypes.func.isRequired,
  openSearchInYandex: PropTypes.func.isRequired,
};

export default DesktopMediaDetails;
