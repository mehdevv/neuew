"use client";

import { useState } from "react";
import { FaStar } from "react-icons/fa6";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

type RatingComponentProps = {
  rating: number; // Current average rating (0-5)
  count: number; // Number of people who rated
  onRate: (rating: number) => void | Promise<void>; // Callback function when rating is submitted
};

export function RatingComponent({
  rating,
  count,
  onRate,
}: RatingComponentProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const [showLoginPopover, setShowLoginPopover] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localRating, setLocalRating] = useState(rating);
  const [localCount, setLocalCount] = useState(count);

  const handleStarClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    starValue: number,
  ) => {
    if (!user) {
      setShowSignInDialog(true);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isHalf = clickX < rect.width / 2;

    const ratingValue = isHalf ? starValue - 0.5 : starValue;
    setSelectedRating(ratingValue);
    setShowConfirmModal(true);
  };

  const handleStarHover = (
    e: React.MouseEvent<HTMLButtonElement>,
    starValue: number,
  ) => {
    if (!user) {
      setShowLoginPopover(true);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const hoverX = e.clientX - rect.left;
    const isHalf = hoverX < rect.width / 2;

    const ratingValue = isHalf ? starValue - 0.5 : starValue;
    setHoveredRating(ratingValue);
  };

  const handleConfirmRating = async () => {
    if (selectedRating === null) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Call the onRate callback
      await onRate(selectedRating);

      // Update local state optimistically
      const newCount = localCount + 1;
      const newRating = (localRating * localCount + selectedRating) / newCount;
      setLocalRating(newRating);
      setLocalCount(newCount);

      const ratingText =
        selectedRating % 1 === 0
          ? `${selectedRating} star${selectedRating !== 1 ? "s" : ""}`
          : `${selectedRating} stars`;
      toast.success(`Thank you! You rated this ${ratingText}.`);
      setShowConfirmModal(false);
      setSelectedRating(null);
      setHoveredRating(null);
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelRating = () => {
    setShowConfirmModal(false);
    setSelectedRating(null);
    setHoveredRating(null);
  };

  const displayRating = hoveredRating !== null ? hoveredRating : localRating;
  const fullStars = Math.floor(displayRating);
  const hasHalfStar = displayRating % 1 >= 0.5;

  return (
    <>
        <div className="flex items-center gap-3">
          <Popover
            open={showLoginPopover && !user}
            onOpenChange={setShowLoginPopover}
          >
            <PopoverTrigger asChild>
              <div
              className="flex items-center gap-0.5"
                onMouseEnter={() => {
                  if (!user) {
                    setShowLoginPopover(true);
                  }
                }}
                onMouseLeave={() => {
                  if (!user) {
                    setShowLoginPopover(false);
                  }
                }}
              >
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFullFilled = star <= fullStars;
                  const isHalfFilled = star === fullStars + 1 && hasHalfStar;
                  const isEmpty = !isFullFilled && !isHalfFilled;

                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={(e) => handleStarClick(e, star)}
                      onMouseMove={(e) => handleStarHover(e, star)}
                      onMouseLeave={() => setHoveredRating(null)}
                      disabled={!user}
                      className={`relative transition-transform ${
                        user
                          ? "focus:ring-avt-green cursor-pointer hover:scale-110 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                          : "cursor-not-allowed opacity-60"
                      } rounded`}
                      aria-label={`Rate ${star - 0.5} to ${star} stars`}
                      title={
                        !user
                          ? "Please log in to rate"
                          : `Rate ${star - 0.5} to ${star} stars`
                      }
                    >
                      {/* Background (empty) star */}
                      <FaStar
                      className={`h-5 w-5 fill-gray-200 text-gray-200 transition-colors`}
                      />
                      {/* Foreground (filled) star - clipped for half stars */}
                      <div
                        className={`absolute inset-0 overflow-hidden ${
                          isFullFilled
                            ? "w-full"
                            : isHalfFilled
                              ? "w-1/2"
                              : "w-0"
                        } transition-all duration-150`}
                      >
                      <FaStar className="h-5 w-5 fill-avt-green text-avt-green" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </PopoverTrigger>
            {!user && (
              <PopoverContent
                side="top"
                align="center"
                className="w-auto p-3 text-sm"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <p className="text-center">Please login to leave a rating</p>
              </PopoverContent>
            )}
          </Popover>
          <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900">
              {localRating.toFixed(1)} / 5.0
            </span>
            <span className="text-xs text-gray-500">
              ({localCount} {localCount === 1 ? "rating" : "ratings"})
            </span>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog
        open={showConfirmModal}
        onOpenChange={(open) => {
          setShowConfirmModal(open);
          if (!open) {
            setSelectedRating(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Rating</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const selected = selectedRating || 0;
                const isFullFilled = star <= Math.floor(selected);
                const isHalfFilled =
                  star === Math.floor(selected) + 1 && selected % 1 >= 0.5;

                return (
                  <div key={star} className="relative">
                    <FaStar className="h-8 w-8 fill-gray-200 text-gray-200" />
                    <div
                      className={`absolute inset-0 overflow-hidden ${
                        isFullFilled ? "w-full" : isHalfFilled ? "w-1/2" : "w-0"
                      } transition-all duration-150`}
                    >
                      <FaStar className="h-8 w-8 fill-avt-green text-avt-green" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelRating}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmRating}
              disabled={isSubmitting}
              className="avt-primary-button"
            >
              {isSubmitting ? "Submitting..." : "Confirm Rating"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
