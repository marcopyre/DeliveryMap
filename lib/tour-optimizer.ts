import type {
  Customer,
  Driver,
  DeliveryTour,
  DeliveryStop,
} from "@/types/delivery";

// Fonction pour calculer la distance entre deux points (approximation)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Algorithme du plus proche voisin pour optimiser une tournée
function optimizeTourRoute(stops: DeliveryStop[]): DeliveryStop[] {
  if (stops.length <= 2) return stops;

  const optimized: DeliveryStop[] = [stops[0]]; // Commencer par le premier arrêt
  const remaining = stops.slice(1);

  while (remaining.length > 0) {
    const current = optimized[optimized.length - 1];
    let nearestIndex = 0;
    let nearestDistance = calculateDistance(
      current.latitude,
      current.longitude,
      remaining[0].latitude,
      remaining[0].longitude
    );

    for (let i = 1; i < remaining.length; i++) {
      const distance = calculateDistance(
        current.latitude,
        current.longitude,
        remaining[i].latitude,
        remaining[i].longitude
      );
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }

    optimized.push(remaining[nearestIndex]);
    remaining.splice(nearestIndex, 1);
  }

  return optimized.map((stop, index) => ({ ...stop, order: index + 1 }));
}

// Calculer la distance totale d'une tournée
function calculateTourDistance(stops: DeliveryStop[]): number {
  let totalDistance = 0;
  for (let i = 0; i < stops.length - 1; i++) {
    totalDistance += calculateDistance(
      stops[i].latitude,
      stops[i].longitude,
      stops[i + 1].latitude,
      stops[i + 1].longitude
    );
  }
  return totalDistance;
}

// Distribuer les clients entre les livreurs de manière équilibrée
function distributeCustomers(
  customers: Customer[],
  drivers: Driver[]
): Customer[][] {
  const distribution: Customer[][] = drivers.map(() => []);

  // Trier les clients par priorité
  const sortedCustomers = [...customers].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  // Distribuer les clients de manière équilibrée
  sortedCustomers.forEach((customer, index) => {
    const driverIndex = index % drivers.length;
    distribution[driverIndex].push(customer);
  });

  return distribution;
}

export async function optimizeTours(
  customers: Customer[],
  drivers: Driver[]
): Promise<DeliveryTour[]> {
  if (customers.length === 0 || drivers.length === 0) {
    return [];
  }

  // Simuler un délai d'optimisation
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Distribuer les clients entre les livreurs
  const customerDistribution = distributeCustomers(customers, drivers);

  const tours: DeliveryTour[] = [];

  for (let i = 0; i < drivers.length; i++) {
    const driver = drivers[i];
    const assignedCustomers = customerDistribution[i];

    if (assignedCustomers.length === 0) continue;

    // Convertir les clients en arrêts
    const stops: DeliveryStop[] = assignedCustomers.map((customer, index) => ({
      id: customer.id,
      name: customer.name,
      address: customer.address,
      latitude: customer.latitude,
      longitude: customer.longitude,
      order: index + 1,
    }));

    // Optimiser l'ordre des arrêts
    const optimizedStops = optimizeTourRoute(stops);

    // Calculer la distance totale
    const totalDistance = calculateTourDistance(optimizedStops);

    // Estimer la durée (approximation: 30 km/h + 10 min par arrêt)
    const estimatedDuration = Math.round(
      (totalDistance / 30) * 60 + optimizedStops.length * 10
    );

    tours.push({
      id: `tour-${driver.id}`,
      driver,
      stops: optimizedStops,
      totalDistance,
      estimatedDuration,
      status: "planned",
    });
  }

  return tours.filter((tour) => tour.stops.length > 0);
}
