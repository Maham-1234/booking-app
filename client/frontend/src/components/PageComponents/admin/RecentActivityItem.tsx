import type { Booking, Event } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ActivityItemData = {
    type: 'booking' | 'event';
    item: Booking | Event;
};

export default function RecentActivityItem({ activity }: { activity: ActivityItemData }) {
  const isBooking = (item: Booking | Event): item is Booking => {
    return activity.type === 'booking' && 'user' in item;
  };

  if (isBooking(activity.item)) {
    const booking = activity.item;
    return (
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src={`http://localhost:3000/uploads/avatars/${booking.user?.avatar}`} alt="User Avatar" />
          <AvatarFallback>{booking.user?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">
            <span className="font-bold">{booking.user?.name}</span> booked {booking.quantity} ticket(s).
          </p>
          <p className="text-sm text-muted-foreground">Event: "{booking.event.title}"</p>
        </div>
        <div className="ml-auto font-medium text-xs text-muted-foreground">{new Date(booking.createdAt).toLocaleDateString()}</div>
      </div>
    );
  }

  // Otherwise, it's an Event
  const event = activity.item as Event;
  return (
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
            <AvatarImage src={event.image ?? undefined} alt="Event Image" />
            <AvatarFallback>{event.title.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">New Event Created</p>
            <p className="text-sm text-muted-foreground">Title: "{event.title}"</p>
        </div>
        <div className="ml-auto font-medium text-xs text-muted-foreground">{new Date(event.createdAt).toLocaleDateString()}</div>
      </div>
  );
}