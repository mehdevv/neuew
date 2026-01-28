import { Badge } from "@/components/ui/badge";
import { SEARCH_CATEGORIES } from "@/lib/constants/search-categories";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { FaCircleXmark } from "react-icons/fa6";

export const DestinationsFilter = ({
  selectedCategory,
  setSelectedCategory,
}: {
  selectedCategory: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const handleClick = (categoryName: string) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryName);
    }
  };
  return SEARCH_CATEGORIES.map((category) => (
    <Badge
      onClick={() => handleClick(category.dbTypeName)}
      key={category.id}
      className={cn(
        selectedCategory === category.dbTypeName &&
          "text-avt-green order-first font-bold",
        "hover:border-avt-green flex cursor-pointer items-center gap-x-1 px-2 py-1 select-none",
      )}
    >
      <Image
        src={category.icon}
        alt={category.name}
        className="size-5"
        width={16}
        height={16}
      />
      <span className="font-medium">{category.name}</span>
      {selectedCategory === category.dbTypeName && <FaCircleXmark />}
    </Badge>
  ));
};
