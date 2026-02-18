import { useEffect, useState } from "react";
import Load from "../components/Load";
import NewMovie from "../components/NewMovie.js";
import PopMovie from "../components/PopMovie.js";
import styles from "../components/cssModule/Home.module.css";
import { GENRE_MAP } from "../atom/genreMap";
import YouTube from "react-youtube";
import { discoverNewMovies, discoverPopular, getTrailerKey, img780 } from "../api/tmdb";

const toGenreNames = (movie) =>
  Array.isArray(movie?.genre_ids)
    ? movie.genre_ids.map((id) => GENRE_MAP[id]).filter(Boolean)
    : [];

function Home() {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [popMovies, setPopMovies] = useState([]);
  const [trailerId, setTrailerId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [newJson, topJson] = await Promise.all([
          discoverNewMovies(1),
          discoverPopular(1),
        ]);

        setMovies((newJson.results || []));
        setPopMovies((topJson.results || []).slice(0, 20));
      } catch (e) {
        setError(e?.message || "Failed to load movies");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!popMovies.length) return;
    let cancelled = false;

    (async () => {
      setTrailerId(null);
      for (const movie of popMovies) {
        const key = await getTrailerKey(movie.id);
        if (key) {
          if (!cancelled) setTrailerId(key);
          break;
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [popMovies]);

  if (loading) return <Load />;
  if (error) return <div style={{ padding: 20 }}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.youtube}>
        {trailerId ? (
          <YouTube
            videoId={trailerId}
            opts={{
              width: "100%",
              height: "700",
              playerVars: { autoplay: 1, rel: 0, modestbranding: 1 },
            }}
            onEnd={(e) => e.target.stopVideo()}
          />
        ) : (
          <div style={{ height: 700, display: "grid", placeItems: "center", color: "white"  }}>
            No trailer available
          </div>
        )}
      </div>

      <div className={styles.flexWrapper}>
        <div className={styles.left}>
          <h1 className={styles.newMovies}>New Movies</h1>
          <div className={styles.gridContainer}>
            {movies.map((movie) => (
              <NewMovie
                key={movie.id}
                id={movie.id}
                coverImg={img780(movie.poster_path)}
                title={movie.title}
                summary={movie.overview || ""}
                genres={toGenreNames(movie)}
                rate={Math.round((movie.vote_average ?? 0) * 10) / 10}
                year={(movie.release_date || "").slice(0, 4)}
              />
            ))}
          </div>
        </div>

        <div className={styles.right}>
          <h1>Popular Movies</h1>
          {popMovies.map((movie) => (
            <PopMovie
              key={movie.id}
              id={movie.id}
              coverImg={img780(movie.poster_path)}
              title={movie.title || ""}
              summary={movie.overview || ""}
              genres={toGenreNames(movie)}
              rate={Math.round((movie.vote_average ?? 0) * 10) / 10}
              year={(movie.release_date || "").slice(0, 4)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
