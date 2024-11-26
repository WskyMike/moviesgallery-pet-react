import countries from "i18n-iso-countries";
import ruLocale from "i18n-iso-countries/langs/ru.json";
import find from "lang-codes";

countries.registerLocale(ruLocale);

function getPosterPath(poster_path) {
  return `https://movieapiproxy.tw1.ru/t/p/w500${poster_path}`;
}

export async function transformSingleMovieData(item) {
  return {
    id: item.id,
    media_type: "movie",
    title: item.title,
    original_title:
      item.title !== item.original_title ? item.original_title : null,
    release_date: item.release_date
      ? new Date(item.release_date).getFullYear()
      : "-",
    poster: getPosterPath(item.poster_path),
    rating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : "",
  };
}

export async function transformSingleTvData(item) {
  return {
    id: item.id,
    media_type: "tv",
    name: item.name,
    original_name: item.name !== item.original_name ? item.original_name : null,
    first_air_date: item.first_air_date
      ? new Date(item.first_air_date).getFullYear()
      : "-",
    poster: getPosterPath(item.poster_path),
    rating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : "",
  };
}

export async function transformMovieData(data) {
  const totalPages = data.total_pages;

  const movies = await Promise.all(
    data.results.map(async (item) => ({
      media_type: "movie",
      id: item.id,
      title: item.title || null,
      original_title:
        item.title !== item.original_title ? item.original_title : null,
      release_date: item.release_date
        ? new Date(item.release_date).getFullYear()
        : null,
      poster: getPosterPath(item.poster_path),
      rating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : "",
    }))
  );

  return { movies, totalPages };
}

export async function transformTvData(data) {
  const totalPages = data.total_pages;

  const movies = await Promise.all(
    data.results.map(async (item) => ({
      media_type: "tv",
      id: item.id,
      name: item.name || null,
      original_name:
        item.name !== item.original_name ? item.original_name : null,
      first_air_date: item.first_air_date
        ? new Date(item.first_air_date).getFullYear()
        : null,
      poster: getPosterPath(item.poster_path),
      rating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : "",
    }))
  );

  return { movies, totalPages };
}

export async function transformMovieDetailsData(item) {
  return {
    genres: item.genres.map((genre) => genre.name),
    id: item.id,
    media_type: "movie",
    production_countries: item.production_countries
      ? item.production_countries
          .map(
            (country) =>
              countries.getName(country.iso_3166_1, "ru") || country.name
          )
          .join(", ")
      : "-",
    runtime: item.runtime
      ? `${Math.floor(item.runtime / 60)} час${
          Math.floor(item.runtime / 60) === 1 ? "" : "а"
        } ${item.runtime % 60} минут`
      : "-",
    title: item.title,
    original_title:
      item.title !== item.original_title ? item.original_title : null,
    original_language: item.original_language
      ? find(item.original_language).name
      : "-",
    overview: item.overview,
    release_date: item.release_date
      ? new Date(item.release_date).toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "-",
    release_year: item.release_date
      ? new Date(item.release_date).getFullYear()
      : "-",
    first_air_date: item.first_air_date
      ? new Date(item.first_air_date).getFullYear()
      : "-",
    budget:
      item.budget !== undefined && item.budget > 0
        ? new Intl.NumberFormat("ru-RU", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(item.budget)
        : "-",
    revenue:
      item.revenue !== undefined && item.revenue > 0
        ? new Intl.NumberFormat("ru-RU", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(item.revenue)
        : "-",
    production_companies: item.production_companies
      ? item.production_companies.map((company) => company.name).join(", ")
      : "Нет информации",
    tagline: item.tagline ? item.tagline.replace(/['"«»„“”]/g, "") : null,
    poster: getPosterPath(item.poster_path),
    // backdrop: `https://movieapiproxy.tw1.ru/t/p/w1280${item.backdrop_path}`,
    rating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : "-",
  };
}

export async function transformTvDetailsData(item) {
  const statusTranslations = {
    "Returning Series": "Продолжается",
    Planned: "Запланирован",
    "In Production": "В производстве",
    Ended: "Завершился",
    Canceled: "Отменён",
    Pilot: "Пилотный выпуск",
  };

  return {
    name: item.name || null,
    original_name: item.name !== item.original_name ? item.original_name : null,
    genres: item.genres.map((genre) => genre.name),
    id: item.id,
    media_type: "tv",
    episode_run_time:
      item.episode_run_time && item.episode_run_time.length > 0
        ? `${item.episode_run_time[0]} минут`
        : null,
    status: statusTranslations[item.status] || "Неизвестен",
    production_countries: item.production_countries
      ? item.production_countries
          .map(
            (country) =>
              countries.getName(country.iso_3166_1, "ru") || country.name
          )
          .join(", ")
      : null,

    original_language: item.original_language
      ? find(item.original_language).name
      : "-",
    overview: item.overview,
    first_air_year: item.first_air_date
      ? new Date(item.first_air_date).getFullYear()
      : null,
    first_air_date: item.first_air_date
      ? new Date(item.first_air_date).toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "-",
    last_air_date: item.last_air_date
      ? new Date(item.last_air_date).toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "-",
    last_air_year: item.last_air_date
      ? new Date(item.last_air_date).getFullYear()
      : null,
    production_companies: item.production_companies
      ? item.production_companies.map((company) => company.name).join(", ")
      : "Нет информации",
    poster: getPosterPath(item.poster_path),
    // backdrop: `https://movieapiproxy.tw1.ru/t/p/w1280${item.backdrop_path}`,
    rating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : "-",
    creator:
      item.created_by[0]?.name || item.created_by[0]?.original_name || "-",
    tagline: item.tagline ? item.tagline.replace(/['"«»„“”]/g, "") : null,
  };
}
