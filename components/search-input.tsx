import { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  autoFocus?: boolean;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  autoFocus = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      const timer = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  return (
    <div className="relative h-[44px]">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
      <Input
        ref={inputRef}
        type="text"
        placeholder="Rechercher un client..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 h-[44px] pr-10 bg-white/40 border-white/30 focus:border-blue-400 rounded-xl"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
