import { Link } from "react-router-dom";

import { Calendar, Facebook, Twitter, Instagram } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-8">
          {/* Left Side: Brand and Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">EventFlow</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              © {currentYear} EventFlow, Inc.
            </p>
          </div>

          {/* Center: Essential Navigation Links */}
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link
              to="/events"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Events
            </Link>
            <Link
              to="/"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/login"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Register
            </Link>
          </div>

          {/* Right Side: Social Media Icons */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4 text-muted-foreground hover:text-primary" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 text-muted-foreground hover:text-primary" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-muted-foreground hover:text-primary" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
