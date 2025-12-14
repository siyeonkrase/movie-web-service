// Detail.js
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Load from "../components/Load";
import styles from "../components/cssModule/Detail.module.css";
import defaultBackImg from "../img/default_back.jpeg";
import defaultImg from "../img/default_Img.jpeg";
import { GENRE_MAP } from "../atom/genreMap";

function Detail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  // ✅ movie는 "객체"로 쓸 거니까 null이 맞음
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);

  const getMovie = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `https://nomad-movies.nomadcoders.workers.dev/movies/${id}`
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();

      const normalizedMovie =
        json?.data?.movie ?? json?.movie ?? json?.data ?? json ?? null;

      setMovie(normalizedMovie);
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

  const genres = Array.isArray(movie?.genre_ids)
    ? movie.genre_ids.map((gid) => GENRE_MAP[gid]).filter(Boolean)
    : Array.isArray(movie?.genres)
    ? movie.genres
        .map((g) => (typeof g === "string" ? g : g?.name))
        .filter(Boolean)
    : [];

  const desc = movie.overview ?? movie.description_full ?? movie.summary ?? movie.description ?? "";

  const backdrop =
    movie.backdrop_path ||
    movie.background_image_original ||
    defaultBackImg;

  const poster =
    movie.poster_path ||
    movie.medium_cover_image ||
    defaultImg;

  const rating = movie.vote_average ?? movie.rating ?? "—";
  const year =
    (typeof movie.release_date === "string" && movie.release_date.slice(0, 4)) ||
    movie.year ||
    "—";

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
            {typeof rating === "number"
              ? Number.isInteger(rating)
                ? `${rating}.0`
                : rating.toFixed(1)
              : rating}
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
