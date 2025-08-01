import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useEvents } from "@/contexts/EventContext";
import { useBookings } from "@/contexts/BookingContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Loader2,
  AlertCircle,
} from "lucide-react";

import InfoItem from "@/components/PageComponents/InfoItem";
import BookingSidebar from "@/components/PageComponents/BookingSidebar";

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const {
    event,
    isLoading: isEventLoading,
    error: eventError,
    fetchEventById,
    clearEvent,
  } = useEvents();
  const { clearError: clearBookingError } = useBookings();

  useEffect(() => {
    if (id) {
      fetchEventById(Number(id));
    }

    return () => {
      clearEvent();
      clearBookingError();
    };
  }, [id, fetchEventById, clearEvent, clearBookingError]);

  if (isEventLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (eventError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-red-500">
        <div>
          <AlertCircle className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Failed to Load Event</h2>
          <p>{eventError}</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <h2 className="text-2xl font-bold">Event not found.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-8 rounded-3xl overflow-hidden shadow-lg">
          <img
            src={event.image || "/placeholder.svg?height=800&width=1200"}
            alt={event.title}
            className="w-full h-64 md:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 shadow-text">
              {event.title}
            </h1>
            <div className="flex items-center space-x-4 text-white/90">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                <span>{event.totalSeats - event.availableSeats} attending</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                <span>Starts from ${Number(event.price).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-2xl">About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-2xl">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoItem icon={<Calendar className="w-6 h-6" />} title="Date">
                  {new Date(event.eventDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </InfoItem>
                <InfoItem icon={<Clock className="w-6 h-6" />} title="Time">
                  {new Date(event.eventDate).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </InfoItem>
                <InfoItem
                  icon={<MapPin className="w-6 h-6" />}
                  title="Location"
                >
                  {event.location}
                </InfoItem>
                <InfoItem icon={<Users className="w-6 h-6" />} title="Capacity">
                  {event.totalSeats} seats
                </InfoItem>
              </CardContent>
            </Card>

            {/* You can add more sections like speakers or agenda here if they are part of your event data model */}
          </div>

          {/* Sidebar */}
          <BookingSidebar event={event} />
        </div>
      </div>
    </div>
  );
}
