import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "./cssModule/PopMovie.module.css"
import defaultImg from "../img/default_Img.jpeg";
function PopMovie({ id, coverImg, title, summary, genres, rate, year }) {
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
    <Link to={`/movie/${id}`}>
      <div className={styles.container}>
        <img src={coverImg} alt="" className={styles.img} onError={onErrorImg} />
        {/* <div className={styles.title}>
          {title}
        </div>
        <br />
        <div className={styles.year}>
          <p>{year}</p>
        </div> */}
        <div className={styles.info}>
          {safeTitle}
          <br />
          {safeYear}
        </div>
        <div className={styles.info2}>
          <div className={styles.genre}>{firstGenre}</div>
          <div className={styles.rate}>⭐{Number.isInteger(safeRate) ? `${safeRate}.0` : safeRate}</div>
        </div>
      </div>
    </Link>
  );
}

PopMovie.propTypes = {
  id: PropTypes.number.isRequired,
  coverImg: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  genres: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default PopMovie;