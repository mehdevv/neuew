// components/forms/store/BusinessInfo.tsx
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Control } from "react-hook-form";

import { StoreFormValues } from "../page";
import { ABONNEMENTS } from "@/lib/constants/store/store_abonnements";
import { DOMAINES } from "@/lib/constants/store/store_domaines";
import { DUREES } from "@/lib/constants/store/store_durees";
import { PAIEMENTS } from "@/lib/constants/store/store_paiements";
import { WILAYA_BY_ID } from "@/lib/constants/wilayas-by-id";

export function BusinessInfo({
  control,
}: {
  control: Control<StoreFormValues>;
}) {
  return (
    <div className="space-y-4">
      {/* RC Number */}
      <FormField
        name="reg_com"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numéro RC</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Wilaya & Commune */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          name="wilaya"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wilaya</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une wilaya" />
                  </SelectTrigger>
                  <SelectContent>
                    {WILAYA_BY_ID.map((w) => (
                      <SelectItem key={w.name} value={w.name}>
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="commune"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Commune</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Adresse */}
      <FormField
        name="adresse"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adresse</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Abonnement, Domaine */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          name="abonnement"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Abonnement</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choisir un abonnement" />
                  </SelectTrigger>
                  <SelectContent>
                    {ABONNEMENTS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="domaine"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domaine</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choisir un domaine" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOMAINES.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Durée & Paiement */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          name="duree_abn"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Durée</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choisir une durée" />
                  </SelectTrigger>
                  <SelectContent>
                    {DUREES.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="paiement"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paiement</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Méthode de paiement" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAIEMENTS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
