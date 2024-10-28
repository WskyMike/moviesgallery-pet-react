import { transformMovieData } from "../utils/transformData";

export async function popularApi(page = 1) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MzA2NDdhMjQxZTIxNDFiZjFlNjQ4MDc3MWM2MTg5MiIsInN1YiI6IjY2MmUyNTViZDk2YzNjMDEyMjk4YTcyYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.74MnfDTKv4T4gC4Ku91CCZ6mQWLIf0QpR_L9IuRbiM8",
    },
  };

  try {
    const response = await fetch(
      `https://try.readme.io/https://api.themoviedb.org/3/movie/popular?language=ru-RU&page=${page}&region=RU`,
      // `https://moviedataproxy.tw1.ru/3/movie/popular?language=ru-RU&page=${page}&region=RU`,
      options
    );
    if (!response.ok) {
      throw new Error(`Ошибка API. Status: ${response.status}`);
    }
    const { movies, totalPages } = await transformMovieData(
      await response.json()
    );
    // console.log({ movies, totalPages });
    return { movies, totalPages };
  } catch (error) {
    console.error("Ошибка при выполнении запроса popularApi", error);
    return { movies: [], totalPages: 0 };
  }
}
