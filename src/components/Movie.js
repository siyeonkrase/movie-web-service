import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "./cssModule/Movie.module.css"
import defaultImg from "../img/default_Img.jpeg";
function Movie({ id, coverImg, title, summary, genres, rate, year }) {
  const onErrorImg = (event) => {
    event.target.src = defaultImg;
  }

  const safeGenres = Array.isArray(genres) ? genres : [];
  const firstGenre =
    safeGenres.length === 0
      ? "Unknown"
      : typeof safeGenres[0] === "string"
      ? safeGenres[0]
      : safeGenres[0]?.name || "Unknown";

  const safeTitle = typeof title === "string" ? title : "";
  const safeYear = year ?? "";
  const safeRate = typeof rate === "number" ? rate : Number(rate);

  return (
    <div className={styles.container}>
      <Link to={`/movie/${id}`}><figure><img src={coverImg} alt="" onError={onErrorImg} /></figure></Link>
      <div className={styles.genre}>{firstGenre}</div>
      <br />
      <div className={styles.info}>
        <Link to={`/movie/${id}`}>{safeTitle.length < 25 ? safeTitle : `${safeTitle.slice(0, 25)}...`}</Link>
        <br />
        <Link to={`/movie/${id}`}><p>{safeYear}</p></Link>
      </div>
      {/* <p>{summary}</p>
      <ul>
        {genres.map((genre) => (
          <li key={genre}>
            {genre}
          </li>
        ))}
      </ul> */}
      <div className={styles.rate}>⭐{Number.isInteger(safeRate) ? `${safeRate}.0` : safeRate}</div>
    </div>

  );
}

Movie.propTypes = {
  id: PropTypes.number.isRequired,
  coverImg: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  genres: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default Movie;