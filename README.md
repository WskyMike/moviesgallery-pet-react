# Пет-проект [Киногалерея](https://moviegallery.tw1.ru/) | Frontend

### 📜 Описание:
Одностраничное мини-приложение с каталогом фильмов The Movie Database (TMDB). На данном этапе доступен вывод фильмов и сериалов по четырем подборкам на главной. Фильтр по жанрам. Поиск фильмов и сериалов. Есть функционал регистрации и авторизации пользователя по e-mail. Сохранение фильмов в закладки. Страница подробного описания каждого фильма с актерами, трейлером и рекомендациями.<br>

### 🥞 Стек:

`HTML5` `CSS3` `JavaScript ES6+` `React v.18` `Vite` `Bootstrap` `Google Firebase` `PostCSS` `ESLint` `Prettier` `БЭМ (Nested)` 

### ⚙️ Функционал:
* Single Page Application, сборщик - `Vite 5.2.0`
* Добавление фильмов и сериалов в "закладки". Хранение данных пользователей на Firestore.
* Карусель карточек `react-multi-carousel`. Реализована ленивая загрузка с помощью Intersection Observer API.
* Авторизация на Firebase. Формы авторизации `react-hook-form`
* Навигация `react-router-dom 6.23.0`
* Статический анализ кода `ESLint 8.57.0`
* Верстка Bootstrap
* Так как сервис The Movie Database недоступен для прямых запросов с IP адресов РФ, было реализовано проксирование через мой VPS сервер (NL). 
* Реализован поиск фильмов и сериалов, фильтры по жанрам, рекомендации.
* Реализован серверный рендеринг для отдачи SEO-оптимизированной версии страниц для роботов по маршруту `/seo/:type/:id` (Express.js)
* Реализован легковесный трекер посещений (Node.js + Express.js). Собирает данные с клиентского приложения и передает на защищенную страницу статистики. Данные не блокируются со стороны антирекинговых систем (AdBlock и др.).

### 💡 В планах:
* Добавить дополнительные параметры фильтрации и сортировку.
* Добавить карточки детализации актеров и поиск.
* Реализовать коллекции.
* Добавить постраничный вывод результатов поиска (пангинацию).