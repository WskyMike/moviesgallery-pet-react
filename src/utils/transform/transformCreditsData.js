import noPhoto from '../../images/1299805-9e9e9e.png';

async function fetchImageUrl(profilePath) {
  return `https://movieapiproxy.tw1.ru/t/p/w185${profilePath}`;
}

export async function transformMoviesCreditsData(data) {
  // Фильтруем и обрабатываем данные режиссеров
  const directors = data.crew
    .filter((person) => person.job === 'Director')
    .map((director) => director.name)
    .join(', ');

  // Фильтруем и обрабатываем данные актеров
  const actors = await Promise.all(
    data.cast
      .filter((actor) => actor.known_for_department === 'Acting')
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

// Функция для склонения слова "эпизод"
function pluralizeEpisodes(count) {
  if (!count) return null;
  const remainder10 = count % 10;
  const remainder100 = count % 100;

  if (remainder10 === 1 && remainder100 !== 11) return `${count} эпизод`;
  if (
    remainder10 >= 2 &&
    remainder10 <= 4 &&
    (remainder100 < 10 || remainder100 >= 20)
  ) {
    return `${count} эпизода`;
  }
  return `${count} эпизодов`;
}

export async function transformTvCreditsData(data) {
  const actors = await Promise.all(
    data.cast
      .filter((actor) => actor.known_for_department === 'Acting')
      .slice(0, 100)
      .map(async (actor) => ({
        id: actor.id,
        name: actor.name,
        character: actor.roles[0]?.character || '',
        episode_count: actor.roles[0]?.episode_count
          ? pluralizeEpisodes(actor.roles[0].episode_count)
          : null,
        profile_path: actor.profile_path
          ? await fetchImageUrl(actor.profile_path) // Асинхронная обработка изображения
          : noPhoto,
      }))
  );

  return {
    actors,
  };
}
