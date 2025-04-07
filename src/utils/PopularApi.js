import { transformMovieData } from '../utils/transformData';

export async function popularApi(page = 1, genre = '', carousel = false) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: import.meta.env.VITE_TMDB_API_KEY,
    },
  };

  const URL = carousel
    ? // из карусели Popular передал carousel = true
      `https://try.readme.io/https://api.themoviedb.org/3/trending/movie/week?language=ru-RU`
    : `https://try.readme.io/https://api.themoviedb.org/3/discover/movie?language=ru-RU&page=${page}&sort_by=popularity.desc&with_genres=${genre}`;

  try {
    const response = await fetch(URL, options);
    if (!response.ok) {
      throw new Error(`Ошибка API. Status: ${response.status}`);
    }
    const { movies, totalPages } = await transformMovieData(
      await response.json()
    );
    return { movies, totalPages };
  } catch (error) {
    console.error('Ошибка при выполнении запроса popularApi', error);
    return { movies: [], totalPages: 0 };
  }
}

//
// https://try.readme.io/https://api.themoviedb.org/3/movie/popular?language=ru-RU&page=${page}
