/* eslint-disable no-undef */
require("@babel/register")({
    presets: ["@babel/preset-env", "@babel/preset-react"]
});
global.React = require("react");
const React = require("react");
const express = require("express");
const axios = require("axios");
const process = require("process");
const dotenv = require("dotenv");
const { renderToStaticMarkup } = require("react-dom/server");
// const cron = require("node-cron");
const SEOPage = require("./SEOPage.jsx").default;
const { transformSeoMovieData, transformSeoTvData, transformSeoMoviesCreditsData, transformSeoTvCreditsData } = require("./transformSeoData.js");

dotenv.config();

const app = express();
const PORT = 3000;
const HOSTNAME = "https://moviegallery.tw1.ru";
const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;

// === Sitemap caching: переменные и функции ===
const MAX_PAGES = 500; // Максимально возможное количество страниц API TMDB
let cachedMovieIds = [];
let cachedTvIds = [];
let lastUpdated = null;
let isUpdatingCache = false; // Флаг блокировки запросов

// Функция для запроса ID фильмов/сериалов с TMDB
async function fetchMovieOrTVIds(type) {
    console.log(`🔄 Запрашиваем ${type} (до ${MAX_PAGES} страниц)...`);
    let ids = [];
    const startTime = Date.now();
    for (let page = 1; page <= MAX_PAGES; page++) {
        try {
            const response = await axios.get(
                `https://api.themoviedb.org/3/${type}/popular?page=${page}`,
                { headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` } }
            );
            if (response.data.results) {
                ids.push(...response.data.results.map(item => item.id));
            }
            // Ждем случайный интервал перед следующим запросом
            const delay = Math.floor(Math.random() * 500) + 1;
            await new Promise(resolve => setTimeout(resolve, delay));
        } catch (error) {
            console.error(`❌ Ошибка при загрузке ${type} (страница ${page}):`, error.message);
        }
    }
    const endTime = Date.now();
    console.log(`⏳ Время выполнения запроса ${type}: ${((endTime - startTime) / 60000).toFixed(1)} мин`);
    console.log(`✅ Получено ${ids.length} ID для ${type}`);

    return ids;
}

// Функция для обновления кеша 
async function updateCache() {
    if (isUpdatingCache) return;
    isUpdatingCache = true;
    console.log("♻️ Обновление кеша фильмов и сериалов...");
    cachedMovieIds = await fetchMovieOrTVIds("movie");
    cachedTvIds = await fetchMovieOrTVIds("tv");
    lastUpdated = new Date();
    console.log(`✅ Кеш обновлён: ${lastUpdated.toLocaleString()}`);
    isUpdatingCache = false;
}

// Middleware: блокировка запросов во время обновления кеша
app.use((req, res, next) => {
    if (isUpdatingCache) {
        console.warn(`🚧 Сервер занят обновлением данных. Блокируем: ${req.path}`);
        return res.status(503).send("🔄 Сервер обновляет данные. Попробуйте позже.");
    }
    next();
});

// Обновляем кеш при запуске сервера
updateCache();

// Запускаем обновление кеша раз в сутки
// cron.schedule("05 3 * * *", async () => {
//     await updateCache();
// });

// === Sitemap endpoints ===
// Индексный с ссылками на дочерние файлы
app.get("/sitemap.txt", (req, res) => {
    res.header("Content-Type", "text/plain");
    console.log("📄 Генерируем индексный sitemap.txt");
    let sitemapContent = [
        `${HOSTNAME}/sitemap-movies.txt`,
        `${HOSTNAME}/sitemap-tv.txt`
    ].join("\n");
    res.send(sitemapContent);
});

// Sitemap для фильмов
app.get("/sitemap-movies.txt", (req, res) => {
    if (!cachedMovieIds.length) {
        console.warn("⚠️ sitemap-movies.txt пуст! Возвращаем 404");
        return res.status(404).send("Not Found");
    }
    console.log(`🎬 Отдаем sitemap-movies.txt (${cachedMovieIds.length} фильмов)`);
    res.header("Content-Type", "text/plain");
    res.send(cachedMovieIds.map(id => `${HOSTNAME}/movie/${id}`).join("\n"));
});

// Sitemap для сериалов
app.get("/sitemap-tv.txt", (req, res) => {
    if (!cachedTvIds.length) {
        console.warn("⚠️ sitemap-tv.txt пуст! Возвращаем 404");
        return res.status(404).send("Not Found");
    }
    console.log(`📺 Отдаем sitemap-tv.txt (${cachedTvIds.length} сериалов)`);
    res.header("Content-Type", "text/plain");
    res.send(cachedTvIds.map(id => `${HOSTNAME}/tv/${id}`).join("\n"));
});

// === SEO endpoint ===
app.get("/seo/:type/:id", async (req, res) => {
    const { type, id } = req.params;
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const userAgent = req.get("User-Agent");
    let transformedData;

    try {
        if (type === "movie") {
            const [detailsRes, creditsRes] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${id}?language=ru-RU`, {
                    headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
                }),
                axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?language=ru-RU`, {
                    headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
                }),
            ]);
            transformedData = await transformSeoMovieData(detailsRes.data);
            const credits = await transformSeoMoviesCreditsData(creditsRes.data);
            transformedData.credits = credits;

        } else if (type === "tv") {
            const [detailsRes, creditsRes] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/tv/${id}?language=ru-RU`, {
                    headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
                }),
                axios.get(`https://api.themoviedb.org/3/tv/${id}/aggregate_credits?language=ru-RU`, {
                    headers: { Authorization: `Bearer ${TMDB_API_TOKEN}` },
                }),
            ]);
            transformedData = await transformSeoTvData(detailsRes.data);
            const credits = await transformSeoTvCreditsData(creditsRes.data);
            transformedData.credits = credits;

        } else {
            return res.status(400).send("❌ Неизвестный тип контента");
        }

        // Рендерим SEOPage с полученными данными
        const html = renderToStaticMarkup(React.createElement(SEOPage, { media: transformedData, type, url }));
        res.header("Content-Type", "text/html");
        console.log(`🕵️ Пришёл User-Agent: ${userAgent}. ✅ SEO-страница сформирована: ${url}`);
        return res.send(`<!DOCTYPE html>${html}`);
    } catch (error) {
        console.error("❌ Ошибка генерации SEO-страницы:", error.message);
        return res.status(500).send("❌ Ошибка генерации SEO-страницы");
    }
});

// === Fallback: редирект остальных запросов на фронтенд ===
app.get("*", (req, res) => {
    res.redirect(`https://moviegallery.tw1.ru${req.path}`);
});

// Запуск сервера
app.listen(PORT, () => console.log(`✅ SEO cервер работает на ${PORT} порту`));
