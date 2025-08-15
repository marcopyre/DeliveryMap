import type { Customer } from "@/types/delivery";

// Adresses réelles d'entreprises à Grenoble et agglomération
const grenobleAddresses = [
  {
    name: "Café de la Table Ronde",
    address: "7 Place Saint-André, 38000 Grenoble",
    lat: 45.1885,
    lng: 5.7245,
  },
  {
    name: "Boulangerie Paul",
    address: "5 Rue Félix Poulat, 38000 Grenoble",
    lat: 45.1875,
    lng: 5.7267,
  },
  {
    name: "Le Fantin Latour",
    address: "1 Rue Fantin Latour, 38000 Grenoble",
    lat: 45.1901,
    lng: 5.7301,
  },
  {
    name: "Librairie Arthaud",
    address: "23 Grande Rue, 38000 Grenoble",
    lat: 45.1889,
    lng: 5.7278,
  },
  {
    name: "Pharmacie Centrale Grenette",
    address: "3 Place Grenette, 38000 Grenoble",
    lat: 45.1882,
    lng: 5.7251,
  },
  {
    name: "La Belle Électrique",
    address: "12 Esplanade Andry Farcy, 38000 Grenoble",
    lat: 45.1897,
    lng: 5.7289,
  },
  {
    name: "BOM Coffee Shop",
    address: "15 Rue Chenoise, 38000 Grenoble",
    lat: 45.1934,
    lng: 5.7298,
  },
  {
    name: "Jardin du Thé",
    address: "8 Place aux Herbes, 38000 Grenoble",
    lat: 45.1856,
    lng: 5.7203,
  },
  {
    name: "Monoprix Grenoble",
    address: "14 Rue de la République, 38000 Grenoble",
    lat: 45.1863,
    lng: 5.7289,
  },
  {
    name: "Restaurant Chavant",
    address: "2 Place du Docteur Girard, 38000 Grenoble",
    lat: 45.1912,
    lng: 5.7334,
  },
  {
    name: "Fnac Grenoble",
    address: "25 Avenue Félix Viallet, 38000 Grenoble",
    lat: 45.1847,
    lng: 5.7178,
  },
  {
    name: "Galeries Lafayette Grenoble",
    address: "4 Rue de Bonne, 38000 Grenoble",
    lat: 45.1876,
    lng: 5.7245,
  },
  {
    name: "Optic 2000",
    address: "12 Rue Thiers, 38000 Grenoble",
    lat: 45.1869,
    lng: 5.7312,
  },
  {
    name: "Le Mange Disque",
    address: "2 Rue Genissieu, 38000 Grenoble",
    lat: 45.1823,
    lng: 5.7156,
  },
  {
    name: "Pressing du Centre",
    address: "18 Avenue Alsace Lorraine, 38000 Grenoble",
    lat: 45.1834,
    lng: 5.7234,
  },
  {
    name: "Decathlon Grenoble",
    address: "45 Cours de la Libération, 38100 Grenoble",
    lat: 45.1789,
    lng: 5.7098,
  },
  {
    name: "Salon de Thé Le Procope",
    address: "3 Rue de la Paix, 38000 Grenoble",
    lat: 45.1891,
    lng: 5.7267,
  },
  {
    name: "Fromagerie Laurent Dubois",
    address: "16 Rue Lionne, 38000 Grenoble",
    lat: 45.1903,
    lng: 5.7289,
  },
  {
    name: "Bijouterie Murat",
    address: "11 Place Grenette, 38000 Grenoble",
    lat: 45.1884,
    lng: 5.7253,
  },
  {
    name: "Carrefour Échirolles",
    address: "Avenue de Grugliasco, 38130 Échirolles",
    lat: 45.1456,
    lng: 5.7089,
  },
  {
    name: "Centre Commercial Grand Sud",
    address: "Avenue Centrale, 38400 Saint-Martin-d'Hères",
    lat: 45.1678,
    lng: 5.7645,
  },
  {
    name: "Auchan Fontaine",
    address: "Avenue de l'Europe, 38600 Fontaine",
    lat: 45.1934,
    lng: 5.6889,
  },
  {
    name: "Super U Seyssinet",
    address: "Place de la Libération, 38180 Seyssinet-Pariset",
    lat: 45.1689,
    lng: 5.6934,
  },
  {
    name: "Intermarché Meylan",
    address: "Chemin du Vieux Chêne, 38240 Meylan",
    lat: 45.2089,
    lng: 5.7734,
  },
  {
    name: "Grand Place Shopping Center",
    address: "Avenue Gabriel Péri, 38130 Échirolles",
    lat: 45.1423,
    lng: 5.7012,
  },
];

const priorities: Array<"low" | "medium" | "high"> = ["low", "medium", "high"];

export function generateMockCustomers(count = 20): Customer[] {
  const customers: Customer[] = [];

  for (let i = 0; i < Math.min(count, grenobleAddresses.length); i++) {
    const address = grenobleAddresses[i];
    customers.push({
      id: `customer-${i + 1}`,
      name: address.name,
      address: address.address,
      latitude: address.lat,
      longitude: address.lng,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
    });
  }

  return customers;
}
