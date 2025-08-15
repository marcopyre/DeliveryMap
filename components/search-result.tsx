import { Badge } from "@/components/ui/badge";
import { Customer } from "@/types/delivery";

interface Props {
  customers: Customer[];
  onSelect: (customer: Customer) => void;
}

export function SearchResults({ customers, onSelect }: Props) {
  if (!customers.length) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm">
        Aucun client trouvé
      </div>
    );
  }

  return (
    <>
      {customers.map((customer, index) => (
        <button
          key={customer.id}
          onClick={() => onSelect(customer)}
          className="w-full text-left p-3 hover:bg-blue-50/50 border-b border-white/20 last:border-b-0"
          style={{ animationDelay: `${index * 50}ms` }}
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
      ))}
    </>
  );
}
