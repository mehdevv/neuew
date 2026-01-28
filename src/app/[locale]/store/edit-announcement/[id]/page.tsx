"use client";

import { useParams } from "next/navigation";
import { useAnnouncementById } from "@/hooks/useAnnouncement";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
// import { PhotoManager } from "../_components/PhotoManager";
import { z } from "zod";
import { RichTextEditor } from "../../add-announcement/_components/RichTextEditor";
import { TagsFormField } from "../../add-announcement/_components/TagsFormField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactFlagsSelect from "react-flags-select";
import { WILAYA_BY_ID } from "@/lib/constants/wilayas-by-id";
import { Hebergement } from "@/types/announcements";
import { axiosInstance } from "@/lib/utils/axios-instant";
import { apiCall } from "@/lib/utils/error-handler";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { formatDate } from "date-fns";
import { useAuthStore } from "@/store/auth";
import {
  AnnouncementSchema,
  EditAnnouncementSchema,
} from "../../add-announcement/_components/announcement-schema";
import { MultiTextInput } from "../../add-announcement/_components/MultiTextInput";
import { DateRangeArrayInput } from "../../add-announcement/_components/DateRangeArrayInput";
import { useRouter } from "next/navigation";

// Custom schema for edit form that handles both File objects and string paths for photos

export type EditAnnouncementForm = z.infer<typeof EditAnnouncementSchema>;

// type PhotoItem = {
//   id: string;
//   type: "existing" | "new";
//   file?: File;
//   path?: string;
// };

