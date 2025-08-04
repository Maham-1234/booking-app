import { apiClient } from "../axiosClient";
import type {
  Event,
  CreateEventData,
  UpdateEventData,
  ApiResponse,
  PaginatedData,
  EventFilters,
  EventResponse,
} from "../../types";

/**
 * fetches a paginated list of all events
 */
export const getAllEvents = async (
  filters: EventFilters = {}
): Promise<ApiResponse<PaginatedData<Event>>> => {
  const { page = 1, limit = 9, sort = "eventDate", search = "" } = filters;
  const queryParameters = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort: sort,
  });
  if (search) {
    queryParameters.append("search", search);
  }
  return apiClient.get<ApiResponse<PaginatedData<Event>>>(
    `/events?${queryParameters.toString()}`
  );
};

/**
 * fetch a specific event by its id
 * @param id - the event id
 * @returns status and data: event
 */
export const getEventById = async (
  id: number
): Promise<ApiResponse<EventResponse>> => {
  return apiClient.get<ApiResponse<EventResponse>>(`/events/${id}`);
};

/**
 * create an event
 * @param {CreateEventData} eventData - of type CreateEventData
 * @returns status and created event
 */

export const CreateEvent = async (
  data: CreateEventData
): Promise<ApiResponse<EventResponse>> => {
  return apiClient.post<ApiResponse<EventResponse>>("/events", data);
};

/**
 * updates an event
 * @param {UpdateEventData} eventData - partial event data
 * @param {number} id - event id
 * @returns status and updated event
 */

export const UpdateEvent = async (
  id: number,
  data: UpdateEventData
): Promise<ApiResponse<EventResponse>> => {
  return apiClient.put<ApiResponse<EventResponse>>(`/events/${id}`, data);
};

/**
 * delete an event
 * @param {number} id - event id
 * @returns status and null
 */
export const deleteEvent = async (id: number): Promise<ApiResponse<null>> => {
  return apiClient.delete<ApiResponse<null>>(`/events/${id}`);
};
