import fallbackSrc from "../images/gradient_500_700.png";

function getPosterPath(poster_path) {
  return poster_path
    ? `https://movieapiproxy.tw1.ru/t/p/w342${poster_path}`
    : fallbackSrc;
}

export async function transformResultData(data) {
  const totalPages = data.total_pages;
  let movieCount = 0;
  let tvCount = 0;

  const result = await Promise.all(
    data.results.map(async (item) => {
      if (item.media_type === "movie") {
        movieCount++;
      } else if (item.media_type === "tv") {
        tvCount++;
      }

      return {
        media_type: item.media_type || "unknown",
        id: item.id,
        title: item.title || item.name || null,
        original_title:
          item.title !== item.original_title && item.original_title
            ? item.original_title
            : item.name !== item.original_name && item.original_name
            ? item.original_name
            : null,
        release_year:
          item.release_date || item.first_air_date
            ? new Date(
                item.release_date || item.first_air_date
              ).getFullYear() || null
            : null,
        poster: getPosterPath(item.poster_path),
        rating: item.vote_average
          ? parseFloat(item.vote_average.toFixed(1))
          : null,
        overview: item.overview || "Описание отсутствует.",
        genres: item.genre_ids || [],
      };
    })
  );

  return { result, totalPages, movieCount, tvCount };
}
