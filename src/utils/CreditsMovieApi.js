import { transformCreditsData } from "./transformCreditsData";

export async function creditsMovieData(movieId) {
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
      `https://try.readme.io/https://api.themoviedb.org/3/movie/${movieId}/credits?language=ru-RU`,
      options
    );
    if (!response.ok) {
      throw new Error(`Ошибка API. Status: ${response.status}`);
    }

    const creditsData = await response.json();
    const selectedItems = await transformCreditsData(creditsData); 
    return selectedItems;
  } catch (error) {
    console.error("Ошибка при выполнении запроса movieDetailsData", error);
    throw error;
  }
}