import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaTrash, FaPlus } from "react-icons/fa6";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

type PhotoItem = {
  id: string;
  type: "existing" | "new";
  file?: File;
  path?: string;
};

type Props = {
  existingPhotos: string[];
  onPhotosChange: (photos: PhotoItem[]) => void;
};

export function PhotoManager({ existingPhotos, onPhotosChange }: Props) {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);

  // Initialize photos from existing photos
  useEffect(() => {
    const initialPhotos: PhotoItem[] = existingPhotos.map((photo, index) => ({
      id: `existing-${index}`,
      type: "existing",
      path: photo,
    }));
    setPhotos(initialPhotos);
  }, [existingPhotos]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newPhotos: PhotoItem[] = acceptedFiles.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      type: "new",
      file,
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
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

  const removePhoto = (photoId: string) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
  };

  // Notify parent component when photos change
  useEffect(() => {
    onPhotosChange(photos);
  }, [photos, onPhotosChange]);

  const getImageSrc = (photo: PhotoItem) => {
    if (photo.type === "new" && photo.file) {
      return URL.createObjectURL(photo.file);
    }
    if (photo.type === "existing" && photo.path) {
      const baseUrl = process.env.NEXT_PUBLIC_STORAGE_URL;
      return `${baseUrl}/${photo.path.replace(/\\/g, "")}`;
    }
    return "";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Photos</h3>
        <span className="text-sm text-gray-500">Max 5MB par image</span>
      </div>

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed py-8 transition ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        <FaPlus className="mb-2 text-2xl text-gray-400" />
        <p className="text-sm text-gray-500">
          {isDragActive
            ? "Drop the files here..."
            : "Drag & drop photos here, or click to select"}
        </p>
      </div>

      {/* Photo grid */}
      {photos.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-medium text-gray-700">
            Photos sélectionnées ({photos.length})
          </h4>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative">
                <Button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  className="absolute -top-2 -right-2 z-10 h-6 w-6 rounded-full bg-red-500 p-0 text-white"
                >
                  <FaTrash size={12} />
                </Button>

                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={getImageSrc(photo)}
                    alt={`Photo ${photo.id}`}
                    fill
                    className="object-cover"
                  />
                </div>

                {photo.type === "existing" && (
                  <div className="mt-1 text-xs text-gray-500">Existant</div>
                )}
                {photo.type === "new" && (
                  <div className="mt-1 text-xs text-green-600">Nouveau</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
