import { ReactNode } from "react";

interface HeroBadgeProps {
  children: ReactNode;
  icon?: ReactNode;
}

export function HeroBadge({ children, icon }: HeroBadgeProps) {
  return (
    <div className="bg-avt-green/20 inline-flex items-center gap-2 rounded-full px-4 py-2 backdrop-blur-md">
      {icon && icon}
      <span className="text-avt-green text-sm font-semibold tracking-wider uppercase">
        {children}
      </span>
    </div>
  );
}
