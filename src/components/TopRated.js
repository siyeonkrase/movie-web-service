import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Load from "../components/Load";
import MoviesGroup from "../components/MoviesGroup";
import styles from "../components/cssModule/Group.module.css";
import { discoverTopRated } from "../api/tmdb";

const pageArr = [1,2,3,4,5,6,7,8,9,10];

export default function TopRated() {
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
        const json = await discoverTopRated(pageNum);
        if (cancelled) return;
        setMovies(json.results || []);
      } catch (e) {
        if (cancelled) return;
        setError(e?.message || "Failed to load top rated");
        setMovies([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [pageNum]);

  return (
    <div className={styles.container}>
      {loading ? <Load /> : error ? (
        <div style={{ padding: 20 }}>Error: {error}</div>
      ) : (
        <div className={styles.gridContainer}>
          {movies.map((m) => <MoviesGroup key={m.id} movie={m} />)}
        </div>
      )}

      {loading ? null : (
        <div className={styles.footer}>
          <div className={styles.pages}>
            {pageArr.map((p) => (
              <div className={styles.pageNum} key={p}>
                <Link to={`/top-rated/${p}`}>{p}</Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
