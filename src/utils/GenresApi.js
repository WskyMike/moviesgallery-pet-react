export async function GenresApi(isTvSeries = false) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: import.meta.env.VITE_TMDB_API_KEY,
    },
  };

  const URL = isTvSeries
    ? 'https://try.readme.io/https://api.themoviedb.org/3/genre/tv/list?language=ru'
    : 'https://try.readme.io/https://api.themoviedb.org/3/genre/movie/list?language=ru';

  try {
    const response = await fetch(URL, options);
    if (!response.ok) {
      throw new Error(`Ошибка API. Status: ${response.status}`);
    }

    const data = await response.json();
    // console.debug(data)
    return data;
  } catch (error) {
    console.error('Ошибка при выполнении запроса', error);
    throw error;
  }
}
