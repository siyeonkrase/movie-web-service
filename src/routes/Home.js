import { useEffect, useState } from "react";
import Load from "../components/Load";
import Movie from "../components/Movie";
import PopMovie from "../components/PopMovie";
import styles from "../components/cssModule/Home.module.css";
import { GENRE_MAP } from "../atom/genreMap";
import YouTube from "react-youtube";
import { discoverNewMovies, discoverTopRated, getTrailerKey, img780 } from "../api/tmdb";

const toGenreNames = (m) =>
  Array.isArray(m?.genre_ids)
    ? m.genre_ids.map((id) => GENRE_MAP[id]).filter(Boolean)
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
          discoverTopRated(1),
        ]);

        setMovies(newJson.results || []);
        setPopMovies((topJson.results || []).slice(0, 8));
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
      for (const m of popMovies) {
        const key = await getTrailerKey(m.id);
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
            onEnd={(e) => e.target.stopVideo(0)}
          />
        ) : (
          <div style={{ height: 700, display: "grid", placeItems: "center" }}>
            No trailer available
          </div>
        )}
      </div>

      <div className={styles.flexWrapper}>
        <div className={styles.left}>
          <h1 className={styles.newMovies}>New Movies</h1>
          <div className={styles.gridContainer}>
            {movies.map((m) => (
              <Movie
                key={m.id}
                id={m.id}
                coverImg={img780(m.poster_path)}
                title={m.title || ""}
                summary={m.overview || ""}
                genres={toGenreNames(m)}
                rate={Math.round((m.vote_average ?? 0) * 10) / 10}
                year={(m.release_date || "").slice(0, 4)}
              />
            ))}
          </div>
        </div>

        <div className={styles.right}>
          <h1>High Rating</h1>
          {popMovies.map((m) => (
            <PopMovie
              key={m.id}
              id={m.id}
              coverImg={img780(m.poster_path)}
              title={m.title || ""}
              summary={m.overview || ""}
              genres={toGenreNames(m)}
              rate={Math.round((m.vote_average ?? 0) * 10) / 10}
              year={(m.release_date || "").slice(0, 4)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
