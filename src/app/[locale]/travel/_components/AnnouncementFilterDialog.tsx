"use client";

import { Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FaFilter } from "react-icons/fa6";
import { useState } from "react";
import { useAnnouncementCategories } from "@/hooks/useAnnouncement";
import { SearchAnnouncementsParams } from "@/lib/service/announcements";

export type TravelPageDialogFiltersType = {
  category?: string;
  subcategory?: string;
  prix_start?: string;
  prix_end?: string;
  date_start?: string;
  date_end?: string;
};

const schema = z.object({
  category: z.string().optional(),
  subcategory: z.string().optional(),
  prix_start: z.string().optional(),
  prix_end: z.string().optional(),
  date_start: z.string().optional(),
  date_end: z.string().optional(),
});

type Props = {
  value: Partial<SearchAnnouncementsParams>;
  onAction: (val: Partial<SearchAnnouncementsParams>) => void;
};

export function AnnouncementFilterDialog({ value, onAction }: Props) {
  const form = useForm<Partial<SearchAnnouncementsParams>>({
    resolver: zodResolver(schema) as Resolver<
      Partial<SearchAnnouncementsParams>
    >,
    defaultValues: value,
  });

  const { register, setValue, watch, handleSubmit } = form;

  const dateStart = watch("date_start");
  const dateEnd = watch("date_end");

  const [isOpen, setIsOpen] = useState(false);

  const submitForm = handleSubmit((data) => {
    onAction(data);
    setIsOpen(false);
  });
  const { data } = useAnnouncementCategories();
  const categories = data;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button
          className="rounded-full font-bold"
          size={"icon"}
          variant={"outline"}
        >
          <FaFilter className="text-avt-green" />
        </Button>
      </DialogTrigger>
      <DialogContent className="mx-auto max-w-md p-6 pb-0 lg:m-0 lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Advanced Travel Filters</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={submitForm}
          className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2"
        >
          {categories && (
            <>
              <Select
                onValueChange={(val) => {
                  setValue("category", val);
                  setValue("subcategory", ""); // reset subcategory
                }}
                defaultValue={watch("category") || undefined}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories!.map((cat) => (
                    <SelectItem
                      key={"category-" + cat.id}
                      value={cat.name}
                      className="capitalize"
                    >
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                onValueChange={(val) => setValue("subcategory", val)}
                defaultValue={watch("subcategory") || undefined}
                disabled={!watch("category")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                {categories.find((cat) => cat.name === watch("category"))
                  ?.sub_categories?.length !== 0 && (
                  <SelectContent>
                    {categories!
                      .find((cat) => cat.name === watch("category"))
                      ?.sub_categories.map((sub) => (
                        <SelectItem
                          key={"sub-category-" + sub.id}
                          value={sub.name}
                        >
                          {sub.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                )}
              </Select>
            </>
          )}

          <Input
            type="number"
            placeholder="Prix min"
            {...register("prix_start")}
          />
          <Input
            type="number"
            placeholder="Prix max"
            {...register("prix_end")}
          />

          {/* Date Start Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateStart ? format(new Date(dateStart), "PPP") : "Start Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateStart ? new Date(dateStart) : undefined}
                onSelect={(date) =>
                  setValue(
                    "date_start",
                    date?.toISOString().split("T")[0] || "",
                  )
                }
              />
            </PopoverContent>
          </Popover>

          {/* Date End Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateEnd ? format(new Date(dateEnd), "PPP") : "End Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateEnd ? new Date(dateEnd) : undefined}
                onSelect={(date) =>
                  setValue("date_end", date?.toISOString().split("T")[0] || "")
                }
              />
            </PopoverContent>
          </Popover>

          <DialogFooter className="col-span-full mt-4">
            <Button type="submit">Apply</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
