"use client";

import { useState } from "react";
import type { Customer } from "@/types/delivery";
import { SidebarContent } from "./sidebar-content";
import { useMobileState } from "./use-mobile-state";
import { useSearch } from "@/hooks/use-search";
import { getContainerClasses, getStateClasses } from "@/utils/animation";
import { CompactMenu } from "./compact-menu";
import { ExpandedMenu } from "./expanded-menu";
import { MobileMenuButton } from "./mobile-menu-button";

interface SidebarProps {
  customers: Customer[];
  onFocusCustomer: (customerId: string) => void;
}

export function Sidebar({ customers, onFocusCustomer }: SidebarProps) {
  const { mobileState, isTransitioning, handleStateTransition } =
    useMobileState();
  const {
    searchQuery,
    filteredCustomers,
    showSearchResults,
    handleSearchChange,
    clearSearch,
  } = useSearch(customers);

  const [expandTrigger, setExpandTrigger] = useState<string | null>(null);

  const handleSelectCustomer = (customer: Customer) => {
    onFocusCustomer(customer.id);
    clearSearch();
    handleStateTransition("collapsed");
  };

  const handleMobileMenuClick = () => {
    if (mobileState === "collapsed") {
      handleStateTransition("compact");
    } else if (mobileState === "compact") {
      handleStateTransition("expanded");
    }
  };

  const handleExpandSearch = () => {
    setExpandTrigger("search");
    handleStateTransition("expanded");
  };

  const handleCollapse = () => {
    setExpandTrigger(null);
    clearSearch();
    handleStateTransition("collapsed");
  };

  const handleBackToCompact = () => {
    setExpandTrigger(null);
    handleStateTransition("compact");
  };

  return (
    <>
      <div className="md:hidden">
        <div className={getContainerClasses(mobileState)}>
          {mobileState === "collapsed" && (
            <MobileMenuButton
              onClick={handleMobileMenuClick}
              disabled={isTransitioning}
              className={getStateClasses("collapsed", true)}
            />
          )}

          {mobileState === "compact" && (
            <CompactMenu
              onExpandSearch={handleExpandSearch}
              onCollapse={handleCollapse}
              disabled={isTransitioning}
              className={getStateClasses("compact", true)}
            />
          )}

          {mobileState === "expanded" && (
            <ExpandedMenu
              searchQuery={searchQuery}
              filteredCustomers={filteredCustomers}
              showSearchResults={showSearchResults}
              onSearchChange={handleSearchChange}
              onClearSearch={clearSearch}
              onSelectCustomer={handleSelectCustomer}
              onBackToCompact={handleBackToCompact}
              onCollapse={handleCollapse}
              disabled={isTransitioning}
              className={getStateClasses("expanded", true)}
              expandTrigger={expandTrigger}
            />
          )}
        </div>
      </div>

      <div className="hidden md:block">
        <SidebarContent
          customers={customers}
          onFocusCustomer={onFocusCustomer}
        />
      </div>
    </>
  );
}
