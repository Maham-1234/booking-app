import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; // Your existing auth hook
import { Loader2 } from 'lucide-react';

/**
 * Defines the props for the RoleGuard.
 * @param allowedRoles An array of role strings permitted to access the nested routes.
 */
interface RoleGuardProps {
  allowedRoles: string[];
}

/**
 * A layout route guard that checks for authentication and user role.
 * If authorized, it renders the nested child routes via the <Outlet /> component.
 * Otherwise, it redirects the user appropriately.
 */
export const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 1. Show a loading indicator while auth status is being determined.
  // This is crucial to prevent a "flash" of content or premature redirects.
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  // 2. If not authenticated, redirect to the login page.
  // We pass the intended destination so we can redirect back after login.
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Check if the authenticated user's role is in the list of allowed roles.
  // The 'user' object is guaranteed to exist if isAuthenticated is true.
  return user && allowedRoles.includes(user.role) ? (
    // If authorized, render the child routes defined in your router setup.
    <Outlet />
  ) : (
    // If authenticated but NOT authorized, redirect to an "Unauthorized" page.
    <Navigate to="/unauthorized" replace />
  );
};