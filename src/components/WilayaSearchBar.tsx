import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";
import { FaMagnifyingGlass, FaMap } from "react-icons/fa6";
import { WilayaByIdType } from "@/lib/constants/wilayas-by-id";

type Props = {
  wilayas: WilayaByIdType[];
  selected: WilayaByIdType | null;
  setSelected: (w: WilayaByIdType) => void;
};

export function WilayaSearchBar({ wilayas, selected, setSelected }: Props) {
  const t = useTranslations("SearchPage");

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <Select
        onValueChange={(value) => {
          const wilaya = wilayas.find((w) => w.id === value);
          if (wilaya) setSelected(wilaya);
        }}
        value={selected ? selected.id : ""}
      >
        <SelectTrigger className="w-full justify-between">
          <SelectValue className="" placeholder={t("Wilaya")} />
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className="h-72">
            {wilayas.map((wilaya) => (
              <SelectItem key={wilaya.id} value={wilaya.id}>
                {wilaya.code}. {wilaya.name}
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>

      <Button
        onClick={() => selected && redirect(`/wilaya/${selected.id}`)}
        className="avt-primary-button !p-2"
      >
        <FaMagnifyingGlass />
        <span className="hidden md:block">{t("Research")}</span>
      </Button>

      <Link href="/map">
        <Button className="avt-primary-button !p-2">
          <FaMap className="text-white" />
        </Button>
      </Link>
    </div>
  );
}
