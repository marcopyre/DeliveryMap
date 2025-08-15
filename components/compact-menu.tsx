import { Search, X } from "lucide-react";

interface Props {
  onExpandSearch: () => void;
  onCollapse: () => void;
  disabled: boolean;
  className: string;
}

export function CompactMenu({
  onExpandSearch,
  onCollapse,
  disabled,
  className,
}: Props) {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center py-6 gap-4 h-full ${className}`}
    >
      <button
        onClick={onExpandSearch}
        disabled={disabled}
        className="p-3 bg-white/40 rounded-xl hover:bg-white/60"
        title="Rechercher un client"
      >
        <Search className="w-5 h-5 text-gray-600" />
      </button>

      <div className="flex-1" />

      <button
        onClick={onCollapse}
        disabled={disabled}
        className="p-3 bg-white/40 rounded-xl hover:bg-white/60"
        title="Fermer le menu"
      >
        <X className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
}
