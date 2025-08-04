import { Link } from "react-router-dom";
import type { Event } from "@/types";
import { Calendar } from "lucide-react";

interface RecommendedEventCardProps {
  event: Event;
}

export default function RecommendedEventCard({
  event,
}: RecommendedEventCardProps) {
  return (
    <Link to={`/events/${event.id}`} className="group cursor-pointer block">
      <div className="relative overflow-hidden rounded-2xl mb-3">
        <img
          src={event.image || "/placeholder.svg?height=240&width=400"}
          alt={event.title}
          className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <h4 className="font-semibold group-hover:text-primary transition-colors text-base truncate">
        {event.title}
      </h4>
      <div className="flex items-center justify-between mt-2">
        <div className="text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            {new Date(event.eventDate).toLocaleDateString()}
          </div>
        </div>
        <div className="text-lg font-bold text-primary">
          ${Number(event.price).toFixed(2)}
        </div>
      </div>
    </Link>
  );
}
