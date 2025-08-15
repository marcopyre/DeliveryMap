export interface Customer {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  priority: "low" | "medium" | "high";
  timeWindow?: {
    start: string;
    end: string;
  };
}

export interface Driver {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
  maxCapacity?: number;
  workingHours?: {
    start: string;
    end: string;
  };
}

export interface DeliveryStop {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  estimatedArrival?: string;
  order: number;
}

export interface DeliveryTour {
  id: string;
  driver: Driver;
  stops: DeliveryStop[];
  totalDistance: number;
  estimatedDuration: number;
  status: "planned" | "in_progress" | "completed";
}
