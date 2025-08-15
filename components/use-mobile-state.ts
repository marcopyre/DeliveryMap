import { MobileState } from "@/types/sidebar";
import { useState } from "react";

export function useMobileState() {
  const [mobileState, setMobileState] = useState<MobileState>("collapsed");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStateTransition = (newState: MobileState) => {
    if (isTransitioning || newState === mobileState) return;

    setIsTransitioning(true);
    setTimeout(() => setMobileState(newState), 10);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  return {
    mobileState,
    isTransitioning,
    handleStateTransition,
  };
}
