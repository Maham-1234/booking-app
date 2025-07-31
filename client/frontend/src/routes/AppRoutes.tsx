import { Routes, Route } from 'react-router-dom';

// Public Pages
import LandingPage from '../pages/LandingPage';
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
};

export default AppRoutes;
