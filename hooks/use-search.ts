import { Customer } from "@/types/delivery";
import { useState } from "react";

export function useSearch(customers: Customer[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredCustomers([]);
      setShowSearchResults(false);
      return;
    }

    const filtered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query.toLowerCase()) ||
        customer.address.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredCustomers(filtered);
    setShowSearchResults(true);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchResults(false);
  };

  return {
    searchQuery,
    filteredCustomers,
    showSearchResults,
    handleSearchChange,
    clearSearch,
  };
}
