import express from "express";
import process from "process";
import axios from "axios";
import dotenv from "dotenv";
import puppeteer from "puppeteer";
// import cron from "node-cron";
// import fs from "fs"; // Для отладки (логирование HTML)

dotenv.config();

const app = express();
const PORT = 3000;
const HOSTNAME = "https://moviegallery.tw1.ru";
const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN;

// Максимально возможное количество страниц API TMDB
const MAX_PAGES = 500;

let cachedMovieIds = [];
let cachedTvIds = [];
let lastUpdated = null;
let isUpdatingCache = false; // Флаг блокировки запросов

// Middleware для блокировки всех запросов во время обновления кеша
app.use((req, res, next) => {
    if (isUpdatingCache) {
        console.warn(`🚧 Сервер занят обновлением данных. Блокируем: ${req.path}`);
        return res.status(503).send("🔄 Сервер обновляет данные. Попробуйте позже.");
    }
    next();
});

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

// Функция для обновления кеша раз в сутки
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

// Обновляем кеш при запуске сервера
updateCache();

// Запускаем обновление кеша раз в сутки
// cron.schedule("05 3 * * *", async () => {
//     await updateCache();
// });

// Индексный sitemap.txt с ссылками на дочерние файлы
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

// Puppeteer рендеринг для поисковиков
app.get("*", async (req, res) => {
    const url = `${HOSTNAME}${req.path}`;
    const userAgent = req.headers["user-agent"];

    if (/Googlebot|bingbot|YandexBot|DuckDuckBot/i.test(userAgent)) {
        console.log(`🤖 Бот запрашивает ${url}, рендерим через Puppeteer...`);

        const browser = await puppeteer.launch({
            headless: "new",
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage', // Важно для ограниченной памяти
                '--single-process',       // Уменьшает потребление ресурсов
                '--no-zygote',             // Дополнительная оптимизация
                '--disable-gpu',           // Экономия ресурсов
            ],
        });

        const page = await browser.newPage();

        try {
            // Отключаем загрузку Яндекс.Метрики
            await page.setRequestInterception(true);
            page.on('request', (req) => {
                if (req.url().includes('mc.yandex.ru')) {
                    console.log(`🚫 Блокируем запрос к ${req.url()}`);
                    req.abort();
                } else {
                    req.continue();
                }
            });


            await page.goto(url, { waitUntil: "networkidle2", timeout: 15000 })
                .catch(err => console.error("❌ Ошибка загрузки (Таймаут 15):", err));



            // Если это главная страница 
            if (url === `${HOSTNAME}/`) {

                console.log("🏠 Главная страница! Ждём загрузки контента...");

                await page.waitForFunction(() => {
                    return document.querySelector("#root")?.innerText.trim().length > 0;
                }, { timeout: 15000 }).catch(() => console.warn("⚠️ Контент главной страницы не загрузился!"));

                console.log("✅ Контент главной страницы загружен!");
            }

            // Ожидание появления элемента, который сигнализирует о завершении загрузки контента
            await page.waitForSelector('.media-content-loaded', { timeout: 10000 })
                .catch(() => console.warn("⚠️ Элемент .media-content-loaded не найден, но продолжаем."));

            let html = await page.content();

            // Удаляет <noscript> Метрики
            html = html
                .replace(/<noscript>.*?mc\.yandex\.ru\/watch.*?<\/noscript>/gis, "");

            // Логируем HTML
            // fs.writeFileSync("after.html", html);

            await page.close();
            await browser.close();

            console.log(`✅ Отправили статический HTML для ${url}`);
            return res.send(html);
        } catch (error) {
            console.error(`❌ Ошибка рендеринга ${url}:`, error.message);
            await page.close();
            await browser.close();
            return res.status(500).send("Ошибка рендеринга (статус 500)");
        }
    }

    // Обычный редирект на SPA-приложение
    res.redirect(url);
});

// 🚀 Запуск сервера
app.listen(PORT, () => console.log(`✅ Sitemap сервер работает: http://localhost:${PORT}`));
