import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { KeyboardEvent, useState } from "react";
import { AnnouncementForm } from "../page";
import { Control } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaXmark, FaPlus } from "react-icons/fa6";

type Props = {
  control: Control<AnnouncementForm>;
};

export function TagsFormField({ control }: Props) {
  const [inputValue, setInputValue] = useState("");
  return (
    <FormField
      control={control}
      name="tags"
      render={({ field }) => {
        const addTag = () => {
          const trimmed = inputValue.trim();
          if (trimmed && !field.value?.includes(trimmed)) {
            field.onChange([...(field.value || []), trimmed]);
            setInputValue("");
          }
        };

        const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag();
          }
        };

        const removeTag = (tag: string) => {
          field.onChange(field.value?.filter((t: string) => t !== tag));
        };

        const canAddTag =
          inputValue.trim() && !field.value?.includes(inputValue.trim());

        return (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <FormControl>
              <div className="flex flex-col gap-3">
                <div className="flex">
                  <Input
                    placeholder="Entrez un tag"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 rounded-r-none"
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    disabled={!canAddTag}
                    size="default"
                    className="avt-primary-button shrink-0 rounded-l-none"
                    aria-label="Ajouter un tag"
                  >
                    <FaPlus className="h-4 w-4" />
                  </Button>
                </div>
                {field.value && field.value.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {field.value.map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="default"
                        className="hover:bg-destructive/10 hover:text-destructive cursor-pointer gap-1.5 font-normal transition-colors"
                        onClick={() => removeTag(tag)}
                        aria-label={`Supprimer le tag ${tag}`}
                      >
                        <span>{tag}</span>
                        <FaXmark className="h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                )}
                {(!field.value || field.value.length === 0) && (
                  <div className="text-muted-foreground rounded-md border border-dashed p-3 text-center text-sm">
                    Aucun tag ajouté. Utilisez le bouton (+) pour ajouter des
                    tags.
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
