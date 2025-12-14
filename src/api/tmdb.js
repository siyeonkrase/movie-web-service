const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";

const IMG_780 = "https://image.tmdb.org/t/p/w780";
const IMG_1280 = "https://image.tmdb.org/t/p/w1280";

function withKey(path) {
  const join = path.includes("?") ? "&" : "?";
  return `${BASE}${path}${join}api_key=${API_KEY}&include_adult=false&language=en-US`;
}

export function img780(pathOrUrl) {
  if (!pathOrUrl) return "";
  return pathOrUrl.startsWith("http") ? pathOrUrl : `${IMG_780}${pathOrUrl}`;
}

export function img1280(pathOrUrl) {
  if (!pathOrUrl) return "";
  return pathOrUrl.startsWith("http") ? pathOrUrl : `${IMG_1280}${pathOrUrl}`;
}

export async function discoverNewMovies(page = 1) {
  const url = withKey(
    `/discover/movie?sort_by=primary_release_date.desc&primary_release_date.lte=${new Date()
      .toISOString()
      .slice(0, 10)}&page=${page}&vote_count.gte=50`
  );
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB discoverNewMovies HTTP ${res.status}`);
  return res.json(); // { results: [...] }
}

export async function discoverTopRated(page = 1) {
  const url = withKey(
    `/discover/movie?sort_by=popularity.desc&vote_count.gte=100&page=${page}`
  );
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB discoverTopRated HTTP ${res.status}`);
  return res.json();
}

export async function getMovieDetail(movieId) {
  const res = await fetch(withKey(`/movie/${movieId}`));
  if (!res.ok) throw new Error(`TMDB getMovieDetail HTTP ${res.status}`);
  return res.json();
}

export async function getTrailerKey(movieId) {
  const res = await fetch(withKey(`/movie/${movieId}/videos`));
  if (!res.ok) return null;
  const json = await res.json();

  const yt = (json.results || []).filter((v) => v.site === "YouTube");
  const pick =
    yt.find((v) => v.type === "Trailer") ||
    yt.find((v) => v.type === "Teaser") ||
    yt[0];

  return pick?.key ?? null;
}

export async function discoverByGenre(genreId, page = 1) {
  const url = withKey(
    `/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&vote_count.gte=50&page=${page}`
  );
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB discoverByGenre HTTP ${res.status}`);
  return res.json();
}

export async function searchMovies(query, page = 1) {
  const url = withKey(
    `/search/movie?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
  );
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB searchMovies HTTP ${res.status}`);
  return res.json();
}
