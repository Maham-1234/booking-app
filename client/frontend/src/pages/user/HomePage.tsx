import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBookings } from "@/contexts/BookingContext";
import { useEvents } from "@/contexts/EventContext";

import DashboardStatCard from "@/components/PageComponents/user/DashboardStatCard";
import UpcomingBookingCard from "@/components/PageComponents/booking/UpcomingBookingCard";
import RecommendedEventCard from "@/components/PageComponents/user/RecommendedEventCard";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Ticket,
  Plus,
  ArrowRight,
  Settings,
  Loader2,
  Frown,
  Heart,
} from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const {
    bookings,
    pagination: bookingPagination,
    isLoading: bookingsLoading,
    getUserBookings,
  } = useBookings();
  const { events, isLoading: eventsLoading, fetchAllEvents } = useEvents();

  // useEffect(() => {
  //   getUserBookings({ limit: 3, status: "confirmed" });
  //   console.log(bookings);
  //   fetchAllEvents({ limit: 4, sort: "-createdAt" }); // Fetch latest events as "recommended"
  // }, [getUserBookings, fetchAllEvents]);
  useEffect(() => {
    const fetchData = async () => {
      await getUserBookings({ limit: 3, status: "confirmed" });
      await fetchAllEvents({ limit: 4, sort: "-createdAt" });
    };

    fetchData();
  }, [getUserBookings, fetchAllEvents]);

  // useEffect(() => {
  //   console.log("Bookings updated:", bookings);
  // }, [bookings]);

  const upcomingBookings = useMemo(
    () =>
      (bookings || []).filter((b) => new Date(b.event.eventDate) > new Date()),
    [bookings]
  );

  const memberSince = useMemo(
    () => (user?.createdAt ? new Date(user.createdAt).getFullYear() : ""),
    [user]
  );

  const isLoading = bookingsLoading || eventsLoading;
  // useEffect(() => {
  //   console.log("Upcoming Bookings:", upcomingBookings);
  // }, [upcomingBookings]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Avatar className="w-16 h-16 border-4 border-primary/20">
              <AvatarImage
                src={`http://localhost:3000/uploads/avatars/${user?.avatar}`}
                alt={user?.name ?? undefined}
              />
              <AvatarFallback className="text-lg font-semibold bg-muted">
                {user?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {user?.name.split(" ")[0]}!
              </h1>
              <p className="text-muted-foreground">
                Member since {memberSince}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button asChild className="rounded-2xl">
              <Link to="/events">
                <Plus className="w-4 h-4 mr-2" /> Find Events
              </Link>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-2xl bg-transparent"
              asChild
            >
              <Link to="/profile">
                <Settings className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DashboardStatCard
            label="Total Bookings"
            value={bookingPagination?.totalResults || 0}
            icon={Ticket}
            color="text-blue-500"
            bgColor="bg-blue-500/10"
          />
          <DashboardStatCard
            label="Upcoming Events"
            value={upcomingBookings.length}
            icon={Calendar}
            color="text-green-500"
            bgColor="bg-green-500/10"
          />
          <DashboardStatCard
            label="Favorites"
            value="Coming Soon"
            icon={Heart}
            color="text-red-500"
            bgColor="bg-red-500/10"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Events */}
            <Card className="glass-card border-0">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-3 text-primary" />
                  Upcoming Bookings
                </CardTitle>
                <Button
                  variant="ghost"
                  asChild
                  className="text-primary hover:bg-primary/10"
                >
                  <Link to="/user/bookings">
                    View All <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                ) : upcomingBookings.length > 0 ? (
                  upcomingBookings.map((booking) => (
                    <UpcomingBookingCard key={booking.id} booking={booking} />
                  ))
                ) : (
                  <div className="p-12 text-center text-muted-foreground bg-muted/20 rounded-2xl">
                    <Frown className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground">
                      No Upcoming Bookings
                    </h3>
                    <p className="mb-6">
                      It looks like you're free! Time to find your next event.
                    </p>
                    <Button asChild className="rounded-2xl">
                      <Link to="/events">Browse Events</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recommended Events */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Ticket className="w-5 h-5 mr-3 text-primary" />
                  Recently Added Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.map((event) => (
                      <RecommendedEventCard key={event.id} event={event} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  asChild
                  className="w-full justify-start rounded-2xl bg-transparent h-12 text-base"
                >
                  <Link to="/profile">
                    <Settings className="w-4 h-4 mr-3" /> My Profile
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="w-full justify-start rounded-2xl bg-transparent h-12 text-base"
                >
                  <Link to="/user/bookings">
                    <Ticket className="w-4 h-4 mr-3" /> My Bookings
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="w-full justify-start rounded-2xl bg-transparent h-12 text-base"
                >
                  <Link to="/events">
                    <Plus className="w-4 h-4 mr-3" /> Discover More Events
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
