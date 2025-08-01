import {
  createContext,
  useState,
  useCallback,
  useContext,
  type ReactNode,
} from "react";

import type {
  Event,
  CreateEventData,
  UpdateEventData,
  PaginatedData,
  EventFilters,
} from "../types";

import {
  getAllEvents,
  getEventById,
  CreateEvent,
  UpdateEvent,
  deleteEvent as apiDeleteEvent,
} from "../api/modules/events";

import type { EventContextType } from "../types";

export const EventContext = createContext<EventContextType | undefined>(
  undefined
);

type EventProviderProps = {
  children: ReactNode;
};

export function EventProvider({ children }: EventProviderProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [pagination, setPagination] = useState<
    PaginatedData<Event>["pagination"] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);
  const clearEvent = useCallback(() => setEvent(null), []);

  const fetchAllEvents = useCallback(async (filters?: EventFilters) => {
    try {
      const response = await getAllEvents(filters);
      setEvents(response.data.events);
      setPagination(response.data.pagination);
    } catch (error: any) {
      setError(error.response?.data?.message || "failed to fetch events");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchEventById = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getEventById(id);
      setEvent(response.data.event);
    } catch (error: any) {
      setError(error.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createEvent = async (data: CreateEventData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await CreateEvent(data);
      return response;
    } catch (error: any) {
      setError(error.response?.data?.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateEvent = async (id: number, data: UpdateEventData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await UpdateEvent(id, data);
      const updatedEvent = response.data.event;
      setEvents((prev) => prev.map((e) => (e.id === id ? updatedEvent : e)));
      if (event?.id === id) {
        setEvent(updatedEvent);
      }
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update event.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEvent = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiDeleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      if (event?.id === id) {
        setEvent(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete event.");
    } finally {
      setIsLoading(false);
    }
  };

  const value: EventContextType = {
    events,
    event,
    pagination,
    isLoading,
    error,
    fetchAllEvents,
    fetchEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    clearEvent,
    clearError,
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
}

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
};
