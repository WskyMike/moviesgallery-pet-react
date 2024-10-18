export async function videosData(movieId) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MzA2NDdhMjQxZTIxNDFiZjFlNjQ4MDc3MWM2MTg5MiIsInN1YiI6IjY2MmUyNTViZDk2YzNjMDEyMjk4YTcyYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.74MnfDTKv4T4gC4Ku91CCZ6mQWLIf0QpR_L9IuRbiM8",
    },
  };

  try {
    // Запрос видео на русском
    const ruResponse = await fetch(
      `https://try.readme.io/https://api.themoviedb.org/3/movie/${movieId}/videos?language=ru-RU`,
      options
    );
    const ruData = ruResponse.ok ? await ruResponse.json() : { results: [] };

    // Запрос видео на английском
    const enResponse = await fetch(
      `https://try.readme.io/https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
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
    console.error("Ошибка при выполнении запроса videosData", error);
    return []; 
  }
}
