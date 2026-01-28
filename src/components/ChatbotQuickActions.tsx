"use client";

import { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { ChatSuggestion } from "@/types/chat";

// Default suggestions with custom icons
const DEFAULT_SUGGESTIONS: ChatSuggestion[] = [
  { label: "Plan your tailor-made trip", value: "Plan your tailor-made trip", icon: "/images/chatbot/Plan.png" },
  { label: "Explore Algeria in 360°", value: "Explore Algeria in 360°", icon: "/images/chatbot/Explore.png" },
  { label: "Tourist circuits in Algeria", value: "Tourist circuits in Algeria", icon: "/images/chatbot/Tourist.png" },
  { label: "Compare Offers & Pricing", value: "Compare Offers & Pricing", icon: "/images/chatbot/Compare.png" },
];

// Check if a string starts with an emoji
const hasEmoji = (text: string): boolean => {
  return /^[\u{1F300}-\u{1F9FF}]|^[\u{2600}-\u{26FF}]|^[\u{2700}-\u{27BF}]/u.test(text);
};

// Fallback emojis (only used if LLM forgets to include one - should rarely happen)
const FALLBACK_EMOJIS = ["🏜️", "🌴", "🌊", "🏔️", "🌅", "🌍", "🐪", "🏛️", "🕌", "🌄", "🏖️", "🗺️", "🌿", "🍃"];

// Add fallback emoji only if suggestion doesn't have one (LLM should always include emojis)
const ensureEmoji = (label: string, index: number): string => {
  if (hasEmoji(label)) {
    return label; // LLM already included an emoji - use it as-is
  }
  // Fallback: add emoji if LLM forgot (shouldn't happen with updated prompt)
  const emoji = FALLBACK_EMOJIS[index % FALLBACK_EMOJIS.length];
  return `${emoji} ${label}`;
};

interface ChatbotQuickActionsProps {
  suggestions?: ChatSuggestion[];
  onActionClick: (action: string) => void;
}

export const ChatbotQuickActions = memo(function ChatbotQuickActions({
  suggestions = DEFAULT_SUGGESTIONS,
  onActionClick,
}: ChatbotQuickActionsProps) {
  const displaySuggestions = suggestions.length > 0 ? suggestions : DEFAULT_SUGGESTIONS;

  const handleClick = useCallback((text: string) => {
    onActionClick(text);
  }, [onActionClick]);

  return (
    <div className="absolute bottom-24 md:bottom-28 left-1/2 z-[60] -translate-x-1/2 w-full max-w-[600px] px-2 md:px-4">
      <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar justify-start md:justify-center md:overflow-x-visible md:pb-0 touch-pan-x">
        {displaySuggestions.map((suggestion, index) => {
          // If suggestion has an icon, use it. Otherwise, fallback to emoji logic.
          const hasIcon = !!suggestion.icon;
          const displayText = hasIcon ? suggestion.label : ensureEmoji(suggestion.label, index);

          return (
            <Button
              key={index}
              variant="outline"
              className="rounded-full border-white/20 bg-white/70 backdrop-blur-xl px-3 md:px-4 py-2 text-[11px] md:text-xs font-medium text-slate-700 shadow-sm shadow-black/2 transition-all duration-200 hover:bg-white/90 hover:border-[#05C205]/80 hover:shadow-md hover:shadow-[#05C205]/30 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/20 dark:hover:border-[#05C205]/80 dark:hover:shadow-[#05C205]/30 flex-shrink-0 whitespace-nowrap active:scale-95 will-change-transform"
              onClick={() => handleClick(suggestion.value || displayText)}
            >
              {hasIcon ? (
                <div className="flex items-center gap-2">
                  <Image
                    src={suggestion.icon!}
                    alt=""
                    width={20}
                    height={20}
                    className="w-5 h-5 object-contain"
                  />
                  <span>{suggestion.label}</span>
                </div>
              ) : (
                displayText
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
});

