import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa6";
import Image from "next/image";
import { CategoryWithSubCategories } from "../page";
import { Hebergement } from "@/types/announcements";
import { WILAYA_BY_ID } from "@/lib/constants/wilayas-by-id";

type Props = {
  previousStep: () => void;
  categories: CategoryWithSubCategories[];
  hebergements: Hebergement[];
};

export function AnnouncementFormStep4({
  previousStep,
  categories,
  hebergements,
}: Props) {
  const form = useFormContext();
  const values = form.getValues();

  const category = categories.find(
    (c) => c.id.toString() === values.categorie_id,
  );
  const subcategory = category?.sub_categories.find(
    (c) => c.id.toString() === values.subcategorie_id,
  );
  const hebergement = hebergements.find(
    (h) => h.id.toString() === values.hebergement_id,
  );

  return (
    <div className="mx-auto my-6 flex max-w-xl flex-col gap-4 rounded-lg border-2 border-zinc-200 bg-zinc-50 p-6">
      <h3 className="mb-3 text-start text-lg font-semibold md:text-xl">
        Review Your Announcement
      </h3>

      <div className="grid gap-4 rounded-lg border p-4">
        <ReviewRow
          label="Catégorie"
          value={values.categorie_id ? category?.name : "N/A"}
        />
        <ReviewRow
          label="Sous-catégorie"
          value={values.subcategorie_id ? subcategory?.name : "N/A"}
        />
        <ReviewRow label="Tags" value={(values.tags || []).join(", ")} />
        <ReviewRow label="Titre" value={values.titre} />
        <ReviewRow label="Destination" value={values.destination} />
        <ReviewRow label="Date Départ" value={values.date_dep} />
        <ReviewRow label="Date Arrivée" value={values.date_arv} />
        <ReviewRow
          label="Wilaya Départ"
          value={WILAYA_BY_ID.find((w) => w.id === values.wilaya_dep)?.name}
        />
        <ReviewRow label="Lieu Départ" value={values.lieu_dep} />
        <ReviewRow label="Prix" value={values.prix} />
        <ReviewRow
          label="Hébergement"
          value={values.hebergement_id ? hebergement?.name : "N/A"}
        />
        <div className="flex flex-col border-b pb-2">
          <span className="font-medium">Description:</span>
          <span
            className="prose prose-sm font-semibold"
            dangerouslySetInnerHTML={{ __html: values.description }}
          ></span>
        </div>
        <div>
          <span className="font-medium">Photos:</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {(values.photos || []).map((file: File, idx: number) => (
              <Image
                key={idx}
                src={URL.createObjectURL(file)}
                alt={`Photo ${idx + 1}`}
                className="h-20 w-20 rounded object-cover"
                width={120}
                height={120}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex w-full flex-row justify-between gap-4">
        <Button className="avt-outline-button" onClick={previousStep}>
          <FaArrowLeft />
          Previous
        </Button>
        <Button
          className="avt-primary-button"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Publishing..." : "Publish"}
        </Button>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: any }) {
  const displayValue = Array.isArray(value)
    ? value.length > 0
      ? value.join(", ")
      : "-"
    : (value ?? "-");

  return (
    <div className="flex justify-between border-b pb-2">
      <span className="font-medium">{label}:</span>
      <span className="font-semibold">{displayValue}</span>
    </div>
  );
}
