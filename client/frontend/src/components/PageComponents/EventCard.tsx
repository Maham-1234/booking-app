import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Ticket } from "lucide-react";
import type { Event } from "@/types";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const formattedDate = new Date(event.eventDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const imageUrl = event.image;

  return (
    <Link to={`/events/${event.id}`}>
      <Card className="overflow-hidden h-full group transition-all hover:shadow-xl hover:-translate-y-1">
        <div className="relative">
          <img
            src={imageUrl ?? undefined}
            alt={event.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-bold mb-2 truncate">{event.title}</h3>
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{event.location}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold text-primary">
              ${Number(event.price).toFixed(2)}
            </p>
            <div className="flex items-center text-sm">
              <Ticket className="w-4 h-4 mr-2" />
              <span>{event.availableSeats} seats left</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
