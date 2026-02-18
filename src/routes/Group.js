import { useParams } from "react-router-dom";
import { discoverByGenre } from "../api/tmdb";
import { useEffect, useMemo, useState } from "react";
import defaultBackImg from "../img/default_back.jpeg";
import MovieGrid from "../components/MovieGrid";

function Group() {
  const { page, group } = useParams();

  const genreId = useMemo(() => Number(group), [group]);
  const pageNum = useMemo(() => Number(page) || 1, [page]);

  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  const isChristmas = (Number(group) === 10751);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);

      if (!Number.isFinite(genreId)) {
        setMovies([]);
        setError(`Invalid genre: ${group}`);
        setLoading(false);
        return;
      }

      try {
        const json = await discoverByGenre(genreId, pageNum);
        if (cancelled) return;
        setMovies(json.results || []);
      } catch (e) {
        if (cancelled) return;
        setMovies([]);
        setError(e?.message || "Failed to load movies");
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [pageNum, group]);

  const backgroundStyle = isChristmas
    ? {
        backgroundImage: `url(${defaultBackImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
    : undefined;

  return (
    <MovieGrid
      loading={loading}
      error={error}
      movies={movies}
      showSnow={isChristmas}
      backgroundStyle={backgroundStyle}
      pageNum={pageNum}
      pages={10}
      makeTo={(page) => `/page/${group}/${page}`}
    />
  );
}

export default Group;