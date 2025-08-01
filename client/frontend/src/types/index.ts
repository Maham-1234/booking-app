export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: number;
  title: string;
  description: string | null;
  eventDate: string;
  location: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  status: "active" | "inactive" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: number;
  userId: number;
  eventId: number;
  quantity: number;
  totalAmount: number;
  bookingReference: string;
  status: "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  event?: Event;
  user?: User;
}
export type Theme = "light" | "dark";

export interface UserProfileData {
  user: User;
  recentBookings: Booking[];
  favoriteEvents: Event[];

  // Additional calculated stats that don't live on the base User model
  stats: {
    totalBookings: number;
    upcomingEvents: number;
    // reviewsGiven: number; // <-- REMOVE THIS LINE
  };
}

// ========================================================================
// 2. API RESPONSE WRAPPERS
// These types match the consistent response structure of your API.
// ========================================================================

/**
 * Standard successful API response wrapper.
 * The main data is nested inside the `data` property.
 */
export interface ApiResponse<T> {
  status: "success";
  data: T;
  message?: string;
  results?: number; // Included for list endpoints
}

/**
 * Standard paginated data structure, as nested in API responses.
 */
export interface PaginatedData<T> {
  events: T[]; // or bookings, users, etc.
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
}

/**
 * Standard error response from the API, including validation errors.
 */
export interface ApiErrorResponse {
  status: "error";
  message: string;
  errors?: {
    field: string;
    message: string;
  }[];
}

// ========================================================================
// 3. API REQUEST (PAYLOAD) TYPES
// These types are for data sent TO the API (e.g., in POST/PUT requests).
// ========================================================================

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: "user" | "admin";
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  eventDate: string; // Must be in ISO 8601 format (e.g., "2025-12-31T19:00:00.000Z")
  location: string;
  totalSeats: number;
  price: number;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  status?: "active" | "inactive" | "completed" | "cancelled";
}

export interface CreateBookingData {
  eventId: number;
  quantity: number;
}

export interface UpdateBookingData {
  quantity: number;
}

// ========================================================================
// 4. FRONTEND-SPECIFIC TYPES (e.g., for Context)
// ========================================================================

// export interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   login: (data: LoginData) => Promise<void>;
//   register: (data: RegisterData) => Promise<void>;
//   logout: () => Promise<void>;
//   updateProfile: (data: UpdateProfileData) => Promise<void>;
//   uploadAvatar: (file: File) => Promise<void>;
// }

// Add these to your existing types file

export interface UserResponse {
  user: User;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<ApiResponse<UserResponse>>;
  register: (data: RegisterData) => Promise<ApiResponse<UserResponse>>;
  logout: () => Promise<void>;
  updateProfile: (
    data: UpdateProfileData
  ) => Promise<ApiResponse<UserResponse>>;
  uploadAvatar: (file: File) => Promise<ApiResponse<UserResponse>>;
  deleteAvatar: () => Promise<ApiResponse<UserResponse>>;
  refreshProfile: () => Promise<ApiResponse<UserResponse>>;
  clearError: () => void;
}

export interface EventResponse {
  event: Event;
}

export interface EventContextType {
  events: Event[];
  event: Event | null;
  pagination: PaginatedData<Event>["pagination"] | null;
  isLoading: boolean;
  error: string | null;
  fetchAllEvents: (filters?: EventFilters) => Promise<void>;
  fetchEventById: (id: number) => Promise<void>;
  createEvent: (data: CreateEventData) => Promise<ApiResponse<EventResponse>>;
  updateEvent: (
    id: number,
    data: UpdateEventData
  ) => Promise<ApiResponse<EventResponse>>;
  deleteEvent: (id: number) => Promise<void>;
  clearEvent: () => void;
  clearError: () => void;
}

export interface BookingResponse {
  booking: Booking;
}

export interface BookingContextType {
  bookings: Booking[];
  specificBooking: Booking | null;
  pagination: PaginatedData<Booking>["pagination"] | null;
  isLoading: boolean;
  error: string | null;
  getAllBookings: (filters?: BookingFilters) => Promise<void>;
  getUserBookings: (filters?: BookingFilters) => Promise<void>;
  getBooking: (id: number) => Promise<Booking | undefined>;
  createBooking: (
    data: CreateBookingData
  ) => Promise<BookingResponse | undefined>;
  updateBooking: (
    id: number,
    data: UpdateBookingData
  ) => Promise<BookingResponse | undefined>;
  cancelBooking: (id: number) => Promise<void>;
  clearBooking: () => void;
  clearError: () => void;
}

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export interface EventFilters {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
}

export interface BookingFilters {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}
