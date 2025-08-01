import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useEvents } from "@/contexts/EventContext";
import { useAuth } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { SectionHeader } from "@/components/PageComponents/SectionHeader";
import {StatsCard} from "../components/PageComponents/StatCard";
import EventList from "@/components/PageComponents/EventList";

import { Calendar, Users, Star, ArrowRight, Sparkles } from "lucide-react";

export default function LandingPage() {
  const { events, isLoading, fetchAllEvents } = useEvents();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If the user is logged in, redirect to homepage
    if (isAuthenticated) {
      navigate("/user/home");
    } else {
      fetchAllEvents({ limit: 3, page: 1, sort: "eventDate" });
    }
  }, [isAuthenticated, navigate, fetchAllEvents]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 text-center">
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto">
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Discover & Connect
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Book Your Next <br />
              <span className="text-primary">Unforgettable Experience</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              From conferences to concerts, workshops to festivals — find and
              book your perfect experience with ease.
            </p>
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="px-8 py-6 text-lg rounded-xl"
                asChild
              >
                <Link to="/events">
                  Explore Events <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg rounded-xl"
                asChild
              >
                <Link to="/register">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatsCard Icon={Calendar} value="10,000+" label="Events Hosted" />
            <StatsCard Icon={Users} value="500K+" label="Happy Attendees" />
            <StatsCard Icon={Star} value="4.9/5" label="Average Rating" />
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Featured Events"
            subtitle="Don't miss out on these amazing upcoming events that are popular right now."
          />
          {isLoading && <div className="text-center">Loading events...</div>}
          {!isLoading && events.length > 0 && (
            <div className="mb-12">
              <EventList events={events} />
            </div>
          )}
          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link to="/events">
                View All Events <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 relative">
          <Card className="max-w-4xl mx-auto bg-background/50 border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Create Your Own Event?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of organizers who trust EventFlow to manage,
                promote, and sell out their events.
              </p>
              <Button
                size="lg"
                className="px-8 py-6 text-lg rounded-xl"
                asChild
              >
                <Link
                  to={isAuthenticated ? "/admin/events/create" : "/register"}
                >
                  Start Creating <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
