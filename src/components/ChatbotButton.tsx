"use client";

import { usePathname } from "@/i18n/navigation";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ChatbotSheet } from "./ChatbotSheet";

export function ChatbotButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Pages where chatbot should NOT be shown
  const shouldHide = useMemo(() => {
    const normalizedPath = pathname.toLowerCase();
    
    // Hide on map page
    if (normalizedPath === "/map") return true;
    
    // Hide on store/admin pages
    if (normalizedPath.startsWith("/store")) return true;
    
    // Hide on auth pages
    if (normalizedPath.startsWith("/auth")) return true;
    
    return false;
  }, [pathname]);

  if (shouldHide) {
    return null;
  }

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="fixed bottom-12 right-12 z-50 transition-transform hover:scale-110 animate-float"
        aria-label="Open chatbot"
      >
        <Image
          src="/images/chatbot/chatbot-icon.png"
          alt="Chatbot"
          width={96}
          height={96}
          className="object-cover"
        />
      </button>
      <ChatbotSheet open={open} onOpenChange={setOpen} />
    </>
  );
}

