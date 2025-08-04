import { useState, useEffect } from "react";
import { useBookings } from "@/contexts/BookingContext";

import BookingList from "@/components/PageComponents/booking/BookingList";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";

type BookingStatus = "confirmed" | "cancelled";

export default function MyBookingsPage() {
  const {
    bookings,
    pagination,
    isLoading,
    error,
    getUserBookings,
    cancelBooking,
  } = useBookings();

  const [statusFilter, setStatusFilter] = useState<BookingStatus>("confirmed");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null
  );

  useEffect(() => {
    getUserBookings({
      page: currentPage,
      limit: 5,
      status: statusFilter === "confirmed" ? undefined : statusFilter,
    });
  }, [currentPage, statusFilter, getUserBookings]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (pagination?.totalPages || 1)) {
      setCurrentPage(newPage);
    }
  };
  const handleCancelBooking = (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setShowCancelModal(true);
  };

  const confirmCancellation = async () => {
    if (selectedBookingId !== null) {
      await cancelBooking(selectedBookingId);
    }
    setShowCancelModal(false);
    setSelectedBookingId(null);
  };

  const cancelModal = () => {
    setShowCancelModal(false);
    setSelectedBookingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto max-w-5xl px-4 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">My Bookings</h1>
          <p className="text-lg text-muted-foreground mt-2">
            View, manage, and track all your event bookings in one place.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <Tabs
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as BookingStatus)}
          >
            <TabsList>
              <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Main Content Area */}
        <div className="min-h-[400px]">
          {isLoading && !bookings.length ? ( // Show loader only on initial load
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">
              <AlertCircle className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Failed to Load Bookings
              </h3>
              <p className="text-red-400">{error}</p>
            </div>
          ) : (
            <BookingList
              bookings={bookings}
              onCancel={handleCancelBooking}
              isCancelling={isLoading} // Pass loading state for cancel button
            />
          )}
        </div>

        {/* Pagination */}
        {!isLoading && !error && pagination && pagination.totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink isActive>
                    Page {currentPage} of {pagination.totalPages}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={
                      currentPage === pagination.totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent>
          <DialogHeader>
            Are you sure you want to cancel this booking?
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone.
          </p>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={cancelModal}>
              No, Keep It
            </Button>
            <Button variant="destructive" onClick={confirmCancellation}>
              Yes, Cancel It
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
