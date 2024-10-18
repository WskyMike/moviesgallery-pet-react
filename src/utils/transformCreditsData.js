import noPhoto from "../images/1299805-9e9e9e.png";

export function transformCreditsData(data) {
  // Извлекаем режиссеров
  const directors = data.crew
    .filter((person) => person.job === "Director")
    .map((director) => director.name)
    .join(", ");

  // Извлекаем первых 8 актеров, которые соответствуют "Acting"
  const actors = data.cast
    .filter((actor) => actor.known_for_department === "Acting")
    .slice(0, 8) // Берем первых 8 актеров
    .map((actor) => ({
      name: actor.name, // Имя актера
      character: actor.character, // Персонаж, которого играет
      profile_path: actor.profile_path
        ? `http://movieapiproxy.tw1.ru/t/p/w185${actor.profile_path}`
        : noPhoto,
    }));

  return {
    directors,
    actors, // Добавляем актеров в возвращаемый объект
  };
}
