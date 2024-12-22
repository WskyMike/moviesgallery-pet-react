import { transformMovieData } from "../utils/transformData";

export async function topRatedApi(page = 1, genre = "", carousel = false) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MzA2NDdhMjQxZTIxNDFiZjFlNjQ4MDc3MWM2MTg5MiIsInN1YiI6IjY2MmUyNTViZDk2YzNjMDEyMjk4YTcyYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.74MnfDTKv4T4gC4Ku91CCZ6mQWLIf0QpR_L9IuRbiM8",
    },
  };

  const URL = carousel
    ? `https://try.readme.io/https://api.themoviedb.org/3/movie/top_rated?language=ru-RU&page=${page}&region=RU`
    : `https://try.readme.io/https://api.themoviedb.org/3/discover/movie?language=ru-RU&page=${page}&region=RU&sort_by=vote_average.desc&vote_count.gte=300&with_genres=${genre}`;

  try {
    const response = await fetch(URL, options);
    if (!response.ok) {
      throw new Error(`Ошибка API. Status: ${response.status}`);
    }
    const { movies, totalPages } = await transformMovieData(
      await response.json()
    );
    // console.debug({ movies, totalPages });
    return { movies, totalPages };
  } catch (error) {
    console.error("Ошибка при выполнении запроса popularApi", error);
    return { movies: [], totalPages: 0 };
  }
}
