import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./cssModule/Search.module.css";
import Load from "./Load";
import MoviesGroup from "./MoviesGroup";
import defaultBackImg from "../img/default_back.jpeg";
import Snow from "../components/Snow"; // 크리스마스 눈 쓰고 싶으면

import { searchMovies, img780 } from "../api/tmdb"; // 아래 api 함수도 추가할 거임

const pageArr = [1,2,3,4,5,6,7,8,9,10];

function Search() {
  const { search } = useParams();
  const query = decodeURIComponent(search || "").trim();

  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
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
        setPage(1);

        if (!query) {
          setLoading(false);
          return;
        }

        const json = await searchMovies(query, 1);
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
  }, [query]);

  const goPage = async (p) => {
    try {
      setLoading(true);
      setError(null);
      setPage(p);

      const json = await searchMovies(query, p);
      setMovies(json.results || []);
    } catch (e) {
      setError(e?.message || "Search failed");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={styles.container}
      style={
        isChristmasQuery
          ? {
              backgroundImage: `url(${defaultBackImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {isChristmasQuery && <Snow />}

      {loading ? (
        <Load />
      ) : error ? (
        <div style={{ padding: 20 }}>Error: {error}</div>
      ) : (
        <>
          <div className={styles.gridContainer}>
            {movies.map((m) => (
              <MoviesGroup key={m.id} movie={m} />
            ))}
          </div>

          <div className={styles.footer}>
            <div className={styles.pages}>
              {pageArr.map((p) => (
                <button
                  key={p}
                  onClick={() => goPage(p)}
                  className={p === page ? styles.activePage : styles.pageBtn}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Search;
