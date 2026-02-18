import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import defaultBackImg from "../img/default_back.jpeg";

import { searchMovies, img780 } from "../api/tmdb";
import MovieGrid from "../components/MovieGrid";

function Search() {
  const { search, page } = useParams();
  const query = decodeURIComponent(search || "").trim();
  const pageNum = Number(page) || 1;

  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  const isChristmasQuery = useMemo(() => {
    const q = query.toLowerCase();
    return q === "christmas" || q.includes("christmas");
  }, [query]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        setMovies([]);

        if (!query) {
          setLoading(false);
          return;
        }

        const json = await searchMovies(query, pageNum);
        if (cancelled) return;
        setMovies(json.results || []);
      } catch (e) {
        if (cancelled) return;
        setError(e?.message || "Search failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [query, pageNum]);

  const backgroundStyle = isChristmasQuery
    ? {
        backgroundImage: `url(${defaultBackImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : undefined;

  return (
    <MovieGrid
      loading={loading}
      error={error}
      movies={movies}
      showSnow={isChristmasQuery}
      backgroundStyle={backgroundStyle}
      pageNum={pageNum}
      pages={10}
      makeTo={(page) => `/search/${encodeURIComponent(query)}/${page}`}
    />
  );
}

export default Search;
