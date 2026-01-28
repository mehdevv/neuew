"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addComment } from "@/lib/service/announcements";
import { toast } from "sonner";
import Link from "next/link";
import { Announcement } from "@/types/announcements";
import { FaComment, FaCircleUser } from "react-icons/fa6";
import { useAnnouncementInteractions } from "@/hooks/useAnnouncement";

type AnnouncementInteractionsProps = {
  announcement: Announcement;
};

export function AnnouncementInteractions({
  announcement,
}: AnnouncementInteractionsProps) {
  const { user } = useAuthStore();
  const router = useRouter();

  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch interactions using the new API
  const {
    data: interactionsData,
    isLoading: isLoadingInteractions,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchInteractions,
  } = useAnnouncementInteractions(announcement.id);

  // Extract all interactions from all pages
  const allInteractions = useMemo(() => {
    if (!interactionsData?.pages) return [];
    return interactionsData.pages.flatMap((page) => page.data);
  }, [interactionsData]);

  // Extract comments from all interactions
  const comments = useMemo(() => {
    const allComments: Array<{
      id: number;
      interaction_id: number;
      content: string;
      edited: number;
      created_at: string;
      updated_at: string;
      voyageur: {
        id: number;
        name: string;
      };
    }> = [];

    allInteractions.forEach((interaction) => {
      if (
        interaction.voyageur?.comments &&
        interaction.voyageur.comments.length > 0
      ) {
        interaction.voyageur.comments.forEach((comment) => {
          allComments.push({
            id: comment.id,
            interaction_id: comment.interaction_id,
            content: comment.content,
            edited: comment.edited,
            created_at: comment.created_at,
            updated_at: comment.updated_at,
            voyageur: {
              id: interaction.voyageur.id,
              name: interaction.voyageur.name,
            },
          });
        });
      }
    });

    // Sort by created_at descending (newest first)
    allComments.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    return allComments;
  }, [allInteractions]);


  const handleAddComment = async () => {
    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    // Validate comment length (max 500 chars)
    if (comment.trim().length > 500) {
      toast.error("Comment must be 500 characters or less");
      return;
    }

    if (!user) {
      router.push("/auth/login");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await addComment(announcement.id, comment.trim());

      setComment("");
      toast.success(response.message || "Comment added successfully!");

      // Refetch interactions to get the updated comments
      await refetchInteractions();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add comment";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <>
      {/* Comment Section */}
      <section>
        <h2 className="text-foreground mb-4 flex items-center gap-2 text-xl font-semibold">
          <FaComment className="h-5 w-5 text-blue-500" />
          Comments
        </h2>

        {user ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Write your comment here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px]"
                rows={4}
                maxLength={500}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>
                  {comment.length > 450 && (
                    <span
                      className={
                        comment.length >= 500
                          ? "text-red-500"
                          : "text-orange-500"
                      }
                    >
                      {500 - comment.length} characters remaining
                    </span>
                  )}
                </span>
                <span>{comment.length}/500</span>
              </div>
            </div>
            <Button
              onClick={handleAddComment}
              disabled={
                isSubmitting || !comment.trim() || comment.trim().length > 500
              }
              className="avt-primary-button"
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        ) : (
          <div className="rounded-lg border bg-zinc-50 p-6 text-center">
            <p className="mb-4 text-gray-600">
              Please log in to leave a comment
            </p>
            <Link href="/auth/login">
              <Button className="avt-primary-button">Log In</Button>
            </Link>
          </div>
        )}

        {/* Display all comments */}
        {isLoadingInteractions ? (
          <div className="mt-6 text-center text-gray-500">
            <p>Loading comments...</p>
          </div>
        ) : comments.length > 0 ? (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">
              {announcement.comments_count !== undefined
                ? `${announcement.comments_count} ${announcement.comments_count === 1 ? "Comment" : "Comments"}`
                : `${comments.length} ${comments.length === 1 ? "Comment" : "Comments"}`}
            </h3>
            <div className="space-y-3">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-lg border bg-white p-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <FaCircleUser className="text-avt-green h-4 w-4" />
                    <span className="text-sm font-semibold">
                      {comment.voyageur?.name || "Anonymous"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                    {comment.edited === 1 && (
                      <span className="text-xs text-gray-400 italic">
                        (edited)
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">
                    {comment.content || ""}
                  </p>
                </div>
              ))}
            </div>
            {hasNextPage && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={isFetchingNextPage}
                  className="avt-primary-button"
                >
                  {isFetchingNextPage ? "Loading..." : "Load More Comments"}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6 text-center text-gray-500">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </section>
    </>
  );
}
