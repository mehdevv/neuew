"use client";

import { useEffect } from "react";
import { Announcement } from "@/types/announcements";

type AnnouncementMetaTagsProps = {
  announcement: Announcement;
};

export function AnnouncementMetaTags({
  announcement,
}: AnnouncementMetaTagsProps) {
  const baseUrl = process.env.NEXT_PUBLIC_STORAGE_URL;
  const firstPhoto = announcement.photos?.[0];

  // Ensure image URL is absolute
  let imageUrl: string | undefined;
  if (firstPhoto) {
    if (firstPhoto.startsWith("http://") || firstPhoto.startsWith("https://")) {
      imageUrl = firstPhoto;
    } else {
      // Remove leading slash if present to avoid double slashes
      const cleanPath = firstPhoto.startsWith("/")
        ? firstPhoto.slice(1)
        : firstPhoto;
      imageUrl = baseUrl ? `${baseUrl}/${cleanPath}` : undefined;
    }
  }

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const title = announcement.titre || "Travel Announcement";
  const description =
    announcement.description?.replace(/<[^>]*>/g, "").substring(0, 160) ||
    `Travel to ${announcement.destination || "Algeria"}`;

  useEffect(() => {
    // Remove existing meta tags if they exist
    const existingTags = document.querySelectorAll(
      'meta[property^="og:"], meta[name^="twitter:"]',
    );
    existingTags.forEach((tag) => tag.remove());

    // Create and add Open Graph meta tags
    const ogTags: Array<{ property: string; content: string }> = [
      { property: "og:type", content: "website" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: currentUrl },
      ...(imageUrl ? [{ property: "og:image", content: imageUrl }] : []),
      ...(imageUrl ? [{ property: "og:image:width", content: "1200" }] : []),
      ...(imageUrl ? [{ property: "og:image:height", content: "630" }] : []),
      { property: "og:site_name", content: "Algeria Virtual Travel" },
    ];

    // Create and add Twitter Card meta tags
    const twitterTags: Array<{ name: string; content: string }> = [
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      ...(imageUrl ? [{ name: "twitter:image", content: imageUrl }] : []),
    ];

    // Add all meta tags to the head
    ogTags.forEach((tag) => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", tag.property);
      meta.setAttribute("content", tag.content);
      document.head.appendChild(meta);
    });

    twitterTags.forEach((tag) => {
      const meta = document.createElement("meta");
      meta.setAttribute("name", tag.name);
      meta.setAttribute("content", tag.content);
      document.head.appendChild(meta);
    });

    // Update page title
    document.title = `${title} | Algeria Virtual Travel`;

    // Cleanup function to remove meta tags when component unmounts
    return () => {
      const tagsToRemove = document.querySelectorAll(
        'meta[property^="og:"], meta[name^="twitter:"]',
      );
      tagsToRemove.forEach((tag) => tag.remove());
    };
  }, [announcement, title, description, currentUrl, imageUrl]);

  return null; // This component doesn't render anything
}
