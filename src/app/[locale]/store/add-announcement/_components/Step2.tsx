import { UseFormReturn, useFieldArray } from "react-hook-form";
import { AnnouncementForm } from "../page";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import ReactFlagsSelect from "react-flags-select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WILAYA_BY_ID } from "@/lib/constants/wilayas-by-id";
import { Hebergement } from "@/types/announcements";

import { RichTextEditor } from "./RichTextEditor";
import { Textarea } from "@/components/ui/textarea";
import { MultiTextInput } from "./MultiTextInput";
import { DateRangeArrayInput } from "./DateRangeArrayInput";

type Props = {
  form: UseFormReturn<AnnouncementForm>;
  hebergements: Hebergement[];
  previousStep: () => void;
  nextStep: () => void;
};

export function AnnouncementFormStep2({
  form,
  hebergements,
  previousStep,
  nextStep,
}: Props) {
  return (
    <div className="mx-auto my-6 flex max-w-xl flex-col gap-4 rounded-lg border-2 border-zinc-200 bg-zinc-50 p-6">
      <h3 className="mb-3 text-start text-lg font-semibold md:text-xl">
        2. Announcement Details
      </h3>
      {/* Titre */}
      <FormField
        control={form.control}
        name="titre"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Titre
              <span className="text-sm text-red-600">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="Titre" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <MultiTextInput form={form} name="destination" label="Destination" />
      <DateRangeArrayInput
        form={form}
        departureField="date_dep"
        arrivalField="date_arv"
        label="Périodes de voyage"
      />

      {/* Dates */}
      {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="date_dep"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Date départ
                <span className="text-sm text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={
                    field.value
                      ? new Date(field.value).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val ? new Date(val) : null);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date_arv"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Date arrivée
                <span className="text-sm text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  min={
                    form.getValues("date_dep")
                      ? new Date(form.getValues("date_dep"))
                          .toISOString()
                          .split("T")[0]
                      : new Date().toISOString().split("T")[0]
                  }
                  type="date"
                  value={
                    field.value
                      ? new Date(field.value).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val ? new Date(val) : null);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div> */}

      {/* Wilaya & Lieu */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="wilaya_dep"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Wilaya départ
                <span className="text-sm text-red-600">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez wilaya" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {WILAYA_BY_ID.map((wilaya) => (
                    <SelectItem
                      key={`wilaya-select-${wilaya.id}`}
                      value={wilaya.id}
                    >
                      {wilaya.code} - {wilaya.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lieu_dep"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Lieu départ
                <span className="text-sm text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Lieu de départ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Pays depart */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="pays_dep"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Pays de départ
                <span className="text-sm text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <ReactFlagsSelect
                  selected={field.value ?? ""}
                  onSelect={(code: string) => field.onChange(code)}
                  searchable={true}
                  placeholder="Select"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Pays arrivée */}

        <FormField
          control={form.control}
          name="pays_arv"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Pays d&apos;arrivée
                <span className="text-sm text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <ReactFlagsSelect
                  selected={field.value ?? ""}
                  onSelect={(code: string) => field.onChange(code)}
                  searchable={true}
                  placeholder="Select"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Prix */}
      <FormField
        control={form.control}
        name="prix"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Prix (DZD)
              <span className="text-red-601 text-sm">*</span>
            </FormLabel>

            <FormControl>
              <Input
                placeholder="30 000"
                value={
                  field.value
                    ? field.value
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                    : ""
                }
                onChange={(e) => {
                  const raw = e.target.value.replace(/\s+/g, "");
                  const num = raw === "" ? "" : Number(raw);
                  field.onChange(num);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Hébergement */}
      {hebergements.length > 0 && (
        <FormField
          control={form.control}
          name="hebergement_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Hébergement
                <span className="text-sm text-red-600">*</span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value ? field.value.toString() : ""}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez hébergement" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {hebergements.map((h) => (
                    <SelectItem
                      key={`hebergement-select-${h.id}`}
                      value={h.id.toString()}
                    >
                      {h.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Description
              <span className="text-sm text-red-600">*</span>
            </FormLabel>
            <RichTextEditor
              value={field.value ?? ""}
              onChange={field.onChange}
            />
            <Textarea
              className="hidden"
              {...field}
              value={form.watch("description")}
            />
          </FormItem>
        )}
      />

      <div className="flex w-full flex-row justify-between gap-4">
        <Button className="avt-outline-button" onClick={previousStep}>
          <FaArrowLeft />
          Previous
        </Button>

        <Button className="avt-primary-button" onClick={nextStep}>
          Next <FaArrowRight />
        </Button>
      </div>
    </div>
  );
}
