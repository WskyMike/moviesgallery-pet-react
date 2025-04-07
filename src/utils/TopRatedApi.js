import { transformMovieData } from '../utils/transformData';

export async function topRatedApi(
  page = 1,
  genre = '',
  carousel = false,
  lang = ''
) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: import.meta.env.VITE_TMDB_API_KEY,
    },
  };

  const URL = carousel
    ? `https://try.readme.io/https://api.themoviedb.org/3/movie/top_rated?language=ru-RU&page=${page}&region=RU`
    : `https://try.readme.io/https://api.themoviedb.org/3/discover/movie?language=ru-RU&page=${page}&region=RU&sort_by=vote_average.desc&vote_count.gte=300&with_genres=${genre}&with_original_language=${lang}`;

  try {
    const response = await fetch(URL, options);
    if (!response.ok) {
      throw new Error(`Ошибка API. Status: ${response.status}`);
    }
    const { movies, totalPages } = await transformMovieData(
      await response.json()
    );
    // console.debug({ movies, totalPages });
    return { movies, totalPages };
  } catch (error) {
    console.error('Ошибка при выполнении запроса popularApi', error);
    return { movies: [], totalPages: 0 };
  }
}
