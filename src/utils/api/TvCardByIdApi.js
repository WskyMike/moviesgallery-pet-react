import { transformSingleTvData } from '../transform/transformData';

export async function TvCardByIdData(movieId) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: import.meta.env.VITE_TMDB_API_KEY,
    },
  };

  try {
    const response = await fetch(
      `https://try.readme.io/https://api.themoviedb.org/3/tv/${movieId}?language=ru-RU`,
      options
    );
    if (!response.ok) {
      throw new Error(`Ошибка API. Status: ${response.status}`);
    }

    const selectedItems = await transformSingleTvData(await response.json());
    // console.log(selectedItems);
    return selectedItems;
  } catch (error) {
    console.error('Ошибка при выполнении запроса transformMovieData', error);
    throw error;
  }
}
