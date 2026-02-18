import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { discoverPopular } from "../api/tmdb";
import MovieGrid from "../components/MovieGrid";

export default function Popular() {
  const { page } = useParams();
  const pageNum = Number(page) || 1;

  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const json = await discoverPopular(pageNum);
        if (cancelled) return;
        setMovies(json.results || []);
      } catch (e) {
        if (cancelled) return;
        setError(e?.message || "Failed to load popular movies");
        setMovies([]);
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [pageNum]);

  return (
    <MovieGrid
      loading={loading}
      error={error}
      movies={movies}
      pageNum={pageNum}
      pages={10}
      makeTo={(page) => `/popular-movies/${page}`}
    />
  );
}
