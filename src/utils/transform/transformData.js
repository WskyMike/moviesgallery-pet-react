import countries from 'i18n-iso-countries';
import ruLocale from 'i18n-iso-countries/langs/ru.json';
import find from 'lang-codes';

countries.registerLocale(ruLocale);

const fallbackSrc = '/placeholder-card.webp';

function getPosterPath(poster_path) {
  return poster_path
    ? `https://movieapiproxy.tw1.ru/t/p/w500${poster_path}`
    : fallbackSrc;
}

function getBackdropPath(backdrop_path) {
  return backdrop_path
    ? `https://movieapiproxy.tw1.ru/t/p/w500${backdrop_path}`
    : fallbackSrc;
}

export async function transformSingleMovieData(item) {
  return {
    id: item.id,
    media_type: 'movie',
    title: item.title,
    original_title:
      item.title !== item.original_title ? item.original_title : null,
    release_date: item.release_date
      ? new Date(item.release_date).getFullYear()
      : '-',
    poster: getPosterPath(item.poster_path),
    rating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : '',
  };
}

export async function transformSingleTvData(item) {
  return {
    id: item.id,
    media_type: 'tv',
    name: item.name,
    original_name: item.name !== item.original_name ? item.original_name : null,
    first_air_date: item.first_air_date
      ? new Date(item.first_air_date).getFullYear()
      : '-',
    poster: getPosterPath(item.poster_path),
    rating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : '',
  };
}

export async function transformMovieData(data) {
  const totalPages = data.total_pages;

  const movies = await Promise.all(
    data.results.map(async (item) => ({
      media_type: 'movie',
      id: item.id,
      title: item.title || null,
      original_title:
        item.title !== item.original_title ? item.original_title : null,
      release_date: item.release_date
        ? new Date(item.release_date).getFullYear()
        : null,
      poster: getPosterPath(item.poster_path),
      rating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : '',
      original_language: item.original_language || '',
    }))
  );

  return { movies, totalPages };
}

export async function transformTvData(data) {
  const totalPages = data.total_pages;

  const movies = await Promise.all(
    data.results.map(async (item) => ({
      media_type: 'tv',
      id: item.id,
      name: item.name || null,
      original_name:
        item.name !== item.original_name ? item.original_name : null,
      first_air_date: item.first_air_date
        ? new Date(item.first_air_date).getFullYear()
        : null,
      poster: getPosterPath(item.poster_path),
      rating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : '',
    }))
  );

  return { movies, totalPages };
}

