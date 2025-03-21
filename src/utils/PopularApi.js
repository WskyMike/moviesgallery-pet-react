import { transformMovieData } from "../utils/transformData";

export async function popularApi(page = 1, genre = "", carousel = false) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MzA2NDdhMjQxZTIxNDFiZjFlNjQ4MDc3MWM2MTg5MiIsInN1YiI6IjY2MmUyNTViZDk2YzNjMDEyMjk4YTcyYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.74MnfDTKv4T4gC4Ku91CCZ6mQWLIf0QpR_L9IuRbiM8",
    },
  };

  const URL = carousel
    ? `https://try.readme.io/https://api.themoviedb.org/3/movie/popular?language=ru-RU&page=${page}`
    : `https://try.readme.io/https://api.themoviedb.org/3/discover/movie?language=ru-RU&page=${page}&sort_by=popularity.desc&with_genres=${genre}`;

  try {
    const response = await fetch(URL, options);
    if (!response.ok) {
      throw new Error(`Ошибка API. Status: ${response.status}`);
    }
    const { movies, totalPages } = await transformMovieData(
      await response.json()
    );
    return { movies, totalPages };
  } catch (error) {
    console.error("Ошибка при выполнении запроса popularApi", error);
    return { movies: [], totalPages: 0 };
  }
}
