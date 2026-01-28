"use client";

import { useParams } from "next/navigation";
import AnnouncementDetails from "./_components/AnnouncementDetails";
import { AnnouncementMetaTags } from "./_components/AnnouncementMetaTags";
import {
  useAnnouncementById,
  useRelatedAnnouncements,
} from "@/hooks/useAnnouncement";

export default function AnnouncementDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const {
    data: announcement,
    isLoading: isAnnouncementLoading,
    error: announcementError,
  } = useAnnouncementById(id);
  const {
    data: related,
    isLoading: isRelatedLoading,
    error: relatedError,
  } = useRelatedAnnouncements(id);

  // Show loading only if we don't have cached data
  if ((isAnnouncementLoading && !announcement) || isRelatedLoading) {
    return <p>Loading...</p>;
  }

  if (announcementError) return <p>{JSON.stringify(announcementError)}</p>;
  if (relatedError) return <p>{JSON.stringify(relatedError)}</p>;
  if (!announcement) return <p>Announcement not found</p>;

  return (
    <>
      <AnnouncementMetaTags announcement={announcement} />
      <AnnouncementDetails
        announcement={announcement}
        related={related || []}
      />
    </>
  );
}
