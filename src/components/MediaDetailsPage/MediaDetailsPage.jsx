/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense, useCallback } from 'react';
import { useLoading } from '../../contexts/LoadingContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useToast } from '../../contexts/ToastProvider.jsx';
import {
  toggleBookmark,
  checkBookmarkStatus,
} from '../../utils/firebase/BookmarkUtils.js';
import { movieDetailsData } from '../../utils/api/MovieDetailApi.js';
import { creditsMovieData } from '../../utils/api/CreditsMovieApi.js';
import { videosData } from '../../utils/api/VideosApi.js';
import { tvDetailsData } from '../../utils/api/TvDetailApi.js';
import { tvVideosData } from '../../utils/api/TvVideosApi.js';

// Ленивая загрузка компонентов
const MobileMediaDetails = lazy(
  () => import('./MobileMediaDetails/MobileMediaDetails.jsx')
);
const DesktopMediaDetails = lazy(
  () => import('./DesktopMediaDetails/DesktopMediaDetails.jsx')
);
const ActorsCarousel = lazy(
  () => import('../ActorsCarousel/ActorsCarousel.jsx')
);
const RecommendationsCarousel = lazy(
  () => import('./RecommendationsCarousel/RecommendationsCarousel.jsx')
);
const TrailerModal = lazy(() => import('../TrailerModal/TrailerModal.jsx'));

import SearchForm from '../SearchForm/SearchForm.jsx';
import { translateText } from '../../utils/other/translateUtils.js';
import useMobileLayout from '../../hooks/useMobileLayout.jsx';
import './MediaDetailsPage.css';
import { Container, Row } from 'react-bootstrap';

