"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WilayaByIdType } from "@/lib/constants/wilayas-by-id";

interface Props {
  wilayas: WilayaByIdType[];
  selectedWilaya: string | null;
  setSelectedWilaya: (val: string) => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

export default function SearchCategoryFilter({
  wilayas,
  selectedWilaya,
  setSelectedWilaya,
  searchTerm,
  setSearchTerm,
}: Props) {
  return (
    <div className="flex w-full flex-col gap-2 md:flex-row md:items-end">
      <Select value={selectedWilaya ?? ""} onValueChange={setSelectedWilaya}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sélectionnez une wilaya" />
        </SelectTrigger>
        <SelectContent>
          {wilayas.map(({ id, name, old_id }) => (
            <SelectItem key={id} value={old_id.toString()}>
              {id}. {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Search input */}
      <Input
        type="text"
        placeholder="Recherche..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}
