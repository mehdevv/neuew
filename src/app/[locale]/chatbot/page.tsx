"use client";

import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TypingIndicator } from "./_components/TypingIndicator";
import { 
  FaMap, 
  FaPaperclip, 
  FaMicrophone,
  FaPaperPlane 
} from "react-icons/fa6";
import { useRouter } from "@/i18n/navigation";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const QUICK_ACTIONS = [
  "🏨 Best hotels in Algiers",
  "🐪 Camel trekking prices",
  "✈️ Flights to Oran",
];

const INITIAL_BOT_MESSAGE = "Hello! 👋 I am your virtual guide to Algeria. I can help you plan your itinerary, find the best hotels, or tell you about local customs. Ask me about the Casbah, Sahara tours, or traditional cuisine!";

export default function ChatbotPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: INITIAL_BOT_MESSAGE,
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot response (replace with actual API call)
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message! I'm here to help you explore Algeria. How can I assist you today?",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSend = () => {
    sendMessage(inputValue);
  };

  const handleQuickAction = (action: string) => {
    sendMessage(action);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`flex min-h-screen flex-col bg-white dark:bg-gray-900 text-slate-900 dark:text-slate-100 transition-opacity duration-500 ${
        isMounted ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/80 py-3 px-6 backdrop-blur-md dark:border-slate-800 dark:bg-gray-900/80">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-avt-green bg-slate-100 text-xl dark:bg-slate-800">
              🐪
            </div>
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-avt-green dark:border-slate-800"></div>
          </div>
          <div>
            <h1 className="font-bold leading-tight text-slate-800 dark:text-white">
              Algeria Travel Guide
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Online • Replies instantly
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={() => router.push("/map")}
        >
          <FaMap className="text-slate-600 dark:text-slate-400" />
        </Button>
      </header>

      {/* Main Chat Area */}
      <ScrollArea className="flex-grow hide-scrollbar-area">
        <main className="mx-6 flex w-full max-w-full flex-col gap-6 px-2 py-8">
          {/* Today Separator */}
          <div className="my-2 flex justify-center">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              Today
            </span>
          </div>

          {/* Initial Bot Message */}
          <div className="flex max-w-[85%] gap-3">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm shadow-sm dark:bg-slate-800">
                🐪
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="ml-1 text-[11px] text-slate-400 dark:text-slate-500">
                Algeria Travel Guide • {formatTime(messages[0].timestamp)}
              </span>
              <div className="rounded-xl rounded-tl-none border border-slate-100 bg-white p-4 text-sm leading-relaxed text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {messages[0].text}
              </div>
            </div>
          </div>

          {/* Messages */}
          {messages.slice(1).map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender === "user"
                  ? "ml-auto flex-col items-end"
                  : "max-w-[85%]"
              }`}
            >
              {message.sender === "user" ? (
                <>
                  <span className="mr-10 text-[11px] text-slate-400 dark:text-slate-500">
                    You • {formatTime(message.timestamp)}
                  </span>
                  <div className="flex items-end gap-3">
                    <div className="rounded-xl rounded-tr-none bg-avt-green p-4 text-sm font-medium text-white shadow-sm">
                      {message.text}
                    </div>
                    <Avatar className="h-8 w-8 flex-shrink-0 shadow-sm">
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
                      <AvatarFallback className="bg-slate-100 text-xs font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                      🐪
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="ml-1 text-[11px] text-slate-400 dark:text-slate-500">
                      Algeria Travel Guide • {formatTime(message.timestamp)}
                    </span>
                    <div className="rounded-xl rounded-tl-none border border-slate-100 bg-white p-4 text-sm leading-relaxed text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {message.text}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                  🐪
                </div>
              </div>
              <div className="flex items-center gap-1 rounded-xl rounded-tl-none border border-slate-100 bg-white px-5 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <TypingIndicator />
              </div>
            </div>
          )}

          <div className="h-32" /> {/* Spacer - 128px gap above suggestions */}
          <div ref={messagesEndRef} />
        </main>
      </ScrollArea>

      {/* Footer */}
      <footer className="bg-gradient-to-t from-white via-white to-transparent p-6 dark:from-gray-900 dark:via-gray-900">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {/* Quick Actions */}
          <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar md:flex-wrap md:justify-center md:overflow-x-visible md:pb-0">
            {QUICK_ACTIONS.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="rounded-full border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 shadow-sm shadow-black/2 transition-all hover:border-[#05C205]/80 hover:shadow-md hover:shadow-[#05C205]/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-[#05C205]/80 dark:hover:shadow-[#05C205]/30 flex-shrink-0"
                onClick={() => handleQuickAction(action)}
              >
                {action}
              </Button>
            ))}
          </div>

          {/* Input Area */}
          <div className="rounded-2xl border border-slate-100 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-800 w-full max-w-[320px] mx-auto md:max-w-none">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <FaPaperclip />
              </Button>
              <div className="relative flex flex-grow items-center">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="border-none bg-transparent py-3 text-sm text-slate-800 focus-visible:ring-0 dark:text-white"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <FaMicrophone />
                </Button>
              </div>
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="flex items-center justify-center rounded-xl bg-avt-green p-3 text-xl text-white shadow-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              >
                ✈️
              </Button>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-center text-[10px] uppercase tracking-tight text-slate-400 dark:text-slate-500">
            AI can make mistakes. Please verify important travel information.
          </p>
        </div>
      </footer>
    </div>
  );
}

