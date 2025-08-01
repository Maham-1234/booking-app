import { Link } from "react-router-dom";
import type { Booking } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Ticket, AlertTriangle, CheckCircle } from "lucide-react";

interface BookingCardProps {
  booking: Booking;
  onCancel: (bookingId: number) => void;
  isCancelling: boolean;
}

export default function BookingCard({ booking, onCancel, isCancelling }: BookingCardProps) {
  const { event } = booking;
  const isPastEvent = new Date(event.eventDate) < new Date();

  // Determine badge color and icon based on status
  const statusStyles = {
    confirmed: "bg-green-500/10 text-green-700",
    cancelled: "bg-red-500/10 text-red-700",
    pending: "bg-yellow-500/10 text-yellow-700",
  };

  return (
    <Card className="glass-card border-0 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <img
          src={event.image || '/placeholder.svg?height=300&width=400'}
          alt={event.title}
          className="w-full md:w-1/3 h-48 md:h-auto object-cover"
        />
        <div className="flex-1">
          <CardContent className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">{event.title}</h3>
                <Badge className={`capitalize ${statusStyles[booking.status]}`}>
                  {booking.status}
                </Badge>
              </div>
              <div className="space-y-2 text-muted-foreground text-sm">
                <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {new Date(event.eventDate).toDateString()}</div>
                <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {event.location}</div>
                <div className="flex items-center"><Ticket className="w-4 h-4 mr-2" /> {booking.numberOfTickets} Ticket(s) - Total: ${booking.totalPrice.toFixed(2)}</div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-4">
                {isPastEvent && (
                    <p className="text-xs text-muted-foreground flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500"/> Event Completed</p>
                )}
                <Button variant="outline" asChild className="rounded-2xl bg-transparent">
                    <Link to={`/events/${event.id}`}>View Event</Link>
                </Button>
                <Button
                    variant="destructive"
                    onClick={() => onCancel(booking.id)}
                    disabled={booking.status === 'cancelled' || isCancelling || isPastEvent}
                    className="rounded-2xl"
                >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Cancel Booking
                </Button>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}