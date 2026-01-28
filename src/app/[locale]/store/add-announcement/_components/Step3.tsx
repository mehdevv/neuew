import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaArrowLeft, FaArrowRight, FaTrash } from "react-icons/fa6";
import { useDropzone } from "react-dropzone";
import { AnnouncementForm } from "../page";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  previousStep: () => void;
  nextStep: () => void;
  form: UseFormReturn<AnnouncementForm>;
};

export function AnnouncementFormStep3({ previousStep, nextStep, form }: Props) {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxSize: 5 * 1024 * 1024, // 5 MB
    onDropRejected() {
      toast.error("Taille de fichier trop grande! Max 5MB");
    },
    multiple: true,
  });

  const removeFile = (file: File) => {
    setFiles((prev) => prev.filter((f) => f !== file));
  };

  useEffect(() => {
    // if hook form has files, set them the the state
    if (form.getValues("photos").length > 0) {
      setFiles(form.getValues("photos"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    form.setValue("photos", files);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  return (
    <div className="mx-auto my-6 flex max-w-xl flex-col gap-4 rounded-lg border-2 border-zinc-200 bg-zinc-50 p-6">
      <h3 className="mb-3 text-start text-lg font-semibold md:text-xl">
        3. Image upload
      </h3>
      <p className="text-start">Max 5MB par image.</p>
      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed py-28 transition ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        <p className="p-2 text-base text-gray-500">
          {isDragActive
            ? "Drop the files here..."
            : "Drag & drop photos here, or click to select"}
        </p>
      </div>
      {files.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-medium text-gray-700">
            Photos sélectionnées ({files.length})
          </h4>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {files.map((photo) => (
              <div key={photo.name} className="relative">
                <Button
                  type="button"
                  onClick={() => removeFile(photo)}
                  className="absolute -top-2 -right-2 z-10 h-6 w-6 rounded-full bg-red-500 p-0 text-white"
                >
                  <FaTrash size={12} />
                </Button>

                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={URL.createObjectURL(photo)}
                    alt={`Photo ${photo.name}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex w-full flex-row justify-between gap-4">
        <Button className="avt-outline-button" onClick={previousStep}>
          <FaArrowLeft />
          Previous
        </Button>

        <Button
          className="avt-primary-button"
          onClick={() => {
            nextStep();
          }}
        >
          Next <FaArrowRight />
        </Button>
      </div>
    </div>
  );
}
