import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ListFilter } from "lucide-react";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";

export interface FilterValues {
  search: string;
  sort: string;
}

interface EventFilterBarProps {
  onFilterChange: (filters: FilterValues) => void;
  initialFilters: FilterValues;
}

export function EventFilterBar({
  onFilterChange,
  initialFilters,
}: EventFilterBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialFilters.search);
  const [sortOrder, setSortOrder] = useState(initialFilters.sort);

  const [debouncedSearch] = useDebounce(searchTerm, 500);

  useEffect(() => {
    onFilterChange({
      search: debouncedSearch,
      sort: sortOrder,
    });
  }, [debouncedSearch, sortOrder, onFilterChange]);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
      {/* Search Input */}
      <div className="relative w-full sm:flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for events by title or location..."
          className="pl-10 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Sort Select Dropdown */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <ListFilter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="eventDate">Sort by Date</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
