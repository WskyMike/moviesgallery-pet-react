// backend/transformSeoData.js
import countries from "i18n-iso-countries";
import ruLocale from "i18n-iso-countries/langs/ru.json";
import find from "lang-codes";

countries.registerLocale(ruLocale);

// Форматирование времени 
function formatRuntime(runtime) {
    if (!runtime) return "-";
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours > 0 ? hours + " час" + (hours > 1 ? "а" : "") : ""} ${minutes} минут`.trim();
}

// Форматирование даты
function formatDate(dateString) {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

// Извлечение года из даты
function formatYear(dateString) {
    if (!dateString) return "-";
    return new Date(dateString).getFullYear();
}

// Форматирование суммы в валюту USD
function formatCurrency(amount) {
    if (!amount || amount <= 0) return "-";
    return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Преобразует данные для страницы фильма для SEO.
 */
export async function transformSeoMovieData(item) {
    return {
        id: item.id,
        media_type: "movie",
        title: item.title,
        original_title: item.title !== item.original_title ? item.original_title : null,
        release_year: formatYear(item.release_date),
        rating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : "-",
        genres: item.genres.map(
            (genre) => genre.name.charAt(0).toUpperCase() + genre.name.slice(1)
        ),
        production_countries: item.production_countries
            ? item.production_countries
                .map(country => countries.getName(country.iso_3166_1, "ru") || country.name)
                .join(", ")
            : "-",
        original_language: item.original_language ? find(item.original_language).name : "-",
        runtime: formatRuntime(item.runtime),
        release_date: formatDate(item.release_date),
        budget: formatCurrency(item.budget),
        revenue: formatCurrency(item.revenue),
        overview: item.overview || "",
        tagline: item.tagline ? item.tagline.replace(/['"«»„“”]/g, "") : null,
        production_companies: item.production_companies
            ? item.production_companies.map((company) => company.name).join(", ")
            : "-",
    };
}

/**
 * Преобразует данные для страницы сериала для SEO.
 */
export async function transformSeoTvData(item) {
    const lastEpisode = item.last_episode_to_air
        ? formatDate(item.last_episode_to_air.air_date)
        : "-";
    const nextEpisode = item.next_episode_to_air
        ? formatDate(item.next_episode_to_air.air_date)
        : "-";

    return {
        id: item.id,
        media_type: "tv",
        name: item.name,
        original_name: item.name !== item.original_name ? item.original_name : null,
        first_air_year: formatYear(item.first_air_date),
        rating: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : "-",
        genres: item.genres.map(
            (genre) => genre.name.charAt(0).toUpperCase() + genre.name.slice(1)
        ),
        production_countries: item.production_countries
            ? item.production_countries
                .map(country => countries.getName(country.iso_3166_1, "ru") || country.name)
                .join(", ")
            : "-",
        original_language: item.original_language ? find(item.original_language).name : "-",
        episode_run_time:
            item.episode_run_time && item.episode_run_time.length > 0
                ? `${item.episode_run_time[0]} минут`
                : "-",
        first_air_date: formatDate(item.first_air_date),
        last_episode_to_air: lastEpisode,
        next_episode_to_air: nextEpisode,
        overview: item.overview || "",
        tagline: item.tagline ? item.tagline.replace(/['"«»„“”]/g, "") : null,
        production_companies: item.production_companies
            ? item.production_companies.map((company) => company.name).join(", ")
            : "-",
        creator: item.created_by?.length
            ? item.created_by
                .map((creator) => creator.name || creator.original_name)
                .join(", ")
            : "-",
    };
}

export async function transformSeoMoviesCreditsData(data) {
    // Режиссеры
    const directors = data.crew
        .filter(person => person.job === "Director")
        .map(director => director.name)
        .join(", ");

    // Актеры – преобразуем сразу в строку
    const actors = data.cast
        .filter(actor => actor.known_for_department === "Acting")
        .map(actor => actor.name)
        .join(", ");

    return {
        directors,
        actors,
    };
}

export async function transformSeoTvCreditsData(data) {
    // Для сериалов возвращаем строку с именами актеров
    const actors = data.cast
        .filter(actor => actor.known_for_department === "Acting")
        .slice(0, 100)
        .map(actor => actor.name)
        .join(", ");

    return {
        actors,
    };
}
