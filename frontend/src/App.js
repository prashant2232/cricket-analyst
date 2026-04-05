import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import PlayerPage from "./pages/PlayerPage";
import ComparePage from "./pages/ComparePage";
import PickXIPage from "./pages/PickXIPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/"            element={<HomePage />} />
        <Route path="/player/:name" element={<PlayerPage />} />
        <Route path="/compare"     element={<ComparePage />} />
        <Route path="/pickxi"      element={<PickXIPage />} />
      </Routes>
    </Router>
  );
}

export default App;