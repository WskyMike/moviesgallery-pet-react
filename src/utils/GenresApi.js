export async function GenresApi(isTvSeries = false) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MzA2NDdhMjQxZTIxNDFiZjFlNjQ4MDc3MWM2MTg5MiIsInN1YiI6IjY2MmUyNTViZDk2YzNjMDEyMjk4YTcyYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.74MnfDTKv4T4gC4Ku91CCZ6mQWLIf0QpR_L9IuRbiM8',
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
