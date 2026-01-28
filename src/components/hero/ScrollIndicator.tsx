import { FaChevronDown } from "react-icons/fa6";

export function ScrollIndicator() {
  return (
    <div className="animate-bounce">
      <div className="flex flex-col items-center gap-2 text-white/60">
        <span className="text-xs font-medium tracking-wider uppercase">
          Scroll
        </span>
        <FaChevronDown className="h-5 w-5" />
      </div>
    </div>
  );
}

