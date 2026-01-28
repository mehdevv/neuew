import z from "zod";

export const AnnouncementSchema = z.object({
  titre: z.string().min(2, "Title is too short"),
  destination: z.array(z.string().min(2, "Destination is too short")),
  date_dep: z.array(z.string()),
  date_arv: z.array(z.string()),
  lieu_dep: z.string().min(3, "Lieu is too short"),
  wilaya_dep: z.string(),
  pays_dep: z.string(),
  pays_arv: z.string(),
  description: z.string().min(10, "Description is too short"),
  prix: z.coerce.number().int().nonnegative({ message: "Price must be ≥ 0" }),
  hebergement_id: z.string(),
  categorie_id: z.coerce.number().int().positive({ message: "Required" }),
  subcategorie_id: z.coerce
    .number()
    .int()
    .positive({ message: "Required" })
    .optional(),
  tags: z.array(z.string()).min(1),
  photos: z.array(z.instanceof(File)),
});

export const EditAnnouncementSchema = AnnouncementSchema.extend({
  photos: z.array(z.union([z.instanceof(File), z.string()])).optional(),
});
