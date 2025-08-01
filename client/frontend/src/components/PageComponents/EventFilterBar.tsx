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
  const [debouncedSearch] = useDebounce(searchTerm, 300); // debounce by 300ms

  useEffect(() => {
    onFilterChange({ ...initialFilters, search: debouncedSearch });
  }, [debouncedSearch, initialFilters, onFilterChange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (value: string) => {
    onFilterChange({ ...initialFilters, sort: value });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
      <div className="relative w-full sm:flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for events by title or location..."
          className="pl-10 w-full"
          onChange={handleSearchChange}
          defaultValue={initialFilters.search}
        />
      </div>
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <Select
          onValueChange={handleSortChange}
          defaultValue={initialFilters.sort}
        >
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
