import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useEvents } from "@/contexts/EventContext";
import { useBookings } from "@/contexts/BookingContext";

import { StatsCard } from "@/components/PageComponents/StatCard";

import AdminEventDataTable from "@/components/PageComponents/admin/AdminEventDataTable";
import AdminBookingDataTable from "@/components/PageComponents/admin/AdminBookingDataTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ticket, Calendar, DollarSign, Plus, Loader2 } from "lucide-react";
import UpdateEventModal from "@/components/PageComponents/event/UpdateEventModal";

import type { Event } from "@/types";
export default function AdminDashboardPage() {
  const {
    events,
    pagination: eventPagination,
    isLoading: eventsLoading,
    fetchAllEvents,
  } = useEvents();
  const {
    bookings,
    pagination: bookingPagination,
    isLoading: bookingsLoading,
    getAllBookings,
  } = useBookings();

  useEffect(() => {
    fetchAllEvents({});
    getAllBookings({});
  }, [fetchAllEvents, getAllBookings]);

  const totalRevenue = useMemo(
    () =>
      (bookings || []).reduce((acc, booking) => {
        return booking.status === "confirmed"
          ? acc + Number(booking.totalAmount)
          : acc;
      }, 0),
    [bookings]
  );

  const isLoading = bookingsLoading || eventsLoading;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleManageEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Oversee and manage all platform activity.
            </p>
          </div>
          <Button asChild className="rounded-2xl">
            <Link to="/admin/events/create">
              <Plus className="w-4 h-4 mr-2" />
              Create New Event
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            Icon={DollarSign}
            value={`$${totalRevenue.toFixed(2)}`}
            label="Total Revenue"
          />
          <StatsCard
            Icon={Ticket}
            value={String(bookingPagination?.totalResults || 0)}
            label="Total Bookings"
          />
          <StatsCard
            Icon={Calendar}
            value={String(eventPagination?.totalResults || 0)}
            label="Total Events"
          />
        </div>

        <Tabs defaultValue="events" className="space-y-4">
          <TabsList>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>

          {/* Manage Events Tab */}
          <TabsContent value="events">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle>Manage All Events</CardTitle>
                <CardDescription>
                  View, edit, or delete existing events.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-48">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                ) : (
                  <AdminEventDataTable
                    events={events || []}
                    onManageClick={handleManageEventClick}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle>Manage All Bookings</CardTitle>
                <CardDescription>
                  View details or take action on user bookings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-48">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                ) : (
                  <AdminBookingDataTable bookings={bookings || []} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <UpdateEventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
