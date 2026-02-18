import Load from "./Load";
import MovieCard from "./MovieCard.js";
import Page from "./Page";
import styles from "./cssModule/MovieGrid.module.css";
import Snow from "./Snow";

function MovieGrid({
  loading,
  error,
  movies,
  showSnow = false,
  backgroundStyle,
  pageNum,
  makeTo,
  pages = 10,
}) {
  return (
    <>
      {showSnow && <Snow />}

      <div className={styles.container} style={backgroundStyle}>
        {loading ? (
          <Load />
        ) : error ? (
          <div style={{ padding: 20 }}>Error: {error}</div>
        ) : !movies || movies.length === 0 ? (
          <div style={{ padding: 20, color: "white" }}>No movies found.</div>
        ) : (
          <div className={styles.gridContainer}>
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {loading ? null : <Page currentPage={pageNum} pages={pages} makeTo={makeTo} />}
      </div>
    </>
  );
}

export default MovieGrid;