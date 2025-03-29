/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { useToast } from '../../contexts/ToastProvider';
import SearchForm from '../SearchForm/SearchForm';
import BackwardButton from '../../vendor/BackwardButton/BackwardButton';
import { tvSeasonsData } from '../../utils/TvSeasonsApi';
import './Seasons.css';
import ScrollToTopButton from '../../vendor/ScrollToTopButton/ToTopButton';
import ScrollToEndButton from '../../vendor/ScrollToEndButton/ScrollToEndButton';

import countries from 'i18n-iso-countries';
import ruLocale from 'i18n-iso-countries/langs/ru.json';

countries.registerLocale(ruLocale);

function Seasons() {
  const { id } = useParams(); // Получаем ID фильма из URL

  const [movieDetailsLoading, setMovieDetailsLoading] = useState();
  const [error, setError] = useState(null);
  const [fetchedSeasons, setFetchedSeasons] = useState(null);
  const { triggerToast } = useToast();

  async function fetchTvDetails() {
    try {
      setMovieDetailsLoading(true);
      const data = await tvSeasonsData(id);
      setFetchedSeasons(data);
    } catch (err) {
      setError(err.message);
      console.error(err);
      triggerToast(
        `Ошибка запроса данных (${err.message})`,
        'danger-subtle',
        'danger-emphasis'
      );
    } finally {
      setMovieDetailsLoading(false);
    }
  }

  useEffect(() => {
    fetchTvDetails();
  }, [id]);

  if (error) {
    return <div className="m-5">Ошибка: {error}</div>;
  }

  return (
    <section className="seasons">
      <Container fluid="xxl">
        <ScrollToTopButton />
        <ScrollToEndButton />
        <BackwardButton />
        <SearchForm />
        {movieDetailsLoading && (
          <div className="d-flex justify-content-center my-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
          </div>
        )}
        {!movieDetailsLoading && (
          <Container fluid="xl" className="px-0 px-md-3">
            <Row className="pt-2">
              <h2 className="text-start display-5">
                {fetchedSeasons?.series_name}
              </h2>
            </Row>
            <Col className="my-5">
              {fetchedSeasons?.seasons.map((season, index) => (
                <div key={season.season_number}>
                  <Card className="border-0 text-start seasons_card my-4 w-100">
                    <Row>
                      <Col xs={4} sm={2}>
                        <Card.Img
                          src={season.poster}
                          alt={`Poster of ${season.name}`}
                          className="img-fluid"
                        />
                      </Col>
                      <Col xs={8} sm={10} className="d-flex">
                        <Card.Body className="d-flex flex-column ps-0 ps-md-5 pt-0 pe-0 pe-md-3">
                          <Card.Title className="fw-semibold">
                            {season.name}
                          </Card.Title>
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
                              fontSize:
                                window.innerWidth <= 576 ? '0.8em' : '0.875em',
                            }}>
                            {/* <BsFilm /> &nbsp; */}
                            {season.air_date ? (
                              new Date(season.air_date) > new Date() ? (
                                <>
                                  Выход сезона планируется{' '}
                                  <span className="d-md-none">
                                    <br />
                                  </span>
                                  {new Date(season.air_date).toLocaleDateString(
                                    'ru-RU',
                                    {
                                      day: '2-digit',
                                      month: 'long',
                                      year: 'numeric',
                                    }
                                  )}
                                </>
                              ) : (
                                <>
                                  Сезон вышел{' '}
                                  <span className="d-md-none">
                                    <br />
                                  </span>
                                  {new Date(season.air_date).toLocaleDateString(
                                    'ru-RU',
                                    {
                                      day: '2-digit',
                                      month: 'long',
                                      year: 'numeric',
                                    }
                                  )}
                                </>
                              )
                            ) : (
                              'Нет данных или сезон ещё не вышел'
                            )}
                          </Card.Text>
                          <Card.Text
                            style={{
                              fontSize:
                                window.innerWidth <= 576 ? '0.8em' : '0.875em',
                            }}>
                            {season.overview}
                          </Card.Text>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                  {index !== fetchedSeasons.seasons.length - 1 && <hr />}
                </div>
              ))}
            </Col>
          </Container>
        )}
      </Container>
    </section>
  );
}

export default Seasons;
