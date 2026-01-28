"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FaUpload } from "react-icons/fa6";
import { toast } from "sonner";
import { Control } from "react-hook-form";
import { StoreFormValues } from "../page";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export function FileUpload({ control }: { control: Control<StoreFormValues> }) {
  const imageRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [rcUploaded, setRcUploaded] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1000000) {
      toast.error("File size is too large");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3000000) {
      toast.error("File size is too large");
      return;
    }
    setRcUploaded(true);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Profile Image Upload */}
      <FormField
        name="profile_img"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Logo / Photo de Profile (Max 1MB)</FormLabel>
            <FormControl>
              <div className="flex flex-col items-center gap-3">
                <label
                  htmlFor="profile-img"
                  className="ring-offset-background hover:ring-avt-green/50 flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-zinc-200 transition-all hover:ring-2"
                >
                  {preview ? (
                    <Image
                      src={preview}
                      alt="Profile preview"
                      width={112}
                      height={112}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-muted-foreground text-sm">Image</span>
                  )}
                </label>

                <Input
                  id="profile-img"
                  type="file"
                  accept="image/*"
                  ref={imageRef}
                  onChange={(e) => {
                    handleImageUpload(e);
                    const file = e.target.files?.[0];
                    if (file) {
                      field.onChange(file); // Store the actual File object like your old code
                    }
                  }}
                  className="hidden"
                />

                <Button type="button" onClick={() => imageRef.current?.click()}>
                  <FaUpload />
                  Upload Image
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* RC PDF Upload */}
      <FormField
        name="reg_com_file"
        control={control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Copie du Registre de Commerce (Max 3MB)</FormLabel>
            <FormControl>
              <div className="flex flex-col items-center gap-3">
                <label
                  htmlFor="rc-pdf"
                  className="text-muted-foreground hover:ring-avt-green/50 flex h-28 w-28 cursor-pointer items-center justify-center rounded bg-zinc-200 text-sm transition-all hover:ring-2"
                >
                  {rcUploaded ? (
                    <span className="text-center text-xs font-medium text-green-600">
                      Fichier
                      <br />
                      téléchargé
                    </span>
                  ) : (
                    <>PDF</>
                  )}
                </label>

                <Input
                  id="rc-pdf"
                  type="file"
                  accept="application/pdf"
                  ref={pdfRef}
                  onChange={(e) => {
                    handlePdfUpload(e);
                    const file = e.target.files?.[0];
                    if (file) {
                      field.onChange(file); // Store the actual File object like your old code
                    }
                  }}
                  className="hidden"
                />

                <Button type="button" onClick={() => pdfRef.current?.click()}>
                  <FaUpload />
                  Upload PDF
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
