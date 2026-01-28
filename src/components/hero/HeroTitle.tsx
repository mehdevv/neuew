import { ReactNode } from "react";

interface HeroTitleProps {
  title: string;
  badge?: ReactNode;
  rightContent?: ReactNode;
  className?: string;
}

export function HeroTitle({
  title,
  badge,
  rightContent,
  className = "",
}: HeroTitleProps) {
  if (rightContent) {
    return (
      <div
        className={`flex w-full flex-col items-center gap-6 md:flex-row md:items-center md:justify-between md:gap-8 ${className}`}
      >
        <div className="text-center md:text-left">
          <h1 className="mb-4 text-4xl leading-tight font-extrabold text-white drop-shadow-2xl transition-all duration-700 md:text-5xl lg:text-6xl">
            <span className="to-avt-green/80 bg-gradient-to-r from-white via-white bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          {badge && badge}
        </div>
        {rightContent}
      </div>
    );
  }

  return (
    <div className={`text-center ${className}`}>
      {badge && <div className="mb-4">{badge}</div>}
      <h1 className="mb-4 text-4xl leading-tight font-extrabold text-white drop-shadow-2xl transition-all duration-700 md:text-5xl lg:text-7xl">
        <span className="to-avt-green/80 bg-gradient-to-r from-white via-white bg-clip-text text-transparent">
          {title}
        </span>
      </h1>
    </div>
  );
}

