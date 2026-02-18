import { Link } from "react-router-dom";
import styles from "./cssModule/Page.module.css";

export default function Page({
  currentPage,
  pages = 10,
  makeTo,
}) {
  const pageArr = Array.from({ length: pages }, (_, i) => i + 1);

  return (
    <div className={styles.footer}>
      <div className={styles.pages}>
        {pageArr.map((page) => (
          <div key={page} className={styles.pageNum}>
            <Link className={page === currentPage ? styles.activePage : ""} to={makeTo(page)}>
              {page}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
