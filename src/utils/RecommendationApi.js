import { transformRecommendationData } from './transformData';

export async function recommendationsData(movieId, mediaType) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MzA2NDdhMjQxZTIxNDFiZjFlNjQ4MDc3MWM2MTg5MiIsInN1YiI6IjY2MmUyNTViZDk2YzNjMDEyMjk4YTcyYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.74MnfDTKv4T4gC4Ku91CCZ6mQWLIf0QpR_L9IuRbiM8',
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
