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
    title: item.title,
    name: item.name,
    original_title:
      item.title !== item.original_title ? item.original_title : null,
    original_name: item.name !== item.original_name ? item.original_name : null,
    release_date: item.release_date
      ? new Date(item.release_date).getFullYear()
      : "-",
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
      id: item.id,
      title: item.title,
      name: item.name,
      original_title:
        item.title !== item.original_title ? item.original_title : null,
      original_name:
        item.name !== item.original_name ? item.original_name : null,
      release_date: item.release_date
        ? new Date(item.release_date).getFullYear()
        : "-",
      first_air_date: item.first_air_date
        ? new Date(item.first_air_date).getFullYear()
        : "-",
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
