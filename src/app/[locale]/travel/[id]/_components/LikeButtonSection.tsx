"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { toggleLike } from "@/lib/service/announcements";
import { toast } from "sonner";
import { Announcement } from "@/types/announcements";
import { FaHeart } from "react-icons/fa6";
import { useAnnouncementInteractions } from "@/hooks/useAnnouncement";

type LikeButtonSectionProps = {
  announcement: Announcement;
};

export function LikeButtonSection({ announcement }: LikeButtonSectionProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isLiking, setIsLiking] = useState(false);

  // Fetch interactions to check if user has liked
  const { data: interactionsData, refetch: refetchInteractions } =
    useAnnouncementInteractions(announcement.id);

  // Extract all interactions from all pages
  const allInteractions = useMemo(() => {
    if (!interactionsData?.pages) return [];
    return interactionsData.pages.flatMap((page) => page.data);
  }, [interactionsData]);

  // Calculate if current user has liked
  const isLiked = useMemo(() => {
    if (!user?.id) return false;
    return allInteractions.some(
      (interaction) =>
        interaction.voyageur_id === user.id && interaction.liked === 1,
    );
  }, [allInteractions, user?.id]);

  // Use likes_count from announcement prop
  const likesCount = announcement.likes_count || 0;

  const handleToggleLike = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    setIsLiking(true);

    try {
      // Get current bookmark state from fetched interactions
      const userInteraction = allInteractions.find(
        (i) => i.voyageur_id === user.id,
      );
      const currentBookmarkState = userInteraction?.bookmarked === 1 || false;

      const response = await toggleLike(
        announcement.id,
        !isLiked, // Toggle: if currently liked, send false; if not liked, send true
        currentBookmarkState,
        null, // Don't change rating when toggling like
      );

      toast.success(
        response.message ||
          (response.data.liked === 1 ? "Liked!" : "Like removed"),
      );

      // Refetch interactions to get updated like state
      await refetchInteractions();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to toggle like";
      toast.error(errorMessage);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-600">Likes</span>
      <Button
        type="button"
        onClick={handleToggleLike}
        disabled={isLiking}
        variant={isLiked ? "default" : "outline"}
        className={`flex h-10 w-fit items-center gap-2 px-4 transition-all ${
          isLiked
            ? "bg-avt-green hover:bg-avt-green/90 text-white"
            : "border-avt-green/30 bg-avt-green/10 text-avt-green hover:bg-avt-green/20 hover:border-avt-green/50"
        }`}
      >
        <FaHeart className={isLiked ? "h-4 w-4 fill-current" : "h-4 w-4"} />
        <span className="font-semibold">{likesCount}</span>
        {isLiking && (
          <span className="ml-1 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
      </Button>
    </div>
  );
}
