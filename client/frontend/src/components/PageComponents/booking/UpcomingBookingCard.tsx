import { Link } from "react-router-dom";
import type { Booking } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";

interface UpcomingBookingCardProps {
  booking: Booking;
}

export default function UpcomingBookingCard({
  booking,
}: UpcomingBookingCardProps) {
  const { event } = booking;
  if (!event) return null;
  return (
    <Link to={`/events/${event.id}`} className="block">
      <div className="flex flex-col sm:flex-row items-center space-x-4 p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
        <img
          src={event.image || "/placeholder.svg?height=120&width=160"}
          alt={event.title}
          className="w-full sm:w-32 h-24 sm:h-auto object-cover rounded-xl flex-shrink-0 mb-4 sm:mb-0"
        />
        <div className="flex-1">
          <h4 className="font-semibold text-lg">{event.title}</h4>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
            <div className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              {new Date(event.eventDate).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1.5" />
              {event.location}
            </div>
          </div>
        </div>
        <div className="self-start mt-2 sm:mt-0">
          <Badge
            className={`${
              booking.status === "confirmed"
                ? "bg-green-500/20 text-green-600"
                : "bg-yellow-500/20 text-yellow-600"
            } capitalize`}
          >
            {booking.status}
          </Badge>
        </div>
      </div>
    </Link>
  );
}
