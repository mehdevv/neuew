import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function getS3UrlOrDefault(path: string): string {
  const s3BaseUrl = process.env.NEXT_PUBLIC_S3_BASE_URL;
  return isValidUrl(path) ? path : `${s3BaseUrl}/${path}`;
}
