import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Home from "./routes/Home";
import Group from "./routes/Group";
import TopRated from "./components/TopRated";
import Detail from "./routes/Detail";
import Navbar from "./components/Navbar";
import Search from "./components/Search";
import styles from "./components/cssModule/App.module.css"

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Navbar />
      <div className={styles.container}>
        <Routes>
          <Route path={`/`} element={<Home />} />
          <Route path={`/page/:group/:page`} element={<Group />} />
          <Route path="/top-rated/:page" element={<TopRated />} />
          <Route path={`/movie/:id`} element={<Detail />} />
          <Route path={`/search/:search`} element={<Search />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
