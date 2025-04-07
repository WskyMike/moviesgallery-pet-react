import { transformTvCreditsData } from './transformCreditsData';

export async function creditsTvData(movieId) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: import.meta.env.VITE_TMDB_API_KEY,
    },
  };

  try {
    const response = await fetch(
      `https://try.readme.io/https://api.themoviedb.org/3/tv/${movieId}/aggregate_credits?language=ru-RU`,
      options
    );
    if (!response.ok) {
      throw new Error(`Ошибка API. Status: ${response.status}`);
    }

    const creditsData = await response.json();
    const selectedItems = await transformTvCreditsData(creditsData);
    // console.debug(selectedItems);
    return selectedItems;
  } catch (error) {
    console.error('Ошибка при выполнении запроса creditsTvData', error);
    throw error;
  }
}