function MediaDetailsPage({ type }) {
  const { id } = useParams();
  const { triggerToast } = useToast();
  const { user, authLoading } = useAuth();
  const isMobile = useMobileLayout();
  const { movieDetailsLoading, setMovieDetailsLoading } = useLoading();
  const [media, setMedia] = useState(null);
  const [movieCreators, setMovieCreators] = useState({
    directors: [],
    screenwriters: [],
  });
  const [videoKeys, setVideoKeys] = useState([]);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loadingTrailer, setLoadingTrailer] = useState(true);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  // Функция установки title страницы
  function setDocumentTitle(media) {
    if (media) {
      const title = media?.title || media?.name;
      const originalTitle = media?.original_title || media?.original_name;
      document.title = title
        ? originalTitle && title !== originalTitle
          ? `${title} • ${originalTitle}`
          : title
        : 'Киногалерея';
    } else {
      document.title = 'Киногалерея';
    }
  }

  // Функция установки мета-тега description
  const defaultDescription =
    'Популярные новинки, рейтинги лучших картин и актуальные премьеры. Присоединяйтесь и создавайте персональные подборки любимого кино.';

  function setMetaDescription(media) {
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        media?.overview || defaultDescription
      );
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = media?.overview || defaultDescription;
      document.head.appendChild(meta);
    }
  }

  // Обработчики для модального окна трейлера
  const handleCloseTrailer = () => setShowTrailer(false);
  const handleShowTrailer = () => setShowTrailer(true);

  useEffect(() => {
    setDocumentTitle(media);
    setMetaDescription(media);
    return () => {
      document.title = 'Киногалерея';
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute('content', defaultDescription);
      }
    };
  }, [media]);

  // Функция перевода описания
  const translateOverview = async (englishText) => {
    setIsTranslating(true);
    try {
      const translatedText = await translateText(englishText);
      setMedia((prev) => ({
        ...prev,
        overview: translatedText,
        isTranslated: true,
      }));
    } catch (err) {
      setError(err.message);
      triggerToast(
        'Ошибка перевода описания',
        'danger-subtle',
        'danger-emphasis'
      );
    } finally {
      setIsTranslating(false);
    }
  };

  // Запрос API в зависимости от типа контента
  const fetchMediaDetails = async () => {
    try {
      setMovieDetailsLoading(true);
      const data =
        type === 'movie' ? await movieDetailsData(id) : await tvDetailsData(id);
      setMedia(data);

      if (data.needsTranslation && data.englishOverview) {
        translateOverview(data.englishOverview); // Запускаем перевод асинхронно
      }

      if (type === 'movie') {
        const movieCreatorsData = await creditsMovieData(id);
        setMovieCreators(movieCreatorsData);
      }
    } catch (err) {
      setError(err.message);
      triggerToast(
        `Ошибка загрузки данных (${err.message})`,
        'danger-subtle',
        'danger-emphasis'
      );
    } finally {
      setMovieDetailsLoading(false);
    }
  };

  // Запрос видео-трейлера
  const fetchVideos = async () => {
    try {
      const keys =
        type === 'movie' ? await videosData(id) : await tvVideosData(id);
      setVideoKeys(keys);
      setLoadingTrailer(false);
    } catch (err) {
      setError(err.message);
      triggerToast(
        `Ошибка загрузки видео-трейлера (${err.message})`,
        'danger-subtle',
        'danger-emphasis'
      );
    }
  };

  // Проверяем, есть ли фильм/сериал в закладках
  useEffect(() => {
    if (user && id && media?.media_type) {
      checkBookmarkStatus({
        userId: user.uid,
        itemId: id,
        mediaType: media.media_type,
        setIsBookmarked,
        triggerToast,
      });
    }
  }, [user, id, media?.media_type, triggerToast]);

  // Добавление или удаление из закладок
  const handleBookmarkClick = () => {
    if (authLoading || !user) {
      triggerToast('Необходимо войти в аккаунт');
      return;
    }

    toggleBookmark({
      userId: user.uid,
      itemId: id,
      mediaType: media.media_type,
      isBookmarked,
      setIsBookmarked,
      triggerToast,
    });
  };

  // Основные данные
  useEffect(() => {
    setMovieDetailsLoading(true);
    window.scrollTo(0, 0);
    fetchMediaDetails();
  }, [id]);

  // Трейлеры после загрузки media
  useEffect(() => {
    if (media) {
      fetchVideos();
    }
  }, [media]);

  // Показываем кнопку только при переходе с других сайтов
  useEffect(() => {
    const referrer = document.referrer;
    if (!referrer || !referrer.startsWith(window.location.origin)) {
      setShowButton(true);
    }
  }, []);

  // Обработчик клика по кинокомпании
  const openSearchInYandex = (companyName) => {
    const searchQuery = encodeURIComponent(companyName);
    window.open(`https://yandex.ru/search/?text=${searchQuery}`, '_blank');
  };

  // Функция для рендеринга описания фильма/сериала
  // Используем useCallback потому что передаем в дочерние компоненты
  const renderOverview = useCallback(() => {
    return (
      <div className="mediadetails__overview position-relative">
        <p className="text-start">
          {isTranslating ? (
            <span>
              Идет перевод описания...&nbsp;{' '}
              <div className="spinner-grow spinner-grow-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </span>
          ) : media?.overview && media.overview.trim() !== '' ? (
            <>{media.overview}</>
          ) : (
            'Нет описания'
          )}
        </p>
      </div>
    );
  }, [isTranslating, media?.overview]);

  if (movieDetailsLoading) {
    return (
      <div className="spinner-border text-primary m-5" role="status">
        <span className="visually-hidden">Загрузка...</span>
      </div>
    );
  }

  if (error) {
    return <div className="m-5">Ошибка: {error}</div>;
  }

  return (
    <>
      <SearchForm />
      <section className="mediadetails-content-wrapper">
        {/* Модальное окно с трейлером */}
        <Suspense fallback={<div></div>}>
          <TrailerModal
            videoKeys={videoKeys}
            title={type === 'movie' ? media?.title : media?.name}
            show={showTrailer}
            handleClose={handleCloseTrailer}
          />
        </Suspense>

        {/* Рендер в зависимости от типа устройства */}
        <Suspense fallback={<div></div>}>
          {isMobile ? (
            <MobileMediaDetails
              media={media}
              type={type}
              id={id}
              movieCreators={movieCreators}
              videoKeys={videoKeys}
              loadingTrailer={loadingTrailer}
              isHovered={isHovered}
              isBookmarked={isBookmarked}
              showButton={showButton}
              setIsHovered={setIsHovered}
              handleBookmarkClick={handleBookmarkClick}
              handleShowTrailer={handleShowTrailer}
              renderOverview={renderOverview} // Передаем функцию рендеринга описания (render prop pattern)
            />
          ) : (
            <DesktopMediaDetails
              media={media}
              type={type}
              id={id}
              movieCreators={movieCreators}
              videoKeys={videoKeys}
              loadingTrailer={loadingTrailer}
              isHovered={isHovered}
              isBookmarked={isBookmarked}
              showButton={showButton}
              setIsHovered={setIsHovered}
              handleBookmarkClick={handleBookmarkClick}
              handleShowTrailer={handleShowTrailer}
              renderOverview={renderOverview} // Передаем функцию рендеринга описания (render prop pattern)
              openSearchInYandex={openSearchInYandex}
            />
          )}
        </Suspense>

        <div className="d-none media-content-loaded"></div>

        <Container fluid="lg">
          <Suspense
            fallback={
              <div className="spinner-border text-primary m-5" role="status">
                <span className="visually-hidden">Загрузка...</span>
              </div>
            }>
            <Row className="mx-0 px-0 mt-5 pb-4 mt-lg-5">
              <h3 className="text-start fw-bold fs-5 ps-0 mb-4">
                Актёрский состав
              </h3>
              <ActorsCarousel />
            </Row>
            <Row className="mx-0 px-0 mt-5 mt-lg-5">
              <h3 className="text-start fw-bold fs-5 ps-0 mb-3">
                Рекомендуемые {type === 'movie' ? 'фильмы' : 'сериалы'}
              </h3>
              <RecommendationsCarousel />
            </Row>
          </Suspense>
        </Container>
      </section>
    </>
  );
}

MediaDetailsPage.propTypes = {
  type: PropTypes.string.isRequired,
};

export default MediaDetailsPage;
