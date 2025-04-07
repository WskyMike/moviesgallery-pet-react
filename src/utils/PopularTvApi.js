import { transformTvData } from '../utils/transformData';

export async function popularTvApi(
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
    ? `https://try.readme.io/https://api.themoviedb.org/3/discover/tv?language=ru-RU&page=${page}&watch_region=RU&sort_by=vote_count.desc`
    : `https://try.readme.io/https://api.themoviedb.org/3/discover/tv?language=ru-RU&page=${page}&watch_region=RU&sort_by=vote_count.desc&with_genres=${genre}&with_original_language=${lang}`;

  try {
    const response = await fetch(URL, options);
    if (!response.ok) {
      throw new Error(`Ошибка API. Status: ${response.status}`);
    }
    const { movies, totalPages } = await transformTvData(await response.json());
    // console.debug({ movies, totalPages });
    return { movies, totalPages };
  } catch (error) {
    console.error('Ошибка при выполнении запроса popularTvApi', error);
    return { movies: [], totalPages: 0 };
  }
}