export async function transformMovieDetailsData(item) {
  return {
    genres: item.genres.map(
      (genre) => genre.name.charAt(0).toUpperCase() + genre.name.slice(1)
    ),
    id: item.id,
    media_type: 'movie',
    production_countries: item.production_countries
      ? item.production_countries
          .map(
            (country) =>
              countries.getName(country.iso_3166_1, 'ru') || country.name
          )
          .join(', ')
      : '-',
    runtime: item.runtime
      ? `${Math.floor(item.runtime / 60)} час${
          Math.floor(item.runtime / 60) === 1 ? '' : 'а'
        } ${item.runtime % 60} минут`
      : '',
    title: item.title,
    original_title:
      item.title !== item.original_title ? item.original_title : null,
    original_language: item.original_language
      ? find(item.original_language).name
      : '-',
    overview: item.overview,
    release_date: item.release_date
      ? new Date(item.release_date).toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      : '-',
    release_year: item.release_date
      ? new Date(item.release_date).getFullYear()
      : '-',
    first_air_date: item.first_air_date
      ? new Date(item.first_air_date).getFullYear()
      : '-',
    budget:
      item.budget !== undefined && item.budget > 0
        ? new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(item.budget)
        : '-',
    revenue:
      item.revenue !== undefined && item.revenue > 0
        ? new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(item.revenue)
        : '-',
    production_companies: item.production_companies
      ? item.production_companies.map((company) => company.name).join(', ')
      : 'Нет информации',
    tagline: item.tagline ? item.tagline.replace(/['"«»„“”]/g, '') : null,
    poster: getPosterPath(item.poster_path),
    // backdrop: `https://movieapiproxy.tw1.ru/t/p/w1280${item.backdrop_path}`,
    rating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : '0',
    // rating: item.vote_average
    //   ? `${(item.vote_average * 10).toFixed(0)}%`
    //   : 'n/a',
  };
}

export async function transformTvDetailsData(item) {
  const statusTranslations = {
    'Returning Series': 'Продолжается',
    Planned: 'Запланирован',
    'In Production': 'В производстве',
    Ended: 'Завершился',
    Canceled: 'Отменён',
    Pilot: 'Пилотный выпуск',
  };

  const lastProductionSeason = item.seasons
    ?.filter(
      (season) => season.air_date && new Date(season.air_date) <= new Date()
    ) // Только сезоны с прошедшей датой выхода
    .at(-1); // Берем последний такой сезон

  return {
    name: item.name || null,
    original_name: item.name !== item.original_name ? item.original_name : null,
    genres: item.genres.map(
      (genre) => genre.name.charAt(0).toUpperCase() + genre.name.slice(1)
    ),
    id: item.id,
    media_type: 'tv',
    episode_run_time:
      item.episode_run_time && item.episode_run_time.length > 0
        ? `${item.episode_run_time[0]} минут`
        : null,
    status: statusTranslations[item.status] || 'Неизвестен',
    production_countries: item.production_countries
      ? item.production_countries
          .map(
            (country) =>
              countries.getName(country.iso_3166_1, 'ru') || country.name
          )
          .join(', ')
      : null,

    original_language: item.original_language
      ? find(item.original_language).name
      : '-',
    overview: item.overview,
    first_air_year: item.first_air_date
      ? new Date(item.first_air_date).getFullYear()
      : null,
    first_air_date: item.first_air_date
      ? new Date(item.first_air_date).toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      : '-',
    last_air_date: item.last_air_date
      ? new Date(item.last_air_date).toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      : '-',
    last_air_year: item.last_air_date
      ? new Date(item.last_air_date).getFullYear()
      : null,
    production_companies: item.production_companies
      ? item.production_companies.map((company) => company.name).join(', ')
      : '-',
    poster: getPosterPath(item.poster_path),
    // backdrop: `https://movieapiproxy.tw1.ru/t/p/w1280${item.backdrop_path}`,
    rating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : '0',
    creator: item.created_by?.length
      ? item.created_by
          .map((creator) => creator.name || creator.original_name)
          .join(', ')
      : '-',
    tagline: item.tagline ? item.tagline.replace(/['"«»„“”]/g, '') : null,
    // Последний сезон
    last_production_season: lastProductionSeason
      ? {
          name: lastProductionSeason.name,
          air_date: lastProductionSeason.air_date
            ? new Date(lastProductionSeason.air_date).toLocaleDateString(
                'ru-RU',
                {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                }
              )
            : '-',
          episode_count: lastProductionSeason.episode_count,
          season_poster_path: getPosterPath(lastProductionSeason.poster_path),
          vote_average: lastProductionSeason.vote_average,
        }
      : null,
    last_episode_to_air: item.last_episode_to_air?.air_date
      ? new Date(item.last_episode_to_air.air_date).toLocaleDateString(
          'ru-RU',
          {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }
        )
      : '-',
    next_episode_to_air: item.next_episode_to_air?.air_date
      ? new Date(item.next_episode_to_air.air_date).toLocaleDateString(
          'ru-RU',
          {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }
        )
      : null,
  };
}

export async function transformTvSeasonsData(data) {
  return {
    series_name: data.name || '-',
    // series_original_name: data.original_name || null,
    seasons: data.seasons.map((season) => ({
      air_date: season.air_date || null,
      episode_count: season.episode_count || 'Неизвестно сколько',
      name: season.name || `Сезон ${season.season_number}`,
      overview: season.overview || 'Описание отсутствует',
      poster: getPosterPath(season.poster_path),
      season_number: season.season_number,
      vote_average: season.vote_average || '-',
    })),
  };
}

export async function transformRecommendationData(data) {
  const recommendationsData = await Promise.all(
    data.results.map(async (item) => ({
      id: item.id,
      media_type: item.media_type,
      title: item.title || item.name,
      // original_title:
      //   item.title !== item.original_title ? item.original_title : null,
      release_date: item.release_date
        ? new Date(item.release_date).getFullYear()
        : item.first_air_date
          ? new Date(item.first_air_date).getFullYear()
          : '-',
      backdrop: getBackdropPath(item.backdrop_path),
      rating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : '',
    }))
  );

  return recommendationsData;
}
