import { MobileState } from "@/types/sidebar";

export function getContainerClasses(state: MobileState): string {
  const baseClasses =
    "fixed top-6 left-6 bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl z-[1000] transition-all duration-500 ease-out overflow-hidden";

  switch (state) {
    case "collapsed":
      return `${baseClasses} w-[62px] h-[62px] rounded-xl`;
    case "compact":
      return `${baseClasses} w-16 bottom-6 rounded-2xl`;
    case "expanded":
      return `${baseClasses} w-80 bottom-6 rounded-2xl`;
    default:
      return baseClasses;
  }
}

export function getStateClasses(
  state: MobileState,
  isCurrentState: boolean
): string {
  if (isCurrentState) {
    switch (state) {
      case "collapsed":
        return "opacity-100 translate-x-0 translate-y-0 animate-in fade-in duration-400";
      case "compact":
        return "opacity-100 translate-x-0 translate-y-0 animate-in fade-in slide-in-from-top-2 duration-400";
      case "expanded":
        return "opacity-100 translate-x-0 translate-y-0 animate-in fade-in slide-in-from-right-2 duration-400";
    }
  }

  return "opacity-0 translate-x-4 translate-y-4 pointer-events-none";
}
