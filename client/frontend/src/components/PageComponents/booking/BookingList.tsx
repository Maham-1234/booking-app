import type { Booking } from "@/types";
import BookingCard from "./BookingCard";
import { Frown } from "lucide-react";
import { Button } from "../../ui/button";
import { Link } from "react-router-dom";

interface BookingListProps {
  bookings: Booking[];
  onCancel: (bookingId: number) => void;
  isCancelling: boolean;
}

export default function BookingList({ bookings, onCancel, isCancelling }: BookingListProps) {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-20 bg-muted/20 rounded-2xl">
        <Frown className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold">No Bookings Found</h3>
        <p className="text-muted-foreground mb-6">
          You haven't made any bookings that match this filter yet.
        </p>
        <Button asChild className="rounded-2xl">
            <Link to="/events">Find Your Next Event</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {bookings.map((booking) => (
        <BookingCard 
            key={booking.id} 
            booking={booking} 
            onCancel={onCancel}
            isCancelling={isCancelling}
        />
      ))}
    </div>
  );
}