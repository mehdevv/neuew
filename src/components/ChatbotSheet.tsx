"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaDoorOpen } from "react-icons/fa6";
import { FaCircleInfo } from "react-icons/fa6";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { ChatbotQuickActions } from "./ChatbotQuickActions";
import { ChatbotInputBar } from "./ChatbotInputBar";
import { ChatbotMessagesBox } from "./ChatbotMessagesBox";
import type { Message, ChatResponse, ChatSuggestion } from "@/types/chat";
import { searchAnnouncements } from "@/lib/service/announcements";

// Generate search variants - single words only, extracts both location and activity keywords
function generateSearchVariants(baseQuery: string): string[] {
  const variants: string[] = [];
  const queryLower = baseQuery.toLowerCase().trim();

  // Location keywords map
  const locationMap: Record<string, { en: string[], fr: string[], ar: string[] }> = {
    "tunisia": { en: ["Tunisia"], fr: ["Tunisie"], ar: ["تونس"] },
    "tunisian": { en: ["Tunisia"], fr: ["Tunisie"], ar: ["تونس"] },
    "algeria": { en: ["Algeria"], fr: ["Algérie"], ar: ["الجزائر"] },
    "algerian": { en: ["Algeria"], fr: ["Algérie"], ar: ["الجزائر"] },
    "morocco": { en: ["Morocco"], fr: ["Maroc"], ar: ["المغرب"] },
    "moroccan": { en: ["Morocco"], fr: ["Maroc"], ar: ["المغرب"] },
    "egypt": { en: ["Egypt"], fr: ["Égypte"], ar: ["مصر"] },
    "egyptian": { en: ["Egypt"], fr: ["Égypte"], ar: ["مصر"] },
    "france": { en: ["France"], fr: ["France"], ar: ["فرنسا"] },
    "french": { en: ["France"], fr: ["France"], ar: ["فرنسا"] },
  };

  // Activity/place keywords map
  const activityMap: Record<string, { en: string[], fr: string[], ar: string[] }> = {
    "beach": { en: ["beach", "seaside"], fr: ["plage", "littoral"], ar: ["شاطئ", "ساحل"] },
    "beaches": { en: ["beach", "seaside"], fr: ["plage", "littoral"], ar: ["شاطئ", "ساحل"] },
    "seaside": { en: ["seaside", "beach"], fr: ["littoral", "plage"], ar: ["ساحل", "شاطئ"] },
    "coast": { en: ["coast", "coastal"], fr: ["côte", "littoral"], ar: ["ساحل"] },
    "coastal": { en: ["coastal", "coast"], fr: ["côtier", "littoral"], ar: ["ساحلي"] },
    "desert": { en: ["desert", "Sahara"], fr: ["désert", "Sahara"], ar: ["صحراء"] },
    "sahara": { en: ["Sahara", "desert"], fr: ["Sahara", "désert"], ar: ["صحراء"] },
    "hotel": { en: ["hotel"], fr: ["hôtel"], ar: ["فندق"] },
    "hotels": { en: ["hotel"], fr: ["hôtel"], ar: ["فندق"] },
    "mountain": { en: ["mountain"], fr: ["montagne"], ar: ["جبل"] },
    "mountains": { en: ["mountain"], fr: ["montagne"], ar: ["جبل"] },
    "hiking": { en: ["hiking"], fr: ["randonnée"], ar: ["مشي"] },
    "sport": { en: ["sport"], fr: ["sport"], ar: ["رياضة"] },
    "sports": { en: ["sport"], fr: ["sport"], ar: ["رياضة"] },
    "water": { en: ["water"], fr: ["eau"], ar: ["ماء"] },
    "adventure": { en: ["adventure"], fr: ["aventure"], ar: ["مغامرة"] },
    "tour": { en: ["tour"], fr: ["circuit"], ar: ["جولة"] },
    "trip": { en: ["trip"], fr: ["voyage"], ar: ["رحلة"] },
  };

  // Extract location keywords from query
  const foundLocations: string[] = [];
  for (const [key, translations] of Object.entries(locationMap)) {
    if (queryLower.includes(key)) {
      foundLocations.push(...translations.en, ...translations.fr, ...translations.ar);
    }
  }

  // Extract activity/place keywords from query
  const foundActivities: string[] = [];
  for (const [key, translations] of Object.entries(activityMap)) {
    if (queryLower.includes(key)) {
      foundActivities.push(...translations.en, ...translations.fr, ...translations.ar);
    }
  }

  // If we found both location and activity keywords, combine them
  if (foundLocations.length > 0 && foundActivities.length > 0) {
    // Add location keywords first (1-2)
    foundLocations.slice(0, 2).forEach(loc => {
      if (!variants.includes(loc)) variants.push(loc);
    });
    // Add activity keywords (2-3)
    foundActivities.slice(0, 3).forEach(act => {
      if (!variants.includes(act)) variants.push(act);
    });
  }
  // If only location found, add location keywords
  else if (foundLocations.length > 0) {
    foundLocations.slice(0, 5).forEach(loc => {
      if (!variants.includes(loc)) variants.push(loc);
    });
  }
  // If only activity found, add activity keywords
  else if (foundActivities.length > 0) {
    foundActivities.slice(0, 5).forEach(act => {
      if (!variants.includes(act)) variants.push(act);
    });
  }
  // Fallback: use first word from query
  else {
    const firstWord = queryLower.split(" ")[0] || queryLower;
    variants.push(firstWord);
  }

  // Remove duplicates and limit to 5 variants
  const uniqueVariants = Array.from(new Set(variants));
  return uniqueVariants.slice(0, 5);
}



