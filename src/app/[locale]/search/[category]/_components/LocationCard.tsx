"use client";

import { Card, CardContent } from "@/components/ui/card";
import { SEARCH_CATEGORIES } from "@/lib/constants/search-categories";
import { Location } from "@/lib/service/locations";
import { getS3UrlOrDefault, isValidUrl } from "@/lib/utils";
import { Localized } from "@/lib/utils/localize-fields";
import Image from "next/image";
import Link from "next/link";

type Props = {
  location: Localized<Location>;
  categoryId?: number;
};

export function LocationCard({ location, categoryId }: Props) {
  const icon = SEARCH_CATEGORIES.find((c) => c.id === categoryId)?.icon;

  return (
    <Link
      href={{
        pathname: `/location/${location.id}`,
        query: { refetch: false },
      }}
    >
      <Card className="hover:border-avt-green gap-y-3 overflow-clip border-2 border-zinc-300 py-0 transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-2xl">
        <Image
          src={getS3UrlOrDefault(location.pic_cover)}
          alt={location.t_name}
          className="w-full object-fill"
          width={400}
          height={400}
        />
        <CardContent className="px-4 py-2">
          <div className="flex items-center gap-x-1">
            {icon && (
              <Image src={icon} alt={location.t_name} width={16} height={16} />
            )}
            <h3 className="group-hover:text-primary line-clamp-1 text-base font-semibold text-gray-900">
              {location.t_name}
            </h3>
          </div>
          <p
            className="text-muted-foreground line-clamp-2 text-sm"
            dangerouslySetInnerHTML={{
              __html: location.t_description.replaceAll(/\\r\\n/g, "<br><br>"),
            }}
          />
        </CardContent>
      </Card>
    </Link>
  );
}

export function LocationCardSkeleton() {
  return (
    <Card className="hover:border-avt-green gap-y-3 overflow-clip border-2 border-zinc-300 py-0 transition-all duration-200 ease-in-out">
      <div className="h-[200px] w-full animate-pulse bg-zinc-300" />
      <CardContent className="space-y-2 px-4 py-2">
        <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-300" />
        <div className="h-3 w-full animate-pulse rounded bg-zinc-200" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-zinc-200" />
      </CardContent>
    </Card>
  );
}
