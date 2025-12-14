import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "./cssModule/MoviesGroup.module.css"
import defaultImg from "../img/default_Img.jpeg";
import { img780 } from "../api/tmdb";

function MoviesGroup({ movie }) {
  if (!movie) return null;
  const id = movie.id;
  const title = movie.title || "Untitled";
  const year = (movie.release_date || "").slice(0, 4) || "—";
  const coverImg = img780(movie.poster_path) || defaultImg;

  const onErrorImg = (e) => {
    e.currentTarget.src = defaultImg;
  };

  return (
    <div className={styles.container}>
      <Link to={`/movie/${id}`}>
        <figure className={styles.figure}>
          <img src={coverImg} alt={title} onError={onErrorImg} />
        </figure>
      </Link>
      <div className={styles.info}>
        <Link to={`/movie/${id}`}>{title.length < 25 ? title : `${title.slice(0, 25)}...`}</Link>
        <Link to={`/movie/${id}`}><p>{year}</p></Link>
      </div>
    </div>
  );
}

MoviesGroup.propTypes = {
  id: PropTypes.number,
  coverImg: PropTypes.string,
  title: PropTypes.string,
  summary: PropTypes.string,
  genres: PropTypes.arrayOf(PropTypes.string)
}

export default MoviesGroup;