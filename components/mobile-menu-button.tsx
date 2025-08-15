import { Menu } from "lucide-react";

interface Props {
  onClick: () => void;
  disabled: boolean;
  className: string;
}

export function MobileMenuButton({ onClick, disabled, className }: Props) {
  return (
    <div
      className={`absolute inset-0 w-[62px] h-[62px] flex items-center justify-center ${className}`}
    >
      <button
        onClick={onClick}
        disabled={disabled}
        className="w-full h-full flex items-center justify-center"
        title="Ouvrir le menu"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>
    </div>
  );
}
