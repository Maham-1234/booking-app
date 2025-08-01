import { Routes, Route } from "react-router-dom";

// Public Pages
import LandingPage from "../pages/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import { ProtectedRoute } from "@/components/PageComponents/ProtectedRoute";
import { HomePage } from "@/pages/user/HomePage";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/user/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
