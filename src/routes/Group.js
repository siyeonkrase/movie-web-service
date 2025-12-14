import { Link, useParams } from "react-router-dom";
import styles from "../components/cssModule/Group.module.css";
import Load from "../components/Load.js";
import MoviesGroup from "../components/MoviesGroup.js";
import { discoverByGenre } from "../api/tmdb";
import { useEffect, useMemo, useState } from "react";
import defaultBackImg from "../img/default_back.jpeg";
import Snow from "../components/Snow";

const pageArr = [1,2,3,4,5,6,7,8,9,10];

function Group() {
  const { page, group } = useParams();

  const genreId = useMemo(() => Number(group), [group]);
  const pageNum = useMemo(() => Number(page) || 1, [page]);

  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const isChristmas = Number(group) === 10751;
  useEffect(() => {
    let cancelled = false;

    async function run() {
      // ✅ 여기서만 setState
      setLoading(true);
      setError(null);

      // ✅ 숫자 아닌 group(예: "holiday")는 여기서 처리하고 끝
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
  }, [genreId, pageNum, group]);

  return (
    <>
    {isChristmas && <Snow />}
    
    <div className={styles.container}
      style={
        isChristmas
          ? {
              backgroundImage: `url(${defaultBackImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : undefined
      }
    >
      {loading ? (
        <Load />
      ) : error ? (
        <div style={{ padding: 20 }}>Error: {error}</div>
      ) : movies.length === 0 ? (
        <div style={{ padding: 20, color: "white" }}>No movies found.</div>
      ) : (
        <div className={styles.gridContainer}>
          {movies.map((m) => (
            <MoviesGroup key={m.id} movie={m} />
          ))}
        </div>
      )}

      {loading ? null : (
        <div className={styles.footer}>
          <div className={styles.pages}>
            {pageArr.map((p) => (
              <div className={styles.pageNum} key={p}>
                <Link to={`/page/${group}/${p}`}>{p}</Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default Group;