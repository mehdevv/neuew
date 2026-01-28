"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";
import { AnnouncementFormStep1 } from "./_components/Step1";
import { AnnouncementFormStep2 } from "./_components/Step2";
import { AnnouncementFormStep3 } from "./_components/Step3";
import { AnnouncementFormStep4 } from "./_components/Step4";
import { FaCheck, FaDatabase, FaFile, FaImage } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import { axiosInstance } from "@/lib/utils/axios-instant";
import { apiCall } from "@/lib/utils/error-handler";
import { toast } from "sonner";
import { Category, Hebergement } from "@/types/announcements";
import { useAgencyUser } from "@/hooks/useAgency";
import { useAuthStore } from "@/store/auth";
import { formatDate } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { AnnouncementSchema } from "./_components/announcement-schema";

// schema per step
const Step1Schema = AnnouncementSchema.pick({
  categorie_id: true,
  tags: true,
});

const Step2Schema = AnnouncementSchema.pick({
  titre: true,
  destination: true,
  date_dep: true,
  date_arv: true,
  pays_dep: true,
  pays_arv: true,
  wilaya_dep: true,
  lieu_dep: true,
  prix: true,
  hebergement_id: true,
  description: true,
});

const Step3Schema = AnnouncementSchema.pick({
  photos: true,
});

export type AnnouncementForm = z.infer<typeof AnnouncementSchema>;

export type CategoryWithSubCategories = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  sub_categories: Category[];
};

export default function AddNewAnnouncementPage() {
  const form = useForm<AnnouncementForm>({
    resolver: zodResolver(AnnouncementSchema),
    defaultValues: {
      categorie_id: -1,
      subcategorie_id: undefined,
      tags: [],
      titre: "",
      destination: [""],
      date_dep: [""],
      date_arv: [""],
      wilaya_dep: "",
      pays_dep: "",
      pays_arv: "",
      lieu_dep: "",
      prix: 0,
      hebergement_id: "",
      description: "",
      photos: [],
    },
  });

  const { user } = useAuthStore();
  const { data: agencyUserData, isLoading: agencyUserLoading } = useAgencyUser(
    `${user?.storeuser_id}`,
  );

  const { handleSubmit } = form;

  const [currentStep, setCurrentStep] = useState<string>("1");

  // fetch hebergements and categories
  const [hebergements, setHebergements] = useState<Hebergement[]>([]);
  const [categories, setCategories] = useState<CategoryWithSubCategories[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const nextStep = () => {
    let currentStepSchema;
    switch (currentStep) {
      case "1":
        currentStepSchema = Step1Schema;
        break;
      case "2":
        currentStepSchema = Step2Schema;
        break;
      case "3":
        currentStepSchema = Step3Schema;
        break;
    }

    const values = form.getValues();
    const result = currentStepSchema!.safeParse(values);

    if (!result.success) {
      // show errors inside form
      result.error.errors.forEach((err) => {
        form.setError(err.path[0] as any, { message: err.message });
      });
      return;
    }

    // clear errors
    form.clearErrors();

    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentStep(`${parseInt(currentStep) + 1}`);
  };

  const previousStep = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentStep(`${parseInt(currentStep) - 1}`);
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialog, setDialog] = useState<{ title: string; message: string }>({
    title: "",
    message: "",
  });

  const onSubmit = async (data: AnnouncementForm) => {
    const formData = new FormData();

    formData.append("categorie_id", data.categorie_id.toString());
    if (data.subcategorie_id) {
      formData.append("subcategorie_id", data.subcategorie_id.toString());
    }
    formData.append("tags", JSON.stringify(data.tags)); // if array
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
    formData.append("pays_dep", data.pays_dep);
    formData.append("pays_arv", data.pays_arv);
    formData.append("lieu_dep", data.lieu_dep);
    formData.append("wilaya_dep", data.wilaya_dep);
    formData.append("prix", data.prix.toString());
    formData.append("hebergement_id", data.hebergement_id.toString());
    if (user) {
      formData.append("storeuser_id", user.storeuser_id.toString());
    }
    formData.append("description", data.description);
    formData.append("etat", "Inactif");

    if (data.photos && data.photos.length > 0) {
      data.photos.forEach((photo: File) => {
        formData.append("photos[]", photo);
      });
    }

    await apiCall(
      () =>
        axiosInstance.post(
        `/api/announcements/user/${user?.storeuser_id}/create`,
        formData,
        ),
      {
        onError: "custom",
        customErrorHandler: () => {
          setDialog({
            title: "Erreur",
            message: "Une erreur s'est produite, veuillez réessayer plus tard",
          });
          setDialogOpen(true);
        },
      },
      );

      setDialog({
        title: "Succès",
        message: "Uploadé avec succès, nos experts vont vérifier votre annonce",
      });
      setDialogOpen(true);
  };

  useEffect(() => {
    (async () => {
      try {
        const [hebergementRes, categoriesRes] = await Promise.all([
          apiCall(
            () => axiosInstance.get<Hebergement[]>("/api/hebergements"),
            {
              onError: "throw",
              errorMessage: "Failed to fetch hébergements",
            },
          ),
          apiCall(
            () => axiosInstance.get("/api/categories"),
            {
              onError: "throw",
              errorMessage: "Failed to fetch categories",
            },
          ),
        ]);

        setHebergements(hebergementRes.data);
        setCategories(categoriesRes.data);
        setIsLoading(false);
      } catch (error) {
        toast.error("Something went wrong, Please reload the page.");
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="mx-auto p-10">
      {isLoading || agencyUserLoading ? (
        <div>Loading...</div>
      ) : (
        <Tabs value={currentStep} className="">
          <TabsList className="w-full">
            <TabsTrigger value={"1"}>
              <FaDatabase />
              <span className="hidden sm:flex">Metadata</span>
            </TabsTrigger>
            <TabsTrigger value="2">
              <FaFile />
              <span className="hidden sm:flex">Announcement</span>
            </TabsTrigger>
            <TabsTrigger value="3">
              <FaImage />
              <span className="hidden sm:flex">Images</span>
            </TabsTrigger>
            <TabsTrigger value="4">
              <FaCheck />
              <span className="hidden sm:flex">Validation</span>
            </TabsTrigger>
          </TabsList>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="font-normal">
              <TabsContent value="1">
                <AnnouncementFormStep1
                  categories={categories!}
                  userCategory={`${agencyUserData?.user.domaine}`}
                  form={form}
                  nextStep={nextStep}
                />
              </TabsContent>
              <TabsContent value="2">
                <AnnouncementFormStep2
                  form={form}
                  hebergements={hebergements!}
                  previousStep={previousStep}
                  nextStep={nextStep}
                />
              </TabsContent>
              <TabsContent value="3">
                <AnnouncementFormStep3
                  form={form}
                  previousStep={previousStep}
                  nextStep={nextStep}
                />
              </TabsContent>
              <TabsContent value="4">
                <AnnouncementFormStep4
                  previousStep={previousStep}
                  categories={categories!}
                  hebergements={hebergements!}
                />
              </TabsContent>
            </form>
          </Form>
        </Tabs>
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialog.title}</DialogTitle>
            <DialogDescription>{dialog.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setDialogOpen(false);
                redirect("/store");
              }}
            >
              Je comprends
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
