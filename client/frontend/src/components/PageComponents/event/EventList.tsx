import type { Event } from "@/types";
import EventCard from "./EventCard";

interface EventListProps {
  events: Event[];
}

export default function EventList({ events }: EventListProps) {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No events found at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
