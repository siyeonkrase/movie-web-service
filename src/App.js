import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Home from "./routes/Home";
import Group from "./routes/Group";
import Detail from "./routes/Detail";
import Popular from "./routes/Popular";
import Search from "./routes/Search";
import Navbar from "./components/Navbar";
import styles from "./components/cssModule/App.module.css"

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Navbar />
      <div className={styles.container}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/page/:group/:page" element={<Group />} />
          <Route path="/popular-movies/:page" element={<Popular />} />
          <Route path="/movie/:id" element={<Detail />} />
          <Route path="/search/:search" element={<Search />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
