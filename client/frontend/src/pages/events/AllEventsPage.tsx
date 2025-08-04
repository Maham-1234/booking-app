import { useState, useEffect, useCallback } from "react";
import { useEvents } from "@/contexts/EventContext";

import {
  EventFilterBar,
  type FilterValues,
} from "@/components/PageComponents/event/EventFilterBar";
import EventList from "@/components/PageComponents/event/EventList";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Loader2, AlertCircle } from "lucide-react";

export default function AllEventsPage() {
  const { events, pagination, isLoading, error, fetchAllEvents } = useEvents();

  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    sort: "eventDate",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = useCallback((newFilters: FilterValues) => {
    setCurrentPage(1);
    setFilters(newFilters);
  }, []);

  useEffect(() => {
    fetchAllEvents({
      page: currentPage,
      sort: filters.sort,
      search: filters.search,
    });
  }, [currentPage, filters, fetchAllEvents]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (pagination?.totalPages || 1)) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Discover Your Next Experience
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
            Browse through a curated list of events. Your next adventure awaits!
          </p>
        </div>

        {/* The Filter Bar component handles all filtering UI and logic */}
        <div className="mb-8">
          <EventFilterBar
            onFilterChange={handleFilterChange}
            initialFilters={filters}
          />
        </div>

        {/* Main Content Area: Conditionally renders loading, error, or the list */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">
              <AlertCircle className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Failed to Load Events
              </h3>
              <p className="text-red-400">{error}</p>
              <Button
                onClick={() => fetchAllEvents({ page: 1, ...filters })}
                className="mt-4 rounded-2xl"
              >
                Try Again
              </Button>
            </div>
          ) : (
            // The EventList component now handles the grid and the "no results" message
            <EventList events={events} />
          )}
        </div>

        {/* Pagination: Only render if not loading, no error, and more than one page exists */}
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
    </div>
  );
}
