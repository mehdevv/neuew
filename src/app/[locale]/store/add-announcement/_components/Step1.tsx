import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { AnnouncementForm, CategoryWithSubCategories } from "../page";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaArrowRight } from "react-icons/fa6";
import { TagsFormField } from "./TagsFormField";

type Props = {
  categories: CategoryWithSubCategories[];
  userCategory: string;
  form: UseFormReturn<AnnouncementForm>;
  nextStep: () => void;
};

export function AnnouncementFormStep1({
  categories,
  form,
  userCategory,
  nextStep,
}: Props) {
  const { control, watch } = form;
  const userCategoryId = categories.find((c) => c.name === userCategory)?.id;

  return (
    <div className="mx-auto my-6 flex max-w-xl flex-col gap-4 rounded-lg border-2 border-zinc-200 bg-zinc-50 p-6">
      <h3 className="mb-3 text-start text-lg font-semibold md:text-xl">
        1. MetaData
      </h3>
      <FormField
        control={control}
        name="categorie_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Choisissez la catégorie
              <span className="text-sm text-red-600">*</span>
            </FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value?.toString() ?? ""}
            >
              <SelectTrigger className="w-full capitalize">
                <SelectValue placeholder="Select a Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  {categories
                    .filter((cat) => cat.id === userCategoryId)
                    .map((cat) => (
                      <SelectItem
                        key={`category-selector-${cat.id}`}
                        value={cat.id.toString()}
                        className="capitalize"
                      >
                        {cat.name.toLowerCase()}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Subcategory */}
      <FormField
        control={control}
        name="subcategorie_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Choisissez la sous catégorie
              <span className="text-sm text-red-600">*</span>
            </FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value?.toString()}
            >
              <SelectTrigger className="w-full capitalize">
                <SelectValue placeholder="Sous catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Subcategories</SelectLabel>
                  {categories
                    .find((cat) => cat.id === Number(watch("categorie_id")))
                    ?.sub_categories.map((subCat) => (
                      <SelectItem
                        key={`subcategory-selector-${subCat.id}`}
                        value={subCat.id.toString()}
                        className="capitalize"
                      >
                        {subCat.name.toLowerCase()}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <TagsFormField control={control} />

      <Button className="avt-primary-button" onClick={nextStep}>
        Next <FaArrowRight />
      </Button>
    </div>
  );
}
