import { transformSingleMovieData } from './transformData';

export async function MovieCardByIdData(movieId) {
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
      `https://try.readme.io/https://api.themoviedb.org/3/movie/${movieId}?language=ru-RU`,
      options
    );
    if (!response.ok) {
      throw new Error(`Ошибка API. Status: ${response.status}`);
    }

    const selectedItems = await transformSingleMovieData(await response.json());
    // console.log(selectedItems);
    return selectedItems;
  } catch (error) {
    console.error('Ошибка при выполнении запроса transformMovieData', error);
    throw error;
  }
}
