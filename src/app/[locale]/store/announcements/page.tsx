"use client";
import { useAnnouncementsByStoreId } from "@/hooks/useAnnouncement";
import { useAuthStore } from "@/store/auth";
import { TravelAnnouncementCard } from "@/components/TravelAnnouncementCard";
import { Button } from "@/components/ui/button";
import { FaEdit } from "react-icons/fa";
import { DeleteDialog } from "./_componenets/DeleteDialog";
import Link from "next/link";

export default function Page() {
  const { user } = useAuthStore();

  const {
    data: storeAnnouncements,
    isLoading,
    isError,
  } = useAnnouncementsByStoreId(user!.storeuser_id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {storeAnnouncements?.map((announcement) => (
        <div
          key={announcement.id}
          className="border-avt-green flex flex-col gap-y-1 rounded-lg border bg-yellow-50 p-2"
        >
          <TravelAnnouncementCard
            announcement={announcement}
            classname="hover:scale-100 hover:outline-none hover:shadow-none"
          />
          <Link href={`/store/edit-announcement/${announcement.id}`}>
            <Button className="w-full bg-blue-500">
              <FaEdit />
              Edit
            </Button>
          </Link>
          <DeleteDialog title={announcement.titre} id={announcement.id} />
        </div>
      ))}
    </div>
  );
}
