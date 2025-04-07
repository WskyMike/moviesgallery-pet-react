import { transformMovieData } from '../utils/transformData';

export async function popularRusApi(page = 1, genre = '', carousel = false) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: import.meta.env.VITE_TMDB_API_KEY,
    },
  };

  const URL = carousel
    ? `https://try.readme.io/https://api.themoviedb.org/3/discover/movie?language=ru-RU&page=${page}&region=RU&sort_by=popularity.desc&with_original_language=ru`
    : `https://try.readme.io/https://api.themoviedb.org/3/discover/movie?language=ru-RU&page=${page}&region=RU&sort_by=popularity.desc&with_original_language=ru&with_genres=${genre}`;

  try {
    const response = await fetch(URL, options);
    if (!response.ok) {
      throw new Error(`Ошибка API. Status: ${response.status}`);
    }
    const { movies, totalPages } = await transformMovieData(
      await response.json()
    );
    // console.log({ movies, totalPages });
    return { movies, totalPages };
  } catch (error) {
    console.error('Ошибка при выполнении запроса popularApi', error);
    return { movies: [], totalPages: 0 };
  }
}
