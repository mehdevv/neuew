"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TypingIndicator } from "@/app/[locale]/chatbot/_components/TypingIndicator";
import Image from "next/image";
import type { Message, ChatPostResult } from "@/types/chat";
import { FaMapMarkerAlt, FaTag } from "react-icons/fa";
import { searchAnnouncements } from "@/lib/service/announcements";

// Post Card Component
const PostCard = ({ post, onCloseChatbot }: { post: ChatPostResult; onCloseChatbot?: () => void }) => {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || "en";

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Close chatbot first
    if (onCloseChatbot) {
      onCloseChatbot();
    }
    // Then navigate after a small delay to ensure smooth transition
    setTimeout(() => {
      router.push(`/${locale}/travel/${post.id}`);
    }, 100);
  };
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_STORAGE_URL || "";

  // Normalize photo path: remove backslashes, handle relative/absolute paths
  let imageUrl = "/images/placeholder-travel.jpg";
  if (post.photo) {
    if (post.photo.startsWith("http")) {
      // Already a full URL
      imageUrl = post.photo;
    } else {
      // Normalize path: remove backslashes
      const normalizedPath = post.photo.replace(/\\+/g, "/");

      // If path starts with /, it's already absolute - just prepend base URL
      // If path doesn't start with /, it's relative - prepend base URL with /
      if (normalizedPath.startsWith("/")) {
        imageUrl = baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
      } else {
        imageUrl = baseUrl ? `${baseUrl}/${normalizedPath}` : `/${normalizedPath}`;
      }
    }
  }

  return (
    <div
      onClick={handleClick}
      className="group flex gap-1.5 md:gap-3 rounded-lg border border-slate-100 bg-white p-1 md:p-2 transition-all hover:border-avt-green/50 hover:shadow-md active:scale-[0.98] cursor-pointer dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="relative h-10 w-10 md:h-16 md:w-16 flex-shrink-0 overflow-hidden rounded-md bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={post.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-0 overflow-hidden min-w-0">
        <h4 className="truncate text-[10px] md:text-xs font-semibold text-slate-800 dark:text-white leading-tight">
          {post.title}
        </h4>
        {post.destinations?.length > 0 && (
          <div className="flex items-center gap-0.5 text-[8px] md:text-[10px] text-slate-500">
            <FaMapMarkerAlt className="text-avt-green flex-shrink-0 text-[8px] md:text-[10px]" />
            <span className="truncate">{post.destinations.slice(0, 2).join(", ")}</span>
          </div>
        )}
        <div className="flex items-center justify-between gap-1">
          {post.category && (
            <span className="hidden md:flex items-center gap-1 text-[10px] text-slate-400">
              <FaTag />
              {post.category}
            </span>
          )}
          <span className="text-[9px] md:text-xs font-bold text-avt-green ml-auto">{post.price} DZD</span>
        </div>
      </div>
    </div>
  );
};


// Format message text with bold emphasis - inline rendering
const formatBotMessage = (message: Message): React.ReactNode => {
  const text = message.text;
  const emphasis = message.data?.content?.paragraphs?.flatMap(p => p.emphasis || []) || [];

  // If no emphasis, return plain text
  if (emphasis.length === 0) {
    return text;
  }

  // Build inline formatted text with bold emphasis
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  // Sort emphasis by length (longer first) to avoid partial matches
  const sortedEmphasis = [...emphasis].sort((a, b) => b.length - a.length);

  // Find all emphasis matches
  const matches: { start: number; end: number; text: string }[] = [];
  sortedEmphasis.forEach(emp => {
    const regex = new RegExp(emp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      // Check if this range overlaps with existing matches
      const overlaps = matches.some(m =>
        (match!.index >= m.start && match!.index < m.end) ||
        (match!.index + emp.length > m.start && match!.index + emp.length <= m.end)
      );
      if (!overlaps) {
        matches.push({ start: match.index, end: match.index + emp.length, text: match[0] });
      }
    }
  });

  // Sort matches by position
  matches.sort((a, b) => a.start - b.start);

  // Build the formatted text with unique keys including message ID
  const messageId = message.id || 'msg';
  matches.forEach((match, mIndex) => {
    if (match.start > lastIndex) {
      parts.push(<span key={`${messageId}-text-${mIndex}`}>{text.slice(lastIndex, match.start)}</span>);
    }
    parts.push(
      <strong key={`${messageId}-bold-${mIndex}`} className="font-semibold text-avt-green">
        {match.text}
      </strong>
    );
    lastIndex = match.end;
  });

  if (lastIndex < text.length) {
    parts.push(<span key={`${messageId}-text-end`}>{text.slice(lastIndex)}</span>);
  }

  return <>{parts}</>;
};

