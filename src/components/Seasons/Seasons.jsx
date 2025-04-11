/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import { useToast } from '../../contexts/ToastProvider';
import SearchForm from '../SearchForm/SearchForm';
import BackwardButton from '../../vendor/BackwardButton/BackwardButton';
import { tvSeasonsData } from '../../utils/api/TvSeasonsApi';
import './Seasons.css';
import ScrollToTopButton from '../../vendor/ScrollToTopButton/ToTopButton';
import ScrollToEndButton from '../../vendor/ScrollToEndButton/ScrollToEndButton';
import LazyLoadWrapper from '../LazyLoadWrapper/LazyLoadWrapper';
import SeasonCard from './SeasonCard/SeasonCard';

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
                  <LazyLoadWrapper
                    component={SeasonCard}
                    data={season}
                    imageField="poster"
                    dataPropName="season"
                  />
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
