import { Routes, Route } from "react-router-dom";

// Public Pages
import LandingPage from "../pages/LandingPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import { ProtectedRoute } from "@/components/PageComponents/ProtectedRoute";
import HomePage from "@/pages/user/HomePage";
import AllEventsPage from "@/pages/events/AllEventsPage";
import EventDetailsPage from "@/pages/events/EventDetailPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import MyBookingsPage from "@/pages/user/MyBookingsPage";
import AdminDashboardPage from "@/pages/admin/DashboardPage";
import { RoleGuard } from "@/components/PageComponents/RoleGuard";
import CreateEventPage from "@/pages/admin/events/CreateEventPage";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/events" element={<AllEventsPage />} />
      <Route path="/events/:id" element={<EventDetailsPage />} />

      {/* <Route
        path="/user/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      /> */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      {/* <Route
        path="/user/bookings"
        element={
          <ProtectedRoute>
            <MyBookingsPage />
          </ProtectedRoute>
        }
      /> */}
      <Route element={<RoleGuard allowedRoles={["user"]} />}>
        <Route
          path="/user/bookings"
          element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route element={<RoleGuard allowedRoles={["admin"]} />}>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/events/create" element={<CreateEventPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
