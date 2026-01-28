"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Location } from "@/lib/service/locations";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { WILAYA_BY_ID } from "@/lib/constants/wilayas-by-id";
import { LocationCard } from "../../search/[category]/_components/LocationCard";
import { Localized, withResolvedLocale } from "@/lib/utils/localize-fields";
import { useLocale } from "next-intl";

type Props = {
  locations: Location[];
};

export function MapSheet({ locations }: Props) {
  const locale = useLocale() as "en" | "fr" | "ar";

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button >Discover</Button>
      </DrawerTrigger>
      <DrawerContent className="z-[1000]">
        <div className="mx-auto w-full">
          <DrawerHeader>
            <Select>
              <SelectTrigger className="w-full">Filter by wilaya</SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>All Wilayas</SelectLabel>
                  {WILAYA_BY_ID.map(({ name, id }) => (
                    <SelectItem key={id} value={id}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </DrawerHeader>

          {/* locations list */}
          <div className="relative max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 gap-2 p-4 md:grid-cols-3 lg:grid-cols-4">
              {locations.map((location) => {
                const localizedLocation = withResolvedLocale(
                  location,
                  locale,
                ) as Localized<Location>;
                return (
                  <LocationCard
                    key={location.id}
                    location={localizedLocation}
                  />
                );
              })}
            </div>
            <div className="pointer-events-none fixed right-0 bottom-0 left-0 h-24 bg-gradient-to-t from-black to-transparent" />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
