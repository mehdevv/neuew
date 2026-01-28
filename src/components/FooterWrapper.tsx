"use client";

import { usePathname } from "@/i18n/navigation";
import Footer from "./Footer";

export function FooterWrapper() {
  const pathname = usePathname();

  // Hide footer on chatbot page
  if (pathname === "/chatbot") {
    return null;
  }

  return <Footer />;
}





