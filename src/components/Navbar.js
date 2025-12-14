import { Link, useNavigate } from "react-router-dom";
import styles from "./cssModule/Navbar.module.css";
import { Group_obj, Group_key_arr } from "../atom/NavList";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBars } from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const changeValue = (event) => setSearch(event.target.value);

  const handleSearch = () => {
    if (search.trim()) navigate(`/search/${encodeURIComponent(search.trim())}`);
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setMenuOpen(!isMobile);
  }, []);

  const goGroup = (key) => {
    const value = Group_obj[key];
    return `/group?type=genre&value=${value}&page=1`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageName}>
        <Link to="/">FlickFacts</Link>
      </div>

      <div className={styles.hamburger} onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars} />
      </div>

      <div className={`${styles.groupLinks} ${menuOpen ? styles.active : ""}`}>
        {Group_key_arr.map((key) => (
          <div className={styles.link} key={key}>
            <Link
              to={key === "High Rating" ? "/top-rated/1" : `/page/${Group_obj[key]}/1`} onClick={() => setMenuOpen(false)}>
              {key}
            </Link>
          </div>
        ))}

        {/* 🎄 Christmas (holiday 라는 별도 타입) */}
        <div className={styles.christmas}>
          <Link
            to={`/page/10751/1`}
            onClick={() => setMenuOpen(false)}
          >
            <span>🎄</span><span>C</span><span>h</span><span>r</span><span>i</span>
            <span>s</span><span>t</span><span>m</span><span>a</span><span>s</span>
            <span>🎄</span>
          </Link>
        </div>
      </div>

      <div className={styles.searchInput}>
        <input
          type="text"
          placeholder="Search Movie!"
          value={search}
          onChange={changeValue}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
    </div>
  );
}

export default Navbar;