import { Customer } from "@/types/delivery";
import { ChevronRight, X } from "lucide-react";
import { SearchInput } from "./search-input";
import { SearchResults } from "./search-result";

interface Props {
  searchQuery: string;
  filteredCustomers: Customer[];
  showSearchResults: boolean;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
  onSelectCustomer: (customer: Customer) => void;
  onBackToCompact: () => void;
  onCollapse: () => void;
  disabled: boolean;
  className: string;
  expandTrigger: string | null;
}

export function ExpandedMenu({
  searchQuery,
  filteredCustomers,
  showSearchResults,
  onSearchChange,
  onClearSearch,
  onSelectCustomer,
  onBackToCompact,
  onCollapse,
  disabled,
  className,
  expandTrigger,
}: Props) {
  return (
    <div className={`absolute inset-0 flex flex-col h-full ${className}`}>
      <div className="flex items-center justify-between p-4 border-b border-white/20 flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToCompact}
            disabled={disabled}
            className="p-2 hover:bg-white/30 rounded-lg"
            title="Mode compact"
          >
            <ChevronRight className="w-4 h-4 text-gray-600 rotate-180" />
          </button>
          <button
            onClick={onCollapse}
            disabled={disabled}
            className="p-2 hover:bg-white/30 rounded-lg"
            title="Fermer"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-4 flex-shrink-0">
        <div className="relative">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            onClear={onClearSearch}
            autoFocus={expandTrigger === "search"}
          />

          {showSearchResults && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50">
              <div className="bg-white/90 backdrop-blur-xl border border-white/30 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                <SearchResults
                  customers={filteredCustomers}
                  onSelect={onSelectCustomer}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
