// Этот компонент формирует HTML-страницу для поисковых роботов
import PropTypes from "prop-types";

function MainSeoPage({ url }) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="UTF-8" />
        <title>Киногалерея</title>
        <meta
          name="description"
          content="Популярные новинки, рейтинги лучших картин и актуальные премьеры. Присоединяйтесь и создавайте персональные подборки любимого кино."
        />
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
            textAlign: "center",
            backgroundColor: "#f5f5f5",
          }}
        >
          <h1>Киногалерея</h1>
          <p>
            Добро пожаловать на Киногалерею – портал, где собраны лучшие
            подборки фильмов и сериалов. Здесь вы найдёте актуальные рейтинги,
            новинки кино и качественные рекомендации.
          </p>
        </header>
        <main style={{ padding: "1rem" }}>
          <section>
            <h2>Подборки:</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ marginBottom: "1.2rem" }}>
                <a
                  href="https://moviegallery.tw1.ru/list/popular"
                  style={{
                    fontSize: "1.2rem",
                    textDecoration: "none",
                    color: "#007bff",
                  }}
                >
                  Популярные фильмы
                </a>
                <p>
                  Откройте для себя самые популярные фильмы, выбираемые
                  зрителями.
                </p>
              </li>
              <li style={{ marginBottom: "1rem" }}>
                <a
                  href="https://moviegallery.tw1.ru/list/nowPlaying"
                  style={{
                    fontSize: "1.2rem",
                    textDecoration: "none",
                    color: "#007bff",
                  }}
                >
                  Сейчас в кино
                </a>
                <p>
                  Узнайте, какие фильмы сейчас идут в прокате и заслуживают
                  внимания.
                </p>
              </li>
              <li style={{ marginBottom: "1rem" }}>
                <a
                  href="https://moviegallery.tw1.ru/list/popularTv"
                  style={{
                    fontSize: "1.2rem",
                    textDecoration: "none",
                    color: "#007bff",
                  }}
                >
                  Лучшие сериалы
                </a>
                <p>
                  Посмотрите подборку лучших сериалов, завоевавших сердца
                  зрителей.
                </p>
              </li>
              <li style={{ marginBottom: "1rem" }}>
                <a
                  href="https://moviegallery.tw1.ru/list/topRated"
                  style={{
                    fontSize: "1.2rem",
                    textDecoration: "none",
                    color: "#007bff",
                  }}
                >
                  Лучшие фильмы
                </a>
                <p>
                  Список фильмов с самыми высокими рейтингами — качество,
                  проверенное временем.
                </p>
              </li>
              <li style={{ marginBottom: "1rem" }}>
                <a
                  href="https://moviegallery.tw1.ru/list/popularRus"
                  style={{
                    fontSize: "1.2rem",
                    textDecoration: "none",
                    color: "#007bff",
                  }}
                >
                  Популярные российские фильмы
                </a>
                <p>Оцените подборку самых востребованных российских фильмов.</p>
              </li>
            </ul>
          </section>
          <section style={{ marginTop: "2rem", textAlign: "center" }}>
            <h2>Присоединяйтесь к нам!</h2>
            <p>
              Зарегистрируйтесь на сайте, чтобы создавать собственные подборки,
              сохранять избранное и получать персональные рекомендации.
            </p>
          </section>
        </main>
        <footer
          style={{
            padding: "1rem",
            textAlign: "center",
            backgroundColor: "#f5f5f5",
            marginTop: "2rem",
          }}
        >
          <p>
            Михаил Соснин &nbsp;&copy; 2025 Киногалерея. Все права защищены.{" "}
          </p>
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

MainSeoPage.propTypes = {
  url: PropTypes.string.isRequired,
};

export default MainSeoPage;
