import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useBookings } from "@/contexts/BookingContext";
import type { Event } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Ticket, CheckCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BookingSidebarProps {
  event: Event;
}

export default function BookingSidebar({ event }: BookingSidebarProps) {
  const [ticketCount, setTicketCount] = useState(1);
  const { isAuthenticated } = useAuth();
  const { createBooking, isLoading, error } = useBookings();
  const navigate = useNavigate();

  const seatPercentage =
    ((event.totalSeats - event.availableSeats) / event.totalSeats) * 100;

  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }

    try {
      await createBooking({
        eventId: event.id,
        quantity: ticketCount,
      });
      alert("Booking successful!");
      navigate("/user/bookings");
    } catch (err) {
      console.error("Booking failed:", err);
    }
  };

  return (
    <div className="space-y-6 lg:sticky top-8">
      <Card className="glass-card border-0 shadow-lg">
        <CardHeader>
          <p className="text-3xl font-bold text-primary">
            ${Number(event.price).toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground -mt-1">per ticket</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Availability */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Availability</span>
              <span className="font-medium text-primary">
                {event.availableSeats} of {event.totalSeats} seats left
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${seatPercentage}%` }}
              />
            </div>
          </div>
          <Separator />
          {/* Ticket Count */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Number of tickets</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                  disabled={ticketCount <= 1}
                >
                  -
                </Button>
                <span className="w-8 text-center font-bold text-lg">
                  {ticketCount}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() =>
                    setTicketCount(
                      Math.min(event.availableSeats, ticketCount + 1)
                    )
                  }
                  disabled={ticketCount >= event.availableSeats}
                >
                  +
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-primary">
                ${(Number(event.price) * ticketCount).toFixed(2)}
              </span>
            </div>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button
            className="w-full rounded-2xl"
            size="lg"
            onClick={handleBooking}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Ticket className="w-4 h-4 mr-2" />
            )}
            {isAuthenticated ? "Book Now" : "Login to Book"}
          </Button>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground justify-center">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Secure payment and instant confirmation</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
