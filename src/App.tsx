import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import LabPage from './pages/LabPage';
import DiseasesPage from './pages/DiseasesPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f5f0e8]">
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/lab" element={<LabPage />} />
          <Route path="/diseases" element={<DiseasesPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
