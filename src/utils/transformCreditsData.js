import noPhoto from "../images/1299805-9e9e9e.png";

export async function transformCreditsData(data) {
  // Фильтруем и обрабатываем данные режиссеров
  const directors = data.crew
    .filter((person) => person.job === "Director")
    .map((director) => director.name)
    .join(", ");

  // Фильтруем и обрабатываем данные актеров
  const actors = await Promise.all(
    data.cast
      .filter((actor) => actor.known_for_department === "Acting")
      // .slice(0, 8) // Берем первых 8 актеров (при необходимости)
      .map(async (actor) => ({
        id: actor.id,
        name: actor.name,
        character: actor.character,
        profile_path: actor.profile_path
          ? await fetchImageUrl(actor.profile_path) // Асинхронная обработка изображения
          : noPhoto,
      }))
  );

  return {
    directors,
    actors,
  };
}

async function fetchImageUrl(profilePath) {
  return `https://movieapiproxy.tw1.ru/t/p/w185${profilePath}`;
}