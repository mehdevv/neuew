"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  name: string;
  icon: string;
  bgImage: string;
  searchUrl: string;
  isDesktop?: boolean;
  index: number;
  id?: string | number;
  label: string;
}

export function CategoryCard({
  name,
  icon,
  bgImage,
  searchUrl,
  isDesktop = false,
  index,
  id,
  label,
}: CategoryCardProps) {
  return (
    <Link
      href={searchUrl}
      className={cn(
        "group relative cursor-pointer transition-all duration-200 ease-in-out hover:scale-105",
      )}
      key={`${name}-${index}-${id}`}
    >
      <Image
        className="aspect-square h-full w-full rounded-lg object-cover shadow"
        src={bgImage}
        alt={`${name} background image`}
        height={isDesktop ? 398 : 200}
        width={isDesktop ? 398 : 200}
      />
      <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-zinc-900 to-transparent" />
      <div className="absolute bottom-2 left-2 flex flex-row items-center gap-x-1 text-white">
        <Image
          className="aspect-square size-5 rounded-full bg-white p-1"
          src={icon}
          alt={`${name} icon`}
          height={isDesktop ? 18 : 10}
          width={isDesktop ? 18 : 10}
        />
        <p className="text-sm ">{label}</p>
      </div>
    </Link>
  );
}
