// Этот компонент формирует HTML-страницу для поисковых роботов
import PropTypes from "prop-types";

function SEOPage({ media, type, url }) {
  const title = media.title || media.name || "";
  const originalTitle = media.original_title || media.original_name || "";
  const year = media.release_year || media.first_air_year || "";
  const rating = media.rating ? media.rating.toString() : "-";
  const genres = Array.isArray(media.genres) ? media.genres.join(", ") : "-";
  const country = media.production_countries || "-";
  const originalLanguage = media.original_language || "";
  const duration = media.runtime || media.episode_run_time || "-";
  const releaseOrEpisodeDate =
    type === "movie" ? media.release_date : media.first_air_date;
  const budget = media.budget ? media.budget.toLocaleString("ru-RU") : "-";
  const revenue = media.revenue ? media.revenue.toLocaleString("ru-RU") : "-";
  const lastEpisode = media.last_episode_to_air || "-";
  const nextEpisode = media.next_episode_to_air || "-";
  const tagline = media.tagline || "";
  const production_companies = media.production_companies || "-";
  const overview =
    media.overview || "Нет описания, переведенного на русский язык";
  const directors = media.credits?.directors || "-";
  const actors = media.credits?.actors || "-";
  const creator = media.creator || "-";
  const poster = media.poster || "";

  // Формирование мета-тегов
  const metaTitle = title
    ? originalTitle && title !== originalTitle
      ? `${title} • ${originalTitle}`
      : title
    : "Киногалерея";
  const metaDescription =
    media.overview ||
    "Популярные новинки, рейтинги лучших картин и актуальные премьеры. Присоединяйтесь и создавайте персональные подборки любимого кино.";

  return (
    <html lang="ru">
      <head>
        <meta charSet="UTF-8" />
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={url} />
      </head>
      <body
        style={{
          margin: 0,
          fontFamily: "Arial, sans-serif",
          lineHeight: 1.2,
          fontSize: "0.9rem",
        }}
      >
        <header
          style={{
            padding: "1rem",
            backgroundColor: "#f5f5f5",
            textAlign: "center",
          }}
        >
          <h1>{metaTitle}</h1>
        </header>
        <main
          style={{
            padding: "1rem",
          }}
        >
          {poster && (
            <img
              src={poster}
              alt={`Постер ${title}`}
              style={{
                maxWidth: "154px",
                height: "auto",
                margin: "1rem 0",
              }}
            />
          )}
          <h2>О {type === "movie" ? "фильме:" : "сериале:"}</h2>
          <p>{overview}</p>
          <ul>
            <li>
              <strong>Слоган:</strong>
              <blockquote>
                <i>{tagline}</i>
              </blockquote>
            </li>
            <li>
              <strong>Название:</strong> {title}
            </li>
            <li>
              <strong>Оригинальное название:</strong> {originalTitle}
            </li>
            <li>
              <strong>Год:</strong> {year}
            </li>
            <li>
              <strong>Рейтинг:</strong> {rating} / 10
            </li>
            <li>
              <strong>Жанр:</strong> {genres}
            </li>
            <li>
              <strong>Страна:</strong> {country}
            </li>
            <li>
              <strong>Оригинальный язык:</strong> {originalLanguage}
            </li>
            <li>
              <strong>Кинокомпании:</strong> {production_companies}
            </li>
            {type === "movie" && (
              <>
                <li>
                  <strong>Продолжительность:</strong> {duration}
                </li>
                <li>
                  <strong>Дата выхода в прокат:</strong> {releaseOrEpisodeDate}
                </li>
                <li>
                  <strong>Бюджет:</strong> {budget}
                </li>
                <li>
                  <strong>Сборы в мире:</strong> {revenue}
                </li>
                <li>
                  <strong>Режиссёрский состав:</strong> {directors}
                </li>
                <li>
                  <strong>Актёры:</strong> {actors}
                </li>
              </>
            )}
            {type === "tv" && (
              <>
                <li>
                  <strong>Первый эпизод:</strong> {releaseOrEpisodeDate}
                </li>
                <li>
                  <strong>Последний эпизод сезона вышел:</strong> {lastEpisode}
                </li>
                <li>
                  <strong>Следующий эпизод планируется:</strong> {nextEpisode}
                </li>
                <li>
                  <strong>Создатели:</strong> {creator}
                </li>
                <li>
                  <strong>Актёры:</strong> {actors}
                </li>
              </>
            )}
          </ul>
        </main>
        <footer
          style={{
            padding: "1rem",
            textAlign: "center",
            backgroundColor: "#f5f5f5",
            marginTop: "2rem",
          }}
        >
          <p>&nbsp;&copy; 2025 Киногалерея. Все права защищены. </p>
          <p>
            GitHub:
            <a href="https://github.com/WskyMike/moviesgallery-pet-react">
              https://github.com/WskyMike/moviesgallery-pet-react
            </a>
          </p>
          <p>Данные: API The Movie Database</p>
        </footer>
      </body>
    </html>
  );
}
SEOPage.propTypes = {
  media: PropTypes.shape({
    title: PropTypes.string,
    name: PropTypes.string,
    original_title: PropTypes.string,
    original_name: PropTypes.string,
    release_year: PropTypes.string,
    first_air_year: PropTypes.string,
    rating: PropTypes.number,
    genres: PropTypes.arrayOf(PropTypes.string),
    production_countries: PropTypes.string,
    original_language: PropTypes.string,
    runtime: PropTypes.number,
    episode_run_time: PropTypes.number,
    release_date: PropTypes.string,
    first_air_date: PropTypes.string,
    budget: PropTypes.number,
    revenue: PropTypes.number,
    last_episode_to_air: PropTypes.string,
    next_episode_to_air: PropTypes.string,
    production_companies: PropTypes.string,
    tagline: PropTypes.string,
    overview: PropTypes.string,
    creator: PropTypes.string,
    poster: PropTypes.string,
    credits: PropTypes.shape({
      directors: PropTypes.string,
      actors: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
        })
      ),
    }),
  }).isRequired,
  type: PropTypes.oneOf(["movie", "tv"]).isRequired,
  url: PropTypes.string.isRequired,
};

export default SEOPage;
