import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Calendar,
  User,
  Ticket,
  LogOut,
  Menu,
  LayoutDashboard,
  Moon,
  Sun,
} from "lucide-react";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle Theme"
    >
      {theme === "light" ? (
        <Moon className="h5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
};

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { isAuthenticated, user, logout } = useAuth();
  const isAdmin = user?.role === "admin";

  const VITE_API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const avatarUrl = user?.avatar
    ? `${VITE_API_BASE_URL}/uploads/avatars/${user.avatar}`
    : undefined;
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      <Link
        to="/events"
        className={
          isMobile
            ? "text-lg"
            : "text-sm font-medium hover:text-primary transition-colors"
        }
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
      >
        Events
      </Link>
      {/* only show this link if authenticated */}
      {isAuthenticated && !isAdmin && (
        <Link
          to="/user/bookings"
          className={
            isMobile
              ? "text-lg"
              : "text-sm font-medium hover:text-primary transition-colors"
          }
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
        >
          My Bookings
        </Link>
      )}
      {/* only show this if the user's role is admin */}
      {isAdmin && (
        <Link
          to="/admin/dashboard"
          className={
            isMobile
              ? "text-lg"
              : "text-sm font-medium hover:text-primary transition-colors"
          }
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
        >
          Admin
        </Link>
      )}
    </>
  );
    let destination = "/";
  if (isAuthenticated && user?.role === "admin") {
    destination = "/admin/dashboard";
  } else if (isAuthenticated && user?.role === "user") {
    destination = "/user/home";
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={destination} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">EventFlow</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLinks />
          </div>

          {/* Right side: Theme Toggle & User Menu/Auth Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <ThemeToggleButton />

            {isAuthenticated ? (
              <DropdownMenu>
                {/* DropDown is triggered when clicked on avatar's logo */}
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={avatarUrl}
                        alt={user?.name || "User Avatar"}
                      />
                      <AvatarFallback>
                        {user?.name?.substring(0, 2).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56" align="end" forceMount>
                  {/* Name and Email */}
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* link to profile */}
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {/* Link to bookings for user */}
                  {!isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/user/bookings">
                        <Ticket className="mr-2 h-4 w-4" />
                        <span>My Bookings</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {/* link to admin dashboard */}
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {/* logout */}
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // --- Login/Sign Up Buttons (Desktop) ---
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* --- Mobile Menu --- */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] p-4 sm:w-[400px]">
                    <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>

                  <div className="flex flex-col space-y-6 mt-8">
                    <NavLinks isMobile />
                    {!isAuthenticated && (
                      <>
                        <DropdownMenuSeparator />
                        <Button variant="ghost" asChild>
                          <Link
                            to="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Login
                          </Link>
                        </Button>
                        <Button asChild>
                          <Link
                            to="/register"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Sign Up
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
