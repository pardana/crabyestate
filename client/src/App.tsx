import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import PropertyPage from "./pages/PropertyPage";
import PublicLayout from "./layouts/PublicLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/property" element={<PropertyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
