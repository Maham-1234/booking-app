import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"; // Import Badge for styling the status
import type { Booking } from "@/types"; // Import the Booking type


interface AdminBookingDataTableProps {
  bookings: Booking[];
}


export default function AdminBookingDataTable({ bookings }: AdminBookingDataTableProps) {
  
  const getStatusBadgeVariant = (status: 'confirmed' | 'cancelled' ) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/10 text-green-700';
      case 'cancelled':
        return 'bg-red-500/10 text-red-700';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event Title</TableHead>
            <TableHead>Booked By</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Booked</TableHead>
            <TableHead>Total Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings && bookings.length > 0 ? (
            bookings.map((booking) => (
              // Use the unique booking.id as the key
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.event?.title}</TableCell>
                <TableCell>{booking.user?.name || "N/A"}</TableCell>
                <TableCell>
                  <Badge className={`capitalize ${getStatusBadgeVariant(booking.status)}`}>
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(booking.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>${Number(booking.totalAmount).toFixed(2)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No bookings found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}