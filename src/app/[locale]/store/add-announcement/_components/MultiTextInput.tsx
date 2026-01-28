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

type MultiTextInputProps<TForm extends FieldValues> = {
  form: UseFormReturn<TForm>;
  name: keyof TForm;
  label: string;
};

export function MultiTextInput<TForm extends FieldValues>({
  form,
  name,
  label,
}: MultiTextInputProps<TForm>) {
  const raw = form.watch(name as any);

  const values: string[] = Array.isArray(raw)
    ? raw
        .flat()
        .filter((v: unknown) => typeof v === "string" && v.trim() !== "")
    : [];

  // Track temporary empty inputs that haven't been saved yet
  const [tempEmptyCount, setTempEmptyCount] = useState(0);

  const setValues = (next: string[]) => {
    // Filter out empty strings before saving
    const filtered = next.filter((v) => v.trim() !== "");
    form.setValue(name as any, filtered as any, { shouldDirty: true });
    // Reset temp empty count when values are saved
    if (filtered.length > 0) {
      setTempEmptyCount(0);
    }
  };

  const addRow = () => {
    // Add a temporary empty input
    setTempEmptyCount((prev) => prev + 1);
  };

  const removeRow = (index: number) => {
    const next = values.filter((_, i) => i !== index);
    setValues(next);
  };

  const updateRow = (index: number, value: string, isTemp: boolean = false) => {
    const trimmed = value.trim();
    if (trimmed === "") {
      // If value becomes empty and it's a temp input, just remove it from display
      if (isTemp) {
        setTempEmptyCount((prev) => Math.max(0, prev - 1));
      } else {
        // If it was a saved value that became empty, remove it
        removeRow(index);
      }
    } else {
      // Update the value and save it
      const next = [...values];
      next[index] = value;
      setValues(next);
      // If this was a temp input, reduce temp count
      if (isTemp) {
        setTempEmptyCount((prev) => Math.max(0, prev - 1));
      }
    }
  };

  // Build display values: saved values + temporary empty inputs
  const displayValues = [...values, ...Array(tempEmptyCount).fill("")];

  // Always show at least one input field for UX
  const finalDisplayValues = displayValues.length > 0 ? displayValues : [""];

  return (
    <FormItem>
      <FormLabel>
        {label}
        <span className="text-sm text-red-600">*</span>
      </FormLabel>

      <div className="flex flex-col gap-3">
        {/* List of existing items */}
        {finalDisplayValues.map((value, index) => {
          const isTemp = index >= values.length;
          return (
            <div
              key={index}
              className="group flex items-center gap-2 rounded-lg border bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-600">
                {index + 1}
              </div>
              <FormControl className="flex-1">
                <Input
                  placeholder={`${label} ${index + 1}`}
                  value={value}
                  onChange={(e) => updateRow(index, e.target.value, isTemp)}
                  className="border-0 bg-transparent shadow-none focus-visible:ring-1"
                />
              </FormControl>
              {!isTemp && finalDisplayValues.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeRow(index)}
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10 h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label={`Supprimer ${label} ${index + 1}`}
                >
                  <FaXmark className="h-4 w-4" />
                </Button>
              )}
            </div>
          );
        })}

        {/* Add new item button */}
        <Button
          type="button"
          onClick={addRow}
          variant="outline"
          className="w-full border-dashed"
          aria-label={`Ajouter une autre ${label}`}
        >
          <FaPlus className="h-4 w-4" />
          <span>Ajouter une {label.toLowerCase()}</span>
        </Button>
      </div>

      <FormMessage />
    </FormItem>
  );
}
