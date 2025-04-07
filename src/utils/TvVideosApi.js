export async function tvVideosData(movieId) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: import.meta.env.VITE_TMDB_API_KEY,
    },
  };

  try {
    // Запрос видео на русском
    const ruResponse = await fetch(
      `https://try.readme.io/https://api.themoviedb.org/3/tv/${movieId}/videos?language=ru-RU`,
      options
    );
    const ruData = ruResponse.ok ? await ruResponse.json() : { results: [] };

    // Запрос видео на английском
    const enResponse = await fetch(
      `https://try.readme.io/https://api.themoviedb.org/3/tv/${movieId}/videos?language=en-US`,
      options
    );
    const enData = enResponse.ok ? await enResponse.json() : { results: [] };

    // Извлекаем ключи только для трейлеров на русском языке
    const ruTrailers = (ruData.results || [])
      .filter((video) => video.key && video.type === 'Trailer')
      .map((video) => video.key);

    // Извлекаем ключи только для трейлеров на английском языке
    const enTrailers = (enData.results || [])
      .filter((video) => video.key && video.type === 'Trailer')
      .map((video) => video.key);

    // Если есть на русском
    if (ruTrailers.length > 0) {
      return [ruTrailers[0]];
    }
    // Если нет, возвращаем первый на английском
    if (enTrailers.length > 0) {
      return [enTrailers[0]];
    }

    return [];
  } catch (error) {
    console.error('Ошибка при выполнении запроса TvVideosData', error);
    return [];
  }
}
