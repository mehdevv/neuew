import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { FaPlus, FaXmark } from "react-icons/fa6";
import { useState } from "react";

type DateRangeArrayInputProps<TForm extends FieldValues = FieldValues> = {
  form: UseFormReturn<TForm>;
  departureField: keyof TForm; // date_dep
  arrivalField: keyof TForm; // date_arv
  label: string;
};

export function DateRangeArrayInput<TForm extends FieldValues = FieldValues>({
  form,
  departureField,
  arrivalField,
  label,
}: DateRangeArrayInputProps<TForm>) {
  const rawDep = form.watch(departureField as any);
  const rawArv = form.watch(arrivalField as any);

  // Normalize arrays and filter out empty strings
  const depValues: string[] = Array.isArray(rawDep)
    ? rawDep
        .flat()
        .filter((v: unknown) => typeof v === "string" && v.trim() !== "")
    : [];

  const arvValues: string[] = Array.isArray(rawArv)
    ? rawArv
        .flat()
        .filter((v: unknown) => typeof v === "string" && v.trim() !== "")
    : [];

  // Track temporary empty date pairs that haven't been saved yet
  const [tempEmptyCount, setTempEmptyCount] = useState(0);

  const setBoth = (dep: string[], arv: string[]) => {
    // Filter out empty strings before saving
    const filteredDep = dep.filter((v) => v.trim() !== "");
    const filteredArv = arv.filter((v) => v.trim() !== "");
    form.setValue(departureField as any, filteredDep as any, {
      shouldDirty: true,
    });
    form.setValue(arrivalField as any, filteredArv as any, {
      shouldDirty: true,
    });
    // Reset temp empty count when values are saved
    if (filteredDep.length > 0 || filteredArv.length > 0) {
      setTempEmptyCount(0);
    }
  };

  const addRow = () => {
    // Add a temporary empty date pair
    setTempEmptyCount((prev) => prev + 1);
  };

  const removeRow = (index: number) => {
    const newDep = depValues.filter((_, i) => i !== index);
    const newArv = arvValues.filter((_, i) => i !== index);
    setBoth(newDep, newArv);
  };

  const updateDep = (index: number, value: string, isTemp: boolean = false) => {
    if (isTemp) {
      // For temp inputs, just track that user is typing
      // When they type something, we'll save it
      if (value.trim() !== "") {
        const nextDep = [...depValues, value];
        const nextArv = [...arvValues, ""];
        setBoth(nextDep, nextArv);
        setTempEmptyCount((prev) => Math.max(0, prev - 1));
      }
      return;
    }

    // For saved values
    if (value.trim() === "") {
      // If departure becomes empty, check if arrival is also empty
      const arvValue = arvValues[index] || "";
      if (!arvValue || arvValue.trim() === "") {
        // Both empty, remove the pair
        removeRow(index);
      }
      // If arrival has value, keep departure empty but don't save it
    } else {
      const nextDep = [...depValues];
      nextDep[index] = value;
      setBoth(nextDep, arvValues);
    }
  };

  const updateArv = (index: number, value: string, isTemp: boolean = false) => {
    if (isTemp) {
      // For temp inputs
      if (value.trim() !== "") {
        const nextDep = [...depValues];
        const nextArv = [...arvValues, value];
        // Ensure arrays are same length
        while (nextDep.length < nextArv.length) {
          nextDep.push("");
        }
        setBoth(nextDep, nextArv);
        setTempEmptyCount((prev) => Math.max(0, prev - 1));
      }
      return;
    }

    // For saved values
    if (value.trim() === "") {
      // If arrival becomes empty, check if departure is also empty
      const depValue = depValues[index] || "";
      if (!depValue || depValue.trim() === "") {
        // Both empty, remove the pair
        removeRow(index);
      }
      // If departure has value, keep arrival empty but don't save it
    } else {
      const nextArv = [...arvValues];
      nextArv[index] = value;
      setBoth(depValues, nextArv);
    }
  };

  // Build display: saved pairs + temporary empty pairs
  const displayLength =
    Math.max(depValues.length, arvValues.length, 1) + tempEmptyCount;

  return (
    <FormItem>
      <FormLabel>
        {label}
        <span className="text-sm text-red-600">*</span>
      </FormLabel>

      <div className="flex flex-col gap-3">
        {/* List of existing date ranges */}
        {Array.from({ length: displayLength }).map((_, index) => {
          const isTemp = index >= Math.max(depValues.length, arvValues.length);
          const depValue = depValues[index] || "";
          const arvValue = arvValues[index] || "";
          const minArrivalDate =
            depValue || new Date().toISOString().split("T")[0];

          return (
            <div
              key={index}
              className="group relative rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-600 shadow-sm">
                {index + 1}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label className="mb-2 block text-sm font-medium">
                    Date de départ
                  </label>
                  <FormControl>
                    <Input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={depValue}
                      onChange={(e) => updateDep(index, e.target.value, isTemp)}
                      className="w-full"
                    />
                  </FormControl>
                </div>

                <div className="flex-1">
                  <label className="mb-2 block text-sm font-medium">
                    Date d&apos;arrivée
                  </label>
                  <FormControl>
                    <Input
                      type="date"
                      min={minArrivalDate}
                      value={arvValue}
                      onChange={(e) => updateArv(index, e.target.value, isTemp)}
                      className="w-full"
                    />
                  </FormControl>
                </div>

                {!isTemp &&
                  displayLength > 1 &&
                  (depValues.length > 0 || arvValues.length > 0) && (
                    <Button
                      type="button"
                      onClick={() => removeRow(index)}
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 sm:absolute sm:top-2 sm:right-2"
                      aria-label={`Supprimer la période ${index + 1}`}
                    >
                      <FaXmark className="h-4 w-4" />
                    </Button>
                  )}
              </div>
            </div>
          );
        })}

        {/* Add new period button */}
        <Button
          type="button"
          onClick={addRow}
          variant="outline"
          className="w-full border-dashed"
          aria-label="Ajouter une autre période"
        >
          <FaPlus className="h-4 w-4" />
          <span>Ajouter une période</span>
        </Button>
      </div>

      <FormMessage />
    </FormItem>
  );
}
