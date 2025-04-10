import { transformMoviesCreditsData } from '../transform/transformCreditsData';

export async function creditsMovieData(movieId) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: import.meta.env.VITE_TMDB_API_KEY,
    },
  };

  try {
    const response = await fetch(
      `https://try.readme.io/https://api.themoviedb.org/3/movie/${movieId}/credits?language=ru-RU`,
      options
    );
    if (!response.ok) {
      throw new Error(`Ошибка API. Status: ${response.status}`);
    }

    const creditsData = await response.json();
    const selectedItems = await transformMoviesCreditsData(creditsData);
    return selectedItems;
  } catch (error) {
    console.error('Ошибка при выполнении запроса creditsMovieData', error);
    throw error;
  }
}