interface ChatbotSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatbotSheet({ open, onOpenChange }: ChatbotSheetProps) {
  const tLegal = useTranslations("ChatbotLegal");
  const t = useTranslations("Chatbot");
  const locale = useLocale();

  const INITIAL_BOT_MESSAGE = useMemo(() => t("initialMessage"), [t]);
  const DEFAULT_SUGGESTIONS: ChatSuggestion[] = useMemo(() => [
    { label: t("suggestions.planTrip"), value: t("suggestions.planTrip"), icon: "/images/chatbot/Plan.png" },
    { label: t("suggestions.explore360"), value: t("suggestions.explore360"), icon: "/images/chatbot/Explore.png" },
    { label: t("suggestions.touristCircuits"), value: t("suggestions.touristCircuits"), icon: "/images/chatbot/Tourist.png" },
    { label: t("suggestions.compareOffers"), value: t("suggestions.compareOffers"), icon: "/images/chatbot/Compare.png" },
  ], [t]);

  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: "1",
      text: t("initialMessage"),
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false); // Prevent concurrent requests
  const [messageCount, setMessageCount] = useState(0);
  const [suggestions, setSuggestions] = useState<ChatSuggestion[]>(() => [
    { label: t("suggestions.planTrip"), value: t("suggestions.planTrip"), icon: "/images/chatbot/Plan.png" },
    { label: t("suggestions.explore360"), value: t("suggestions.explore360"), icon: "/images/chatbot/Explore.png" },
    { label: t("suggestions.touristCircuits"), value: t("suggestions.touristCircuits"), icon: "/images/chatbot/Tourist.png" },
    { label: t("suggestions.compareOffers"), value: t("suggestions.compareOffers"), icon: "/images/chatbot/Compare.png" },
  ]);
  const [showLegalDialog, setShowLegalDialog] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Rate limiting: Check and update daily message count
  useEffect(() => {
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('chatbot_daily_limit');

    if (storedData) {
      const { date, count } = JSON.parse(storedData);
      if (date === today) {
        setMessageCount(count);
      } else {
        // New day, reset counter
        localStorage.setItem('chatbot_daily_limit', JSON.stringify({ date: today, count: 0 }));
        setMessageCount(0);
      }
    } else {
      localStorage.setItem('chatbot_daily_limit', JSON.stringify({ date: today, count: 0 }));
      setMessageCount(0);
    }
  }, []);

  // Load conversation from sessionStorage on mount
  useEffect(() => {
    const savedConversation = sessionStorage.getItem('chatbot_conversation');
    if (savedConversation) {
      try {
        const { messages: savedMessages, suggestions: savedSuggestions } = JSON.parse(savedConversation);
        if (savedMessages && savedMessages.length > 0) {
          // Convert timestamp strings back to Date objects
          const messagesWithDates = savedMessages.map((msg: Message) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(messagesWithDates);
        }
        if (savedSuggestions && savedSuggestions.length > 0) {
          setSuggestions(savedSuggestions);
        }
      } catch (error) {
        console.error('Error loading saved conversation:', error);
        // Clear corrupted data
        sessionStorage.removeItem('chatbot_conversation');
      }
    }
  }, []);

  // Save conversation to sessionStorage whenever messages or suggestions change
  useEffect(() => {
    if (messages.length > 1) { // Only save if there's more than just the initial message
      sessionStorage.setItem('chatbot_conversation', JSON.stringify({
        messages,
        suggestions
      }));
    }
  }, [messages, suggestions]);

  useEffect(() => {
    if (open) {
      // Focus input when opened
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      // Don't reset conversation - it's preserved in sessionStorage
      // Conversation will persist until page refresh
    }
  }, [open]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Check if already sending a message
    if (isSending) {
      console.log("⚠️ Already sending a message, please wait...");
      return;
    }

    // Check daily limit (50 messages per day)
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('chatbot_daily_limit');
    let currentCount = 0;

    if (storedData) {
      const { date, count } = JSON.parse(storedData);
      if (date === today) {
        currentCount = count;
        if (currentCount >= 50) {
          // Show limit reached message
          const limitMessage: Message = {
            id: Date.now().toString(),
            text: t("rateLimitReached"),
            sender: "bot",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, limitMessage]);
          return;
        }
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    setIsSending(true); // Mark as sending

    try {
      // Get message history for context (last 10 messages)
      const history = messages.slice(-10).map((msg) => ({
        text: msg.text,
        sender: msg.sender,
      }));

      console.log("🤖 Sending message to chat API:", text.trim());

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text.trim(),
          locale: locale // Pass the current locale to the API
        }),
      });

      const result = await response.json();

      // Update message count after successful response
      const newCount = currentCount + 1;
      localStorage.setItem('chatbot_daily_limit', JSON.stringify({ date: today, count: newCount }));
      setMessageCount(newCount);

      if (result.success && result.data) {
        const chatData: ChatResponse = result.data;

        console.log("✅ Chat API response received");
        console.log("📋 Filters extracted:", chatData.filters);

        // Check if LLM detected need for posts (filters.enabled === true)
        const shouldFetchPosts = chatData.filters?.enabled === true;
        console.log("🤖 LLM detected posts needed:", shouldFetchPosts ? "YES ✅" : "NO ❌");

        // If LLM detected need for posts, fetch travel deals from backend
        if (shouldFetchPosts) {
          console.log("🎯 Posts toggle is ON - Fetching travel deals from backend...");
          try {
            const filterParams = chatData.filters?.params || {};
            const searchQuery = filterParams.query || filterParams.destination || text.trim();

            console.log("\n═══════════════════════════════════════════════════════════");
            console.log("🔍 SEARCH PARAMETERS EXTRACTED BY LLM");
            console.log("═══════════════════════════════════════════════════════════");
            console.log("📝 User Query:", text.trim());
            console.log("🔑 Search Query:", searchQuery);
            console.log("📍 Destination:", filterParams.destination || "(none)");
            console.log("💰 Price Range:",
              filterParams.prix_start ? `${filterParams.prix_start} DZD` : "any",
              "-",
              filterParams.prix_end ? `${filterParams.prix_end} DZD` : "any"
            );
            console.log("📅 Date Range:",
              filterParams.date_start || "any",
              "-",
              filterParams.date_end || "any"
            );
            console.log("ℹ️  Note: Category and subcategory are not used in search");
            console.log("═══════════════════════════════════════════════════════════\n");

            // Build search parameters - Always skip category/subcategory
            const searchParams: {
              query: string;
              prix_start?: string | null;
              prix_end?: string | null;
              date_start?: string | null;
              date_end?: string | null;
            } = {
              query: searchQuery,
            };

            // Note: Category and subcategory are always skipped to avoid validation errors

            // Add price/date filters if they exist
            if (filterParams.prix_start) searchParams.prix_start = filterParams.prix_start;
            if (filterParams.prix_end) searchParams.prix_end = filterParams.prix_end;
            if (filterParams.date_start) searchParams.date_start = filterParams.date_start;
            if (filterParams.date_end) searchParams.date_end = filterParams.date_end;

            // Get LLM-generated search keywords (5 semantically similar keywords)
            const llmKeywords = chatData.filters?.search_keywords || [];

            // Use LLM keywords if available, otherwise fallback to generated variants
            let searchKeywords: string[];
            if (llmKeywords.length >= 5) {
              searchKeywords = llmKeywords.slice(0, 5);
              console.log("\n🤖 LLM-generated search keywords (5 semantically similar):");
              searchKeywords.forEach((keyword, index) => {
                console.log(`  ${index + 1}. "${keyword}"`);
              });
              console.log("");
            } else {
              // Fallback: generate variants if LLM didn't provide keywords
              console.log("⚠️ LLM didn't provide search_keywords, using fallback variants...");
              const searchVariants = generateSearchVariants(searchQuery);
              searchKeywords = searchVariants.slice(0, 5);
              console.log("\n🌍 Generated fallback variants (5):");
              searchKeywords.forEach((keyword, index) => {
                console.log(`  ${index + 1}. "${keyword}"`);
              });
              console.log("");
            }

            // Search for all keywords in parallel
            console.log("🔍 Searching all keywords...");
            const searchPromises = searchKeywords.map((keyword, index) => {
              const keywordParams = {
                ...searchParams,
                query: keyword,
              };
              return searchAnnouncements(keywordParams).catch((error) => {
                console.warn(`  ⚠️ Keyword ${index + 1} ("${keyword}") failed:`, error.message);
                return []; // Return empty array on error
              });
            });

            const allResults = await Promise.all(searchPromises);

            // Combine all results and remove duplicates by ID
            const combinedResults = allResults.flat();
            const uniqueResults = Array.from(
              new Map(combinedResults.map((item) => [item.id, item])).values()
            );

            console.log(`\n📊 Search Summary:`);
            console.log(`  - Total keywords searched: ${searchKeywords.length}`);
            console.log(`  - Total results found: ${combinedResults.length}`);
            console.log(`  - Unique results (after deduplication): ${uniqueResults.length}`);

            // Limit to 5 results max
            const announcements = uniqueResults.slice(0, 5);

            console.log("\n═══════════════════════════════════════════════════════════");
            console.log(`✅ FINAL RESULTS: ${announcements.length} unique travel deal(s) (max 5 shown)`);
            console.log("═══════════════════════════════════════════════════════════");
            if (announcements.length > 0) {
              announcements.forEach((a, index) => {
                console.log(`${index + 1}. ${a.titre}`);
                console.log(`   💰 Price: ${a.prix} DZD`);
                console.log(`   📍 Destination: ${a.destination?.join(", ") || "N/A"}`);
                console.log(`   🏷️  Category: ${a.category?.name || "N/A"}`);
                console.log("");
              });
            } else {
              console.log("No travel deals matched the search criteria.\n");
            }
            console.log("═══════════════════════════════════════════════════════════\n");

            // Attach posts data to the chat response (already limited to 5)
            chatData.posts = {
              enabled: true,
              results: announcements.map((a) => ({
                id: a.id,
                title: a.titre,
                destinations: a.destination,
                description: a.description?.slice(0, 150) + (a.description?.length > 150 ? "..." : ""),
                price: a.prix,
                photo: a.photos?.[0] || null,
                category: a.category?.name || null,
                subcategory: a.subcategory?.name || null,
                agency: a.store?.denomination || null,
              })),
            };

            // If no results found, enhance the response with clarifying questions
            if (announcements.length === 0) {
              console.log("⚠️ No results found - Adding clarifying questions to help refine search");

              // Generate context-aware clarifying questions based on search
              const searchQuery = filterParams.query || filterParams.destination || text.trim();
              const hasDestination = filterParams.destination || (filterParams.destinations && filterParams.destinations.length > 0);
              const hasBudget = filterParams.prix_start || filterParams.prix_end;
              const hasDates = filterParams.date_start || filterParams.date_end;

              const clarifyingQuestions = [];

              if (!hasDestination) {
                clarifyingQuestions.push("What destination are you interested in? (e.g., a specific city, country, or region)");
              }
              if (!hasBudget) {
                clarifyingQuestions.push("What's your budget range for this trip?");
              }
              if (!hasDates) {
                clarifyingQuestions.push("When are you planning to travel? (specific dates or month)");
              }
              if (clarifyingQuestions.length === 0) {
                clarifyingQuestions.push("What type of experience are you looking for? (adventure, relaxation, cultural, etc.)");
                clarifyingQuestions.push("Are you flexible with your travel dates or destination?");
              }

              // Add clarifying questions to the response
              const clarifyingText = `I couldn't find any travel deals matching your search. To help me find the perfect options for you, could you provide more details?\n\n${clarifyingQuestions.slice(0, 2).map((q, i) => `${i + 1}. ${q}`).join("\n")}`;

              chatData.content.paragraphs.push({
                text: clarifyingText,
                emphasis: clarifyingQuestions.slice(0, 2),
              });

              // Update follow-up question
              if (clarifyingQuestions.length > 0) {
                chatData.content.follow_up_question = clarifyingQuestions[0];
              }

              console.log("✅ Clarifying questions added to response");
            }

            console.log("✅ Posts data attached to bot message");
          } catch (error) {
            console.error("❌ Error fetching travel deals:", error);
            // Still show the message, but with empty posts
            chatData.posts = {
              enabled: true,
              results: [],
            };
          }
        } else {
          console.log("❌ LLM did not detect need for posts - Skipping travel deals fetch");
          // Ensure posts is disabled
          if (!chatData.posts) {
            chatData.posts = {
              enabled: false,
              results: [],
            };
          }
        }

        // Build response text from paragraphs
        const responseText = chatData.content.paragraphs
          .map((p) => p.text)
          .join("\n\n")
          + (chatData.content.follow_up_question
            ? `\n\n${chatData.content.follow_up_question}`
            : "");

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: responseText,
          sender: "bot",
          timestamp: new Date(),
          data: chatData,
        };

        setMessages((prev) => [...prev, botMessage]);

        // Update suggestions if available
        if (chatData.suggestions && chatData.suggestions.length > 0) {
          setSuggestions(chatData.suggestions);
        }
      } else {
        // Fallback error message
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or feel free to explore our website directly.",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
      setIsSending(false); // Reset sending state to allow new messages
    }
  };

  const handleSend = () => {
    sendMessage(inputValue);
  };

  const handleQuickAction = (action: string) => {
    sendMessage(action);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="flex h-screen w-full max-w-full flex-col p-0 [&>button]:hidden"
      >
        <div className="relative flex h-full flex-col bg-white dark:bg-gray-900">
          {/* Header */}
          <SheetHeader className="border-b border-slate-200 px-6 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] dark:border-slate-800">

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-avt-green bg-slate-100 dark:bg-slate-800">
                    <Image
                      src="/images/chatbot/chatbot-icon.png"
                      alt="Chatbot"
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-avt-green dark:border-slate-800"></div>
                </div>
                <div>
                  <SheetTitle className="font-bold leading-tight text-slate-800 dark:text-white">
                    Algeria Travel Guide
                  </SheetTitle>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t("online")} • {t("repliesInstantly")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-slate-600 transition-colors hover:text-avt-green dark:text-slate-400 dark:hover:text-avt-green"
                  onClick={() => setShowLegalDialog(true)}
                >
                  <FaCircleInfo className="text-xl" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-slate-600 transition-colors hover:text-red-500 dark:text-slate-400 dark:hover:text-red-500"
                  onClick={() => onOpenChange(false)}
                >
                  <FaDoorOpen className="text-xl" />
                </Button>
              </div>
            </div>
          </SheetHeader>

          {/* Main Chat Area */}
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            <ChatbotMessagesBox
              messages={messages}
              isTyping={isTyping}
              onCloseChatbot={() => onOpenChange(false)}
            />
          </div>

          {/* Floating Quick Actions and Input Bar */}
          <ChatbotQuickActions
            suggestions={suggestions}
            onActionClick={handleQuickAction}
          />
          <ChatbotInputBar
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSend={handleSend}
            inputRef={inputRef}
          />
        </div>
      </SheetContent>

      {/* Legal Terms Dialog */}
      <Dialog open={showLegalDialog} onOpenChange={setShowLegalDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-800 dark:text-white">
              {tLegal("title")}
            </DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400">
              {tLegal("description")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
            <section>
              <h3 className="font-semibold text-base mb-2 text-slate-800 dark:text-white">{tLegal("sections.acceptance.title")}</h3>
              <p>
                {tLegal("sections.acceptance.content")}
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2 text-slate-800 dark:text-white">{tLegal("sections.service.title")}</h3>
              <p>
                {tLegal("sections.service.content")}
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2 text-slate-800 dark:text-white">{tLegal("sections.accuracy.title")}</h3>
              <p>
                {tLegal("sections.accuracy.content")}
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2 text-slate-800 dark:text-white">{tLegal("sections.guarantee.title")}</h3>
              <p>
                {tLegal("sections.guarantee.content")}
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2 text-slate-800 dark:text-white">{tLegal("sections.responsibilities.title")}</h3>
              <p>
                {tLegal("sections.responsibilities.content")}
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                {tLegal.raw("sections.responsibilities.items").map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2 text-slate-800 dark:text-white">{tLegal("sections.privacy.title")}</h3>
              <p>
                {tLegal("sections.privacy.content")}
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2 text-slate-800 dark:text-white">{tLegal("sections.liability.title")}</h3>
              <p>
                {tLegal("sections.liability.content")}
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2 text-slate-800 dark:text-white">{tLegal("sections.thirdParty.title")}</h3>
              <p>
                {tLegal("sections.thirdParty.content")}
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2 text-slate-800 dark:text-white">{tLegal("sections.modifications.title")}</h3>
              <p>
                {tLegal("sections.modifications.content")}
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2 text-slate-800 dark:text-white">{tLegal("sections.contact.title")}</h3>
              <p>
                {tLegal("sections.contact.content")}
              </p>
            </section>

            <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {tLegal("footer.lastUpdated")}<br />
                {tLegal("footer.copyright")}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}

