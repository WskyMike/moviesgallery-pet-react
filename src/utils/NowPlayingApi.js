import { transformMovieData } from "../utils/transformData";

function calculateDateRange() {
  const now = new Date();
  const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 дней назад
  const endDate = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 дней вперёд

  const formatDate = (date) => date.toISOString().split("T")[0];

  return {
    gte: formatDate(startDate),
    lte: formatDate(endDate),
  };
}

export async function nowPlayingApi(page = 1, genre = "", carousel = false) {
  const { gte, lte } = calculateDateRange();
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MzA2NDdhMjQxZTIxNDFiZjFlNjQ4MDc3MWM2MTg5MiIsInN1YiI6IjY2MmUyNTViZDk2YzNjMDEyMjk4YTcyYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.74MnfDTKv4T4gC4Ku91CCZ6mQWLIf0QpR_L9IuRbiM8",
    },
  };

  const URL = carousel
    ? `https://try.readme.io/https://api.themoviedb.org/3/movie/now_playing?language=ru-RU&page=${page}&region=RU`
    : `https://try.readme.io/https://api.themoviedb.org/3/discover/movie?language=ru-RU&page=${page}&region=RU&release_date.gte=${gte}&release_date.lte=${lte}&sort_by=rimary_release_date.desc&with_release_type=3&with_genres=${genre}`;

  try {
    const response = await fetch(URL, options);
    if (!response.ok) {
      throw new Error(`Ошибка API. Status: ${response.status}`);
    }
    const { movies, totalPages } = await transformMovieData(
      await response.json()
    );
    // console.log({ movies, totalPages });
    return { movies, totalPages };
  } catch (error) {
    console.error("Ошибка при выполнении запроса nowPlayingApi", error);
    return { movies: [], totalPages: 0 };
  }
}
