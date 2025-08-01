import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useCallback,
} from "react";
import * as bookingApi from "../api/modules/bookings";
import type {
  Booking,
  BookingFilters,
  CreateBookingData,
  UpdateBookingData,
  BookingContextType,
  PaginatedData,
} from "../types";

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [specificBooking, setSpecificBooking] = useState<Booking | null>(null);
  const [pagination, setPagination] = useState<
    PaginatedData<Booking>["pagination"] | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);
  const clearBooking = () => setSpecificBooking(null);

  const getAllBookings = useCallback(async (filters?: BookingFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await bookingApi.getAllBookings(filters);
      setBookings(response.data.events);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch all bookings.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUserBookings = useCallback(async (filters?: BookingFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await bookingApi.getUserBookings(filters);
      setBookings(response.data.events);
      setPagination(response.data.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch your bookings.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getBooking = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await bookingApi.getBookingById(id);
      setSpecificBooking(response.data.booking);
      return response.data.booking;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch booking.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  const createBooking = async (data: CreateBookingData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await bookingApi.createBooking(data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create booking.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBooking = async (id: number, data: UpdateBookingData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await bookingApi.updateBooking(id, data);
      const updatedBooking = response.data.booking;
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? updatedBooking : b))
      );

      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update booking.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelBooking = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await bookingApi.cancelBooking(id);
      const cancelledBooking = response.data.booking;

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? cancelledBooking : b))
      );
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to cancel booking.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value: BookingContextType = {
    bookings,
    specificBooking,
    pagination,
    isLoading,
    error,
    getAllBookings,
    getUserBookings,
    getBooking,
    createBooking,
    updateBooking,
    cancelBooking,
    clearBooking,
    clearError,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBookings must be used within a BookingProvider");
  }
  return context;
};