interface ChatbotMessagesBoxProps {
  messages: Message[];
  isTyping: boolean;
  onCloseChatbot?: () => void;
}

export function ChatbotMessagesBox({
  messages,
  isTyping,
  onCloseChatbot,
}: ChatbotMessagesBoxProps) {
  const { user } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // The spacer div (h-48) before messagesEndRef provides the bottom gap
      // Simply scroll the ref into view - the spacer ensures gap is visible
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return "U";
  };

  const INITIAL_BOT_MESSAGE =
    "Hello! 👋 I am your virtual guide to Algeria. I can help you plan your itinerary, find the best hotels, or tell you about local customs. Ask me about the Casbah, Sahara tours, or traditional cuisine!";

  // Fetch real results from database using keywords: "travel", "voyage", "السياحة"
  const [mockPosts, setMockPosts] = useState<ChatPostResult[]>([]);
  const [isLoadingMock, setIsLoadingMock] = useState(true);

  useEffect(() => {
    const fetchMockPosts = async () => {
      try {
        setIsLoadingMock(true);

        // Search for the three keywords in parallel
        const searchKeywords = ["travel", "voyage", "السياحة"];
        const searchPromises = searchKeywords.map(keyword =>
          searchAnnouncements({ query: keyword }).catch((error) => {
            console.warn(`Failed to search for "${keyword}":`, error);
            return []; // Return empty array on error
          })
        );

        const allResults = await Promise.all(searchPromises);

        // Combine all results and remove duplicates by ID
        const combinedResults = allResults.flat();
        const uniqueResults = Array.from(
          new Map(combinedResults.map((item) => [item.id, item])).values()
        );

        // Convert to ChatPostResult format and limit to 3
        const formattedResults: ChatPostResult[] = uniqueResults.slice(0, 3).map((a) => ({
          id: a.id,
          title: a.titre,
          destinations: a.destination,
          description: a.description?.slice(0, 150) + (a.description?.length > 150 ? "..." : ""),
          price: a.prix,
          photo: a.photos?.[0] || null,
          category: a.category?.name || null,
          subcategory: a.subcategory?.name || null,
          agency: a.store?.denomination || null,
        }));

        setMockPosts(formattedResults);
      } catch (error) {
        console.error("Error fetching mock posts:", error);
        setMockPosts([]);
      } finally {
        setIsLoadingMock(false);
      }
    };

    fetchMockPosts();
  }, []);

  const SHOW_MOCK_DATA = true; // Set to false to hide mock data

  return (
    <div className="flex min-h-full touch-pan-y overflow-x-hidden">
      <div className="mx-4 flex w-full max-w-full flex-col gap-2 md:gap-6 px-1 py-3 md:py-8 overflow-x-hidden">
        {/* Today Separator */}
        <div className="my-1 md:my-2 flex justify-center">
          <span className="rounded-full bg-slate-100 px-2 md:px-3 py-0.5 md:py-1 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:bg-slate-800 dark:text-slate-500">
            Today
          </span>
        </div>

        {/* Initial Bot Message */}
        {messages.length > 0 && (
          <div className="flex w-full items-start gap-2 md:gap-3">
            <div className="flex-shrink-0">
              <div className="relative flex h-6 w-6 md:h-8 md:w-8 items-center justify-center overflow-hidden rounded-full bg-slate-100 shadow-sm dark:bg-slate-800">
                <Image
                  src="/images/chatbot/chatbot-icon.png"
                  alt="Chatbot"
                  width={24}
                  height={24}
                  className="md:w-8 md:h-8 object-cover"
                />
              </div>
            </div>
            <div className="flex max-w-[70%] md:max-w-[70%] flex-col gap-1 md:gap-2">
              <span className="ml-1 text-[9px] md:text-[11px] text-slate-400 dark:text-slate-500">
                Algeria Travel Guide • {formatTime(messages[0].timestamp)}
              </span>
              <div className="rounded-xl rounded-tl-none border border-slate-100 bg-white p-2 md:p-4 text-[12px] md:text-sm leading-tight md:leading-relaxed text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 break-words">
                {formatBotMessage(messages[0])}
              </div>

              {/* TEMPORARY: Mock Posts Preview - REMOVE LATER */}
              {SHOW_MOCK_DATA && (
                <div className="flex flex-col gap-1 md:gap-2 mt-1">
                  <span className="ml-1 text-[8px] md:text-[10px] font-semibold uppercase tracking-wider text-avt-green">
                    🎯 Matching Travel Offers
                  </span>
                  {isLoadingMock ? (
                    <div className="text-[10px] md:text-[11px] text-slate-500 dark:text-slate-400 p-1.5 md:p-2">
                      Loading offers...
                    </div>
                  ) : mockPosts.length > 0 ? (
                    <div className="flex flex-col gap-1 md:gap-2">
                      {mockPosts.map((post) => (
                        <PostCard key={post.id} post={post} onCloseChatbot={onCloseChatbot} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-[10px] md:text-[11px] text-slate-500 dark:text-slate-400 p-1.5 md:p-2">
                      No offers found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.slice(1).map((message) => (
          <div
            key={message.id}
            className={`flex w-full min-w-0 gap-2 md:gap-3 ${message.sender === "user"
              ? "flex-row-reverse items-start "
              : "items-start justify-start"
              }`}
          >
            {message.sender === "user" ? (
              <>
                <Avatar className="h-6 w-6 md:h-8 md:w-8 flex-shrink-0 shadow-sm">
                  {user?.profile_photo_url ? (
                    <AvatarImage
                      src={
                        user.profile_photo_url.startsWith("http")
                          ? user.profile_photo_url
                          : `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${user.profile_photo_url}`
                      }
                      alt={user.name || "User"}
                    />
                  ) : null}
                  <AvatarFallback className="bg-slate-100 text-[10px] md:text-xs font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex max-w-[70%] md:max-w-[70%] min-w-0 flex-col items-end gap-0.5 md:gap-1 flex-shrink">
                  <span className="mr-1 text-[9px] md:text-[11px] text-slate-400 dark:text-slate-500">
                    You • {formatTime(message.timestamp)}
                  </span>
                  <div className="rounded-xl rounded-tr-none bg-avt-green p-2 md:p-4 text-[12px] md:text-sm font-medium text-white shadow-sm break-words break-all leading-tight md:leading-normal max-w-full overflow-wrap-anywhere">
                    {message.text}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex-shrink-0">
                  <div className="relative flex h-6 w-6 md:h-8 md:w-8 items-center justify-center overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <Image
                      src="/images/chatbot/chatbot-icon.png"
                      alt="Chatbot"
                      width={24}
                      height={24}
                      className="md:w-8 md:h-8 object-cover"
                    />
                  </div>
                </div>
                <div className="flex max-w-[70%] md:max-w-[70%] flex-col gap-1 md:gap-2">
                  <span className="ml-1 text-[9px] md:text-[11px] text-slate-400 dark:text-slate-500">
                    Algeria Travel Guide • {formatTime(message.timestamp)}
                  </span>
                  <div className="rounded-xl rounded-tl-none border border-slate-100 bg-white p-2 md:p-4 text-[12px] md:text-sm leading-tight md:leading-relaxed text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 break-words">
                    {formatBotMessage(message)}
                  </div>

                  {/* Travel Deals - Only show when there are actual results */}
                  {message.data?.posts?.enabled && message.data.posts.results.length > 0 && (
                    <div className="flex flex-col gap-1 md:gap-2 mt-1 md:mt-2">
                      <span className="ml-1 text-[8px] md:text-[10px] font-semibold uppercase tracking-wider text-avt-green">
                        🎯 Matching Travel Offers
                      </span>
                      <div className="flex flex-col gap-1 md:gap-2">
                        {message.data.posts.results.map((post) => (
                          <PostCard key={post.id} post={post} onCloseChatbot={onCloseChatbot} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex w-full items-start justify-start gap-3">
            <div className="flex-shrink-0">
              <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <Image
                  src="/images/chatbot/chatbot-icon.png"
                  alt="Chatbot"
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-xl rounded-tl-none border border-slate-100 bg-white px-5 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <TypingIndicator />
            </div>
          </div>
        )}

        <div className="h-32" /> {/* Spacer - 128px gap above suggestions */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

