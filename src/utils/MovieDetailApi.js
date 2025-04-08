import { transformMovieDetailsData } from './transformData';

export async function movieDetailsData(movieId) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: import.meta.env.VITE_TMDB_API_KEY,
    },
  };

  try {
    const ruResponse = await fetch(
      `https://try.readme.io/https://api.themoviedb.org/3/movie/${movieId}?language=ru-RU`,
      options
    );
    if (!ruResponse.ok)
      throw new Error(`Ошибка API. Status: ${ruResponse.status}`);

    let data = await ruResponse.json();
    let englishOverview = '';

    if (!data.overview || data.overview.trim() === '') {
      const enResponse = await fetch(
        `https://try.readme.io/https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
        options
      );
      if (!enResponse.ok)
        throw new Error(`Ошибка API (EN). Status: ${enResponse.status}`);

      const enData = await enResponse.json();
      englishOverview = enData.overview || '';
      data.overview = englishOverview; // Устанавливаем английский текст для последующего перевода
    }

    const transformedData = await transformMovieDetailsData(data);
    return {
      ...transformedData,
      needsTranslation: !!englishOverview,
      isTranslated: false,
      englishOverview: englishOverview || null,
    };
  } catch (error) {
    console.error('Ошибка при выполнении запроса movieDetailsData', error);
    throw error;
  }
}
