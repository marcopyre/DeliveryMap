"use client";

import { useState, useEffect, useRef } from "react";
import { DeliveryMap, type DeliveryMapRef } from "@/components/delivery-map";
import { Sidebar } from "@/components/sidebar";
import type { Customer } from "@/types/delivery";
import { generateMockCustomers } from "@/lib/mock-data";

export default function DeliveryTourManager() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const mapRef = useRef<DeliveryMapRef>(null);

  useEffect(() => {
    const mockCustomers = generateMockCustomers(25);
    setCustomers(mockCustomers);
  }, []);

  const handleFocusCustomer = (customerId: string) => {
    if (mapRef.current) {
      mapRef.current.focusOnCustomer(customerId);
    }
  };

  return (
    <div className="h-screen w-full relative overflow-hidden bg-gray-50">
      <DeliveryMap
        ref={mapRef}
        customers={customers}
        maptilerApiKey="LivHgeOLZZwzf8h5smmh"
      />
      <Sidebar customers={customers} onFocusCustomer={handleFocusCustomer} />
    </div>
  );
}
