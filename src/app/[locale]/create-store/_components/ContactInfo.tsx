// components/forms/store/ContactInfo.tsx
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import { StoreFormValues } from "../page";

export function ContactInfo({
  control,
}: {
  control: Control<StoreFormValues>;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {[
        { name: "nom", label: "Nom" },
        { name: "prenom", label: "Prénom" },
        { name: "pseudo", label: "Pseudo" },
        { name: "denomination", label: "Dénomination" },
        { name: "tlfn", label: "Téléphone" },
        { name: "email", label: "Email", type: "email" },
      ].map(({ name, label, type = "text" }) => (
        <FormField
          key={name}
          name={name as keyof StoreFormValues}
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input type={type} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </div>
  );
}
