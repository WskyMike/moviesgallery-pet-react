import { transformResultData } from '../transform/transformSearchData';

export async function SearchApi(query, page = 1) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: import.meta.env.VITE_TMDB_API_KEY,
    },
  };

  try {
    const response = await fetch(
      `https://try.readme.io/https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=true&language=ru-RU&page=${page}`,
      options
    );
    if (!response.ok) {
      throw new Error(`Ошибка API. Status: ${response.status}`);
    }
    const selectedItems = await transformResultData(await response.json());
    // console.debug(selectedItems);
    return selectedItems;
  } catch (error) {
    console.error('Ошибка при выполнении запроса popularApi', error);
    return { movies: [], totalPages: 0, movieCount: 0, tvCount: 0 };
  }
}
