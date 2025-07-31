import { apiClient } from "../axiosClient";
import type {
  Booking,
  CreateBookingData,
  UpdateBookingData,
  ApiResponse,
  PaginatedData,
  BookingFilters,
} from "../../types";

export interface BookingResponse {
  booking: Booking;
}
/**
 * Get all bookings - Admin only
 * Supports pagination, status filtering, and search by event title/location
 * @param {BookingFilters} filters - status,search, pagination filters
 * @returns {PaginatedData<Booking>} bookings list
 */
export const getAllBookings = async (
  filters: BookingFilters = {}
): Promise<ApiResponse<PaginatedData<Booking>>> => {
  const { page = 1, limit = 9, status = "confirmed", search = "" } = filters;
  const queryParameters = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    status,
  });
  if (search) queryParameters.append("search", search);

  return apiClient.get(`/bookings/all?${queryParameters.toString()}`);
};

/**
 * Get user's own bookings
 * @param {BookingFilters} filters
 * @returns {PaginatedData<Booking>} bookings list
 */
export const getUserBookings = async (
  filters: BookingFilters = {}
): Promise<ApiResponse<PaginatedData<Booking>>> => {
  const { page = 1, limit = 10, status = "confirmed", search = "" } = filters;
  const queryParameters = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    status,
  });
  if (search) queryParameters.append("search", search);

  return apiClient.get(`/bookings?${queryParameters.toString()}`);
};

/**
 * Create a booking
 * @param {CreateBookingData} bookingData
 * @returns booking data- including event and user's attributes
 */
export const createBooking = async (
  data: CreateBookingData
): Promise<ApiResponse<BookingResponse>> => {
  return apiClient.post("/bookings", data);
};

/**
 * Update a booking (quantity only)
 * @param {UpdateBookingData}bookingData - partial booking data
 * @param {number} bookingId - booking id
 * @returns updated booking object
 */
export const updateBooking = async (
  bookingId: number,
  data: UpdateBookingData
): Promise<ApiResponse<BookingResponse>> => {
  return apiClient.put(`/bookings/${bookingId}`, data);
};

/**
 * Cancel a booking
 * @param {number} bookingId
 * @returns status,message , data{BOOKING}
 */
export const cancelBooking = async (
  bookingId: number
): Promise<ApiResponse<BookingResponse>> => {
  return apiClient.delete(`/bookings/${bookingId}`);
};
