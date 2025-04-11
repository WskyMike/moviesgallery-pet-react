/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useSearch } from '../../contexts/SearchContext';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import ScrollToTopButton from '../../vendor/ScrollToTopButton/ToTopButton';
import ScrollToEndButton from '../../vendor/ScrollToEndButton/ScrollToEndButton';
import BackwardButton from '../../vendor/BackwardButton/BackwardButton';
import SearchForm from '../SearchForm/SearchForm';
import { SearchApi } from '../../utils/api/SearchApi';
import { GenresApi } from '../../utils/api/GenresApi';
import LazyLoadWrapper from '../LazyLoadWrapper/LazyLoadWrapper';
import SearchResultCard from './SearchResultCard/SearchResultCard';

import './SearchResult.css';

function SearchResults() {
  const { searchTrigger } = useSearch();
  const [selectedCategory, setSelectedCategory] = useState('movie');
  const [isLoading, setIsLoading] = useState(true);
  const [filteredResults, setFilteredResults] = useState([]);
  const [movieCount, setMovieCount] = useState(0);
  const [tvCount, setTvCount] = useState(0);
  const [searchCache, setSearchCache] = useState({ query: '', results: [] });
  const [genresCache, setGenresCache] = useState({ movie: [], tv: [] });

  // Загружаем жанры
  useEffect(() => {
    async function fetchAllGenres() {
      try {
        const [movieGenresData, tvGenresData] = await Promise.all([
          GenresApi(false), // Фильмы
          GenresApi(true), // Сериалы
        ]);
        const movieGenres = movieGenresData.genres.map((genre) => ({
          ...genre,
          name: genre.name.charAt(0).toUpperCase() + genre.name.slice(1),
        }));
        const tvGenres = tvGenresData.genres.map((genre) => ({
          ...genre,
          name: genre.name.charAt(0).toUpperCase() + genre.name.slice(1),
        }));
        setGenresCache({ movie: movieGenres, tv: tvGenres });
      } catch (error) {
        console.error('Ошибка загрузки жанров:', error);
      }
    }
    fetchAllGenres();
  }, []);

  // Преобразование числовых ID жанров в текстовые названия
  const mapGenresToNames = (item, genresList) => {
    const genreNames = item.genres
      .map((genreId) => genresList.find((g) => g.id === genreId)?.name)
      .filter(Boolean);
    return { ...item, genreNames }; // Добавляем новое поле genreNames
  };

  // Обработчик изменения в sessionStorage и кэширование результатов
  const handleStorageChange = async () => {
    const query = sessionStorage.getItem('searchQuery');
    if (!query) {
      setFilteredResults([]);
      setIsLoading(false);
      return;
    }

    // Если кэш жанров еще не загружен, ждем его
    if (genresCache.movie.length === 0 || genresCache.tv.length === 0) {
      setIsLoading(true);
      return;
    }

    // Проверяем, есть ли данные в кэше для текущего запроса
    if (searchCache.query === query && searchCache.results.length > 0) {
      const filtered = searchCache.results.filter(
        (item) => item.media_type?.toLowerCase() === selectedCategory
      );
      setFilteredResults(filtered);
      setMovieCount(
        searchCache.results.filter((item) => item.media_type === 'movie').length
      );
      setTvCount(
        searchCache.results.filter((item) => item.media_type === 'tv').length
      );
      setIsLoading(false);
      return;
    }

    // Если данных в кэше нет, делаем запрос к API
    setIsLoading(true);
    try {
      // Запрашиваем только 2 страницы (временно)
      const [dataPage1, dataPage2] = await Promise.all([
        SearchApi(query, 1),
        SearchApi(query, 2),
      ]);

      const combinedResults = [...dataPage1.result, ...dataPage2.result].map(
        (item) =>
          mapGenresToNames(
            item,
            item.media_type === 'movie' ? genresCache.movie : genresCache.tv
          )
      );

      const filtered = combinedResults.filter(
        (item) => item.media_type?.toLowerCase() === selectedCategory
      );

      // Обновляем кэш с результатами, включая текстовые жанры
      setSearchCache({ query, results: combinedResults });
      setFilteredResults(filtered);
      setMovieCount(dataPage1.movieCount + dataPage2.movieCount);
      setTvCount(dataPage1.tvCount + dataPage2.tvCount);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      setFilteredResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleStorageChange();
  }, [selectedCategory, searchTrigger, genresCache]);

  return (
    <Container fluid="xxl">
      <ScrollToTopButton />
      <ScrollToEndButton />
      <BackwardButton />
      <SearchForm />
      <Container fluid="xl">
        <Row>
          {/* Левая колонка */}
          <Col md={3} className="mb-5 mb-md-0">
            <ListGroup variant="flush">
              <ListGroup.Item
                as="button"
                action
                active={selectedCategory === 'movie'}
                onClick={() => setSelectedCategory('movie')}
                className="d-flex justify-content-between align-items-center search-results__custom-active rounded border-0">
                Фильмы
                <span className="badge bg-primary rounded-pill fw-normal">
                  {movieCount || ''}
                </span>
              </ListGroup.Item>
              <ListGroup.Item
                as="button"
                action
                active={selectedCategory === 'tv'}
                onClick={() => setSelectedCategory('tv')}
                className="d-flex justify-content-between align-items-center search-results__custom-active rounded border-0 mt-0">
                Сериалы
                <span className="badge bg-primary rounded-pill fw-normal">
                  {tvCount || ''}
                </span>
              </ListGroup.Item>
            </ListGroup>
          </Col>

          {/* Правая колонка */}
          <Col md={9}>
            {isLoading ? (
              <div className="d-flex justify-content-center my-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Загрузка...</span>
                </div>
              </div>
            ) : filteredResults.length > 0 ? (
              filteredResults.map((item) => (
                <LazyLoadWrapper
                  key={item.id}
                  component={SearchResultCard} // компонент для рендеринга.
                  data={item} // данные для передачи в компонент
                  imageField="poster" // поле с URL изображения.
                  dataPropName="item" // имя пропса для передачи данных в SearchResultCard
                  isLoading={isLoading}
                />
              ))
            ) : (
              <div className="text-muted">
                Ничего не найдено для выбранной категории.
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default SearchResults;
