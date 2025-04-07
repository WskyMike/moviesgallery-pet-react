import { transformRecommendationData } from './transformData';

export async function recommendationsData(movieId, mediaType) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: import.meta.env.VITE_TMDB_API_KEY,
    },
  };

  try {
    const response = await fetch(
      `https://try.readme.io/https://api.themoviedb.org/3/${mediaType}/${movieId}/recommendations?language=ru-RU&page=1`,
      options
    );
    if (!response.ok) {
      throw new Error(`Ошибка API. Status: ${response.status}`);
    }

    const selectedItems = await transformRecommendationData(
      await response.json()
    );
    // console.log(selectedItems);
    return selectedItems;
  } catch (error) {
    console.error(
      'Ошибка при выполнении запроса transformRecommendationData',
      error
    );
    throw error;
  }
}
