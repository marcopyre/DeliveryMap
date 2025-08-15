"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import type { Customer } from "@/types/delivery";

interface SidebarContentProps {
  customers: Customer[];
  onFocusCustomer: (customerId: string) => void;
}

export function SidebarContent({
  customers,
  onFocusCustomer,
}: SidebarContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandTrigger, setExpandTrigger] = useState<string | null>(null);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredCustomers([]);
      setShowSearchResults(false);
    } else {
      const filtered = customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(query.toLowerCase()) ||
          customer.address.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCustomers(filtered);
      setShowSearchResults(true);
    }
  };

  const handleSelectCustomer = (customer: Customer) => {
    onFocusCustomer(customer.id);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleExpand = (trigger?: string) => {
    setIsExpanded(true);
    setExpandTrigger(trigger || null);

    if (trigger === "search") {
      setTimeout(() => {
        const searchInput = document.querySelector(
          'input[placeholder="Rechercher un client..."]'
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 400);
    }
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    setExpandTrigger(null);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  return (
    <div
      className={`absolute top-6 left-6 bottom-6 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl flex flex-col z-[1000] transition-all duration-300 ease-in-out ${
        isExpanded ? "w-80" : "w-16"
      }`}
    >
      {!isExpanded && (
        <div className="flex flex-col items-center py-6 gap-4">
          <button
            onClick={() => handleExpand("search")}
            className="group p-3 bg-white/40 rounded-xl backdrop-blur-sm hover:bg-white/60 transition-colors"
            title="Rechercher un client"
          >
            <Search className="w-5 h-5 text-gray-600 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      )}

      {isExpanded && (
        <>
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
            <button
              onClick={handleCollapse}
              className="p-2 hover:bg-white/30 rounded-lg transition-colors"
              title="Fermer"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <div className="p-4">
            <div className="relative h-[44px]">
              <div className="relative h-[44px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Rechercher un client..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className={`pl-10 h-[44px] pr-10 bg-white/40 backdrop-blur-sm border-white/30 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl ${
                    expandTrigger === "search"
                      ? "ring-2 ring-blue-400/20 border-blue-400"
                      : ""
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => handleSearchChange("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-xl border border-white/30 rounded-xl shadow-xl max-h-48 overflow-y-auto z-50">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <button
                        key={customer.id}
                        onClick={() => handleSelectCustomer(customer)}
                        className="w-full text-left p-3 hover:bg-blue-50/50 border-b border-white/20 last:border-b-0 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full border-2 border-white shadow-sm bg-green-500" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-900 truncate">
                              {customer.name}
                            </p>
                            <p className="text-xs text-gray-600 truncate">
                              {customer.address}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className="text-xs bg-green-50 text-green-700 border-green-200"
                          >
                            Disponible
                          </Badge>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      Aucun client trouvé
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
