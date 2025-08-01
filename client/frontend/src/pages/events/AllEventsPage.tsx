// // src/pages/EventsListPage.tsx

// import { useState, useEffect, useCallback } from "react";
// import { useSearchParams } from 'react-router-dom';

// // Import Contexts & Hooks
// import { useEvents } from "@/contexts/EventContext";

// // Import Components
// import EventList from "@/components/PageComponents/EventList";
// import { EventFilterBar, FilterValues } from "@/components/PageComponents/EventFilterBar";
// import { Button } from "@/components/ui/button";
// import { Spinner } from "@/components/ui/Spinner"; // Assuming you have a Spinner component

// // Import Icons
// import { Calendar, Ticket } from "lucide-react";

// export default function EventsListPage() {
//   // Get state and functions from the EventContext
//   const { events, pagination, isLoading, error, fetchAllEvents } = useEvents();

//   // Use URL search params to manage filter state, making them shareable
//   const [searchParams, setSearchParams] = useSearchParams();

//   // Initialize filter state from URL or with defaults
//   const [filters, setFilters] = useState<FilterValues>({
//     search: searchParams.get('search') || '',
//     sort: searchParams.get('sort') || 'eventDate',
//   });
  
//   // Initialize page state
//   const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);

//   // This function is memoized to prevent re-renders
//   const handleFilterChange = useCallback((newFilters: FilterValues) => {
//     setFilters(newFilters);
//     setCurrentPage(1); // Reset to first page on filter change
//     const params = new URLSearchParams();
//     if (newFilters.search) params.set('search', newFilters.search);
//     if (newFilters.sort) params.set('sort', newFilters.sort);
//     params.set('page', '1');
//     setSearchParams(params);
//   }, [setSearchParams]);

//   const handlePageChange = (newPage: number) => {
//     setCurrentPage(newPage);
//     const params = new URLSearchParams(searchParams);
//     params.set('page', String(newPage));
//     setSearchParams(params);
//   };

//   // Effect to fetch events whenever filters or page change
//   useEffect(() => {
//     fetchAllEvents({
//       page: currentPage,
//       limit: 9, // Or your preferred limit
//       search: filters.search,
//       sort: filters.sort,
//     });
//   }, [filters, currentPage, fetchAllEvents]);

//   return (
//     <MainLayout>
//       <div className="flex flex-col min-h-screen">
//         {/* Top Section - Title and Filters */}
//         <section className="bg-muted/30 border-b">
//           <div className="container mx-auto px-4 py-12">
//             <div className="max-w-3xl">
//               <div className="flex items-center gap-3 mb-4">
//                  <Ticket className="w-8 h-8 text-primary" />
//                  <h1 className="text-4xl font-bold">Explore Events</h1>
//               </div>
//               <p className="text-lg text-muted-foreground mb-6">
//                 Find your next experience. Search for events, filter by category, and sort by date or price to find exactly what you're looking for.
//               </p>
//               <EventFilterBar 
//                 onFilterChange={handleFilterChange}
//                 initialFilters={filters}
//               />
//             </div>
//           </div>
//         </section>

//         {/* Main Content - Event Grid */}
//         <main className="flex-grow container mx-auto px-4 py-12">
//           {isLoading && (
//             <div className="flex justify-center items-center h-64">
//               <Spinner size="lg" />
//             </div>
//           )}
//           {!isLoading && error && (
//              <div className="text-center py-12 text-red-500">
//                 <p>Error: {error}</p>
//              </div>
//           )}
//           {!isLoading && !error && (
//             <>
//               <EventList events={events} />
//               {pagination && pagination.totalPages > 1 && (
//                 <div className="flex justify-center mt-12">
//                   <div className="flex items-center gap-2">
//                     <Button 
//                       onClick={() => handlePageChange(currentPage - 1)} 
//                       disabled={currentPage === 1}
//                       variant="outline"
//                     >
//                       Previous
//                     </Button>
//                     <span className="text-sm text-muted-foreground">
//                       Page {pagination.page} of {pagination.totalPages}
//                     </span>
//                     <Button 
//                       onClick={() => handlePageChange(currentPage + 1)} 
//                       disabled={currentPage === pagination.totalPages}
//                       variant="outline"
//                     >
//                       Next
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </main>
//       </div>
//     </MainLayout>
//   );
// }