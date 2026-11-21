import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/homePage";
import AboutPage from "./pages/AboutPage";
import PropertyPage from "./pages/PropertyPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/property" element={<PropertyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
