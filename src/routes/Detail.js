import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Load from "../components/Load";
import styles from "../components/cssModule/Detail.module.css";
import defaultBackImg from "../img/default_back.jpeg";
import defaultImg from "../img/default_Img.jpeg";
import { getMovieDetail, img1280 } from "../api/tmdb";

function Detail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);

  const getMovie = async () => {
    try {
      setLoading(true);
      setError(null);

      const json = await getMovieDetail(id);
      
      setMovie(json);
    } catch (e) {
      setError(e.message || "Failed to load movie");
      setMovie(null);
    } finally {
      setLoading(false);
    }
  };

  const onErrorImg = (event) => {
    event.target.src = defaultImg;
  };

  const onErrorBackImg = (event) => {
    event.target.src = defaultBackImg;
  };

  useEffect(() => {
    getMovie();
  }, [id]);

  if (loading) return <Load />;

  if (error) return <div style={{ padding: 20 }}>Error: {error}</div>;
  if (!movie) return <div style={{ padding: 20 }}>No movie found.</div>;

  // console.log(movie);

  const genres = Array.isArray(movie?.genres) ? movie.genres.map((genre) => genre.name).filter(Boolean) : [];
  const desc = movie.overview ?? movie.description_full ?? movie.summary ?? movie.description ?? "";
  const backdrop = movie.backdrop_path ? img1280(movie.backdrop_path) : defaultBackImg;
  const poster = movie.poster_path ? img1280(movie.poster_path) : defaultImg;
  const rating = movie.vote_average ?? movie.rating ?? "—";
  const year = (movie.release_date || "").slice(0, 4) || "—";

  const title = movie.title || movie.original_title || "Untitled";

  return (
    <div>
      <div className={styles.background}>
        <img
          src={backdrop}
          alt="background"
          onError={onErrorBackImg}
        />
      </div>

      <div className={styles.show}>
        <img
          src={poster}
          alt={title}
          onError={onErrorImg}
          className={styles.poster}
        />

        <div className={styles.infoBox}>
          <h1>{title}</h1>
          <div className={styles.meta}>
            {year} · ⭐{" "}
            {Number.isInteger(rating) ? `${rating}.0` : rating.toFixed(1)}
          </div>

          <div className={styles.genres}>
            {genres.map((g, idx) => (
              <span className={styles.genreTag} key={`${g}-${idx}`}>
                {g}
              </span>
            ))}
          </div>

          <p className={styles.description}>
            {desc.length > 1400 ? `${desc.slice(0, 1400)}...` : desc}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Detail;
