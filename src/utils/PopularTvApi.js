import { transformTvData } from "../utils/transformData";

export async function popularTvApi(page = 1) {
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
      `https://try.readme.io/https://api.themoviedb.org/3/discover/tv?language=ru-RU&page=${page}&watch_region=RU&sort_by=vote_count.desc`,
      options
    );
    if (!response.ok) {
      throw new Error(`Ошибка API. Status: ${response.status}`);
    }
    const { movies, totalPages } = await transformTvData(
      await response.json()
    );
    // console.debug({ movies, totalPages });
    return { movies, totalPages };
  } catch (error) {
    console.error("Ошибка при выполнении запроса popularTvApi", error);
    return { movies: [], totalPages: 0 };
  }
}