export default function EditAnnouncementPage() {
  const { id } = useParams<{ id: string }>();
  const {
    data,
    isLoading: isAnnouncementLoading,
    isError,
  } = useAnnouncementById(id);

  const form = useForm<EditAnnouncementForm>({
    resolver: zodResolver(EditAnnouncementSchema),
  });

  const [hebergements, setHebergements] = useState<Hebergement[]>([]);
  // const [photos, setPhotos] = useState<PhotoItem[]>([]);
  // const [existingPhotos, setExistingPhotos] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuthStore();

  useEffect(() => {
    (async () => {
      await apiCall(
        () => axiosInstance.get<Hebergement[]>("/api/hebergements"),
        {
          onError: "toast",
          errorMessage: "Something went wrong, Please reload the page.",
        },
      )
        .then((res) => {
          setHebergements(res.data);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    })();
  }, []);

  useEffect(() => {
    if (data) {
      // Parse existing photos from string
      // const parsedPhotos =
      //   typeof data.photos === "string" ? JSON.parse(data.photos) : [];

      // setExistingPhotos(parsedPhotos);

      form.reset({
        titre: data.titre,
        description: data.description,
        destination: data.destination ? [...data.destination] : [],
        date_dep: data.date_dep
          ? data.date_dep.map((date) => formatDate(date, "yyyy-MM-dd"))
          : [],
        date_arv: data.date_arv
          ? data.date_arv.map((date) => formatDate(date, "yyyy-MM-dd"))
          : [],
        prix: parseInt(data.prix),
        categorie_id: data.categorie_id,
        subcategorie_id: data.subcategorie_id,
        tags: data.tags ? data.tags.map((tag) => tag.toString()) : [],
        hebergement_id: data.hebergement_id.toString(),
        lieu_dep: data.lieu_dep,
        wilaya_dep: data.wilaya_dep,
        pays_dep: data.pays_dep || "",
        pays_arv: data.pays_arv || "",
      });
    }
  }, [data, form]);

  const router = useRouter();

  async function onSubmit(data: EditAnnouncementForm) {
    const formData = new FormData();

    formData.append("categorie_id", data.categorie_id.toString());
    if (data.subcategorie_id) {
      formData.append("subcategorie_id", data.subcategorie_id.toString());
    }
    formData.append("tags", JSON.stringify(data.tags));
    formData.append("titre", data.titre);
    data.destination.forEach((dest) => {
      formData.append("destination[]", dest);
    });

    data.date_dep.forEach((date) => {
      formData.append("date_dep[]", formatDate(date, "yyyy-MM-dd"));
    });

    data.date_arv.forEach((date) => {
      formData.append("date_arv[]", formatDate(date, "yyyy-MM-dd"));
    });
    formData.append("lieu_dep", data.lieu_dep);
    formData.append("wilaya_dep", data.wilaya_dep);
    formData.append("pays_dep", data.pays_dep);
    formData.append("pays_arv", data.pays_arv);
    formData.append("prix", data.prix.toString());
    formData.append("hebergement_id", data.hebergement_id.toString());
    formData.append("storeuser_id", user!.storeuser_id.toString());
    formData.append("description", data.description);
    formData.append("etat", "Inactif");

    // formData as json
    const formDataJson = Object.fromEntries(formData.entries());
    console.log(formDataJson);

    await apiCall(
      () => axiosInstance.post(`/api/announcements/${id}/update`, formData),
      {
        onError: "toast",
        errorMessage: "Failed to update announcement",
      },
    );
    toast.success("Announcement updated successfully");
    // router.push(`/store/announcements`);
  }

  // const handlePhotosChange = (updatedPhotos: PhotoItem[]) => {
  //   setPhotos(updatedPhotos);
  // };

  if (isLoading || isAnnouncementLoading) return <div>Loading…</div>;
  if (isError) return <div>Error loading announcement</div>;
  if (!data) return <div>No announcement found</div>;

  console.log(data);

  return (
    <div className="mx-auto max-w-xl bg-zinc-50 p-3">
      <h1 className="mb-6 text-xl font-semibold">Edit Announcement</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Titre */}
          <FormField
            control={form.control}
            name="titre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Titre
                  <span className="text-sm text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Titre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Destination */}
          <MultiTextInput form={form} name="destination" label="Destination" />

          {/* Dates */}
          <DateRangeArrayInput
            form={form}
            departureField="date_dep"
            arrivalField="date_arv"
            label="Périodes de voyage"
          />

          {/* Wilaya & Lieu */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="wilaya_dep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Wilaya départ
                    <span className="text-sm text-red-600">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionnez wilaya" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {WILAYA_BY_ID.map((wilaya) => (
                        <SelectItem
                          key={`wilaya-select-${wilaya.id}`}
                          value={wilaya.name}
                        >
                          {wilaya.code} - {wilaya.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lieu_dep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Lieu départ
                    <span className="text-sm text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Lieu de départ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Pays depart */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="pays_dep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Pays de départ
                    <span className="text-sm text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <ReactFlagsSelect
                      key={field.value}
                      selected={field.value ?? ""}
                      onSelect={(code: string) => field.onChange(code)}
                      searchable={true}
                      placeholder="Select"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Pays arrivée */}
            <FormField
              control={form.control}
              name="pays_arv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Pays d&apos;arrivée
                    <span className="text-sm text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <ReactFlagsSelect
                      selected={field.value ?? ""}
                      onSelect={(code: string) => field.onChange(code)}
                      searchable={true}
                      placeholder="Select"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Prix */}
          <FormField
            control={form.control}
            name="prix"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Prix (DZD)
                  <span className="text-red-601 text-sm">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="30 000"
                    value={
                      field.value
                        ? field.value
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                        : ""
                    }
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\s+/g, "");
                      const num = raw === "" ? "" : Number(raw);
                      field.onChange(num);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Hébergement */}
          {hebergements.length > 0 && (
            <FormField
              control={form.control}
              name="hebergement_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Hébergement
                    <span className="text-sm text-red-600">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionnez hébergement" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {hebergements.map((h) => (
                        <SelectItem
                          key={`hebergement-select-${h.id}`}
                          value={h.id.toString()}
                        >
                          {h.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description
                  <span className="text-sm text-red-600">*</span>
                </FormLabel>
                <RichTextEditor
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
                <Textarea
                  className="hidden"
                  {...field}
                  value={form.watch("description")}
                />
              </FormItem>
            )}
          />
          <TagsFormField control={form.control as any} />
          {/* Photos */}
          {/* <div className="space-y-4">
            <PhotoManager
              existingPhotos={existingPhotos}
              onPhotosChange={handlePhotosChange}
            />
          </div> */}
          <Button
            type="submit"
            variant={"default"}
            className="w-full bg-green-500"
          >
            Sauvegarder
          </Button>
        </form>
      </Form>
    </div>
  );
}
