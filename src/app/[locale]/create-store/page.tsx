"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ContactInfo } from "./_components/ContactInfo";
import { BusinessInfo } from "./_components/BusinessInfo";
import { FileUpload } from "./_components/FileUpload.tsx";
import { SocialLinks } from "./_components/SocialLinks";
import StoreIntro from "./_components/StoreIntro";
import { axiosInstance } from "@/lib/utils/axios-instant";
import { apiCall } from "@/lib/utils/error-handler";

const storeSchema = z.object({
  nom: z.string().min(2),
  prenom: z.string().min(2),
  pseudo: z.string(),
  denomination: z.string(),
  tlfn: z.string(),
  email: z.string().email(),
  reg_com: z.string(),
  wilaya: z.string(),
  commune: z.string(),
  adresse: z.string(),
  abonnement: z.string(),
  domaine: z.string(),
  duree_abn: z.string(),
  paiement: z.string(),
  profile_img: z.any().optional(),
  reg_com_file: z.any().optional(),
  url_fb: z.string().optional(),
  url_insta: z.string().optional(),
  url_ytb: z.string().optional(),
  url_web: z.string().optional(),
});

export type StoreFormValues = z.infer<typeof storeSchema>;

export default function CreateStorePage() {
  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {},
  });

  const onSubmit = async (values: StoreFormValues) => {
    const formData = new FormData();

    // Add all form fields exactly like your old working code
    formData.append("nom", values.nom);
    formData.append("prenom", values.prenom);
    formData.append("pseudo", values.pseudo);
    formData.append("denomination", values.denomination);
    formData.append("tlfn", values.tlfn);
    formData.append("email", values.email);
    formData.append("reg_com", values.reg_com);
    formData.append("wilaya", values.wilaya);
    formData.append("commune", values.commune);
    formData.append("adresse", values.adresse);
    formData.append("abonnement", values.abonnement);
    formData.append("domaine", values.domaine);
    formData.append("duree_abn", values.duree_abn);
    formData.append("paiement", values.paiement);
    formData.append("url_fb", values.url_fb || "");
    formData.append("url_insta", values.url_insta || "");
    formData.append("url_ytb", values.url_ytb || "");
    formData.append("url_web", values.url_web || "");

    // Add files only if they exist (like your old code)
    if (values.profile_img) {
      formData.append("profile_img", values.profile_img);
    }
    if (values.reg_com_file) {
      formData.append("reg_com_file", values.reg_com_file);
    }

    formData.append("etat", "Inactif");
    // Validate required fields before sending
    const requiredFields = [
      "nom",
      "prenom",
      "pseudo",
      "denomination",
      "tlfn",
      "email",
      "reg_com",
      "wilaya",
      "commune",
      "adresse",
      "abonnement",
      "domaine",
      "duree_abn",
      "paiement",
    ];
    const missingFields = requiredFields.filter(
      (field) => !values[field as keyof StoreFormValues],
    );

    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      toast.error(`Missing required fields: ${missingFields.join(", ")}`);
      return;
    }

    await apiCall(() => axiosInstance.post("/api/storeusers/store", formData), {
      onError: "toast",
      errorMessage: "Failed to submit store",
    });
    toast.success("Store submitted!");
  };

  return (
    <section className="mx-auto my-6 max-w-4xl space-y-6 p-6">
      <StoreIntro />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 rounded-lg border border-zinc-200 bg-zinc-50 p-6"
        >
          <ContactInfo control={form.control} />
          <BusinessInfo control={form.control} />
          <FileUpload control={form.control} />
          <SocialLinks control={form.control} />
          <Button type="submit" className="avt-primary-button w-full">
            Submit
          </Button>
        </form>
      </Form>
    </section>
  );
}
