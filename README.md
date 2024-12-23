# Пет-проект [Киногалерея](https://moviegallery.tw1.ru/) | Frontend

### 📜 Описание:
Одностраничное мини-приложение с каталогом фильмов The Movie Database (TMDB). На данном этапе доступен вывод фильмов по трём подборкам. Есть функционал регистрации и авторизации пользователя по e-mail. Сохранение фильмов в закладки. Страница подробного описания каждого фильма с актерами и трейлером.<br>
В планах добавить так же сериалы, функцию поиска по каталогу и сортировку по различным категориям (жанры, год, и т.д.). 

### 🥞 Стек:

`HTML5` `CSS3` `JavaScript ES6+` `React v.18` `Vite` `Bootstrap` `Google Firebase` `PostCSS` `ESLint` `Prettier` `БЭМ (Nested)` 

### ⚙️ Функционал:
* Single Page Application на `Vite 5.2.0`
* Хранение данных пользователей на Firebase.
* Карусель карточек `react-multi-carousel`
* Формы авторизации `react-hook-form`
* Навигация `react-router-dom 6.23.0`
* Статический анализ кода `ESLint 8.57.0`
* Верстка Bootstrap
* Реализовано проксирование запросов на API TMDB через мой VPS сервер. Так как сервис недоступен для прямых запросов с IP адресов РФ.
* Реализован поиск фильмов и сериалов

### 💡 Ближайшие планы:
* Реализация сортировки по параметрам
* Раздельный вывод фильмов и сериалов в закладках
* Добавить возможность поиска по актерам и карточки с детализацией.
* Добавить рекомендации