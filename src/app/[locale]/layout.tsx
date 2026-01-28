import "@/styles/globals.css";

import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";
import { getMessages } from "next-intl/server";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import { CookieConsentDialog } from "@/components/CookieConsentDialog";
import { ChatbotButton } from "@/components/ChatbotButton";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const ExpoArabic = localFont({
  src: [
    {
      path: "../../../public/fonts/ExpoArabic/Expo-Arabic-Light.ttf",
      weight: "300",
    },
    {
      path: "../../../public/fonts/ExpoArabic/Expo-Arabic-Book.ttf",
      weight: "400",
    },
    {
      path: "../../../public/fonts/ExpoArabic/Expo-Arabic-Medium.ttf",
      weight: "500",
    },
    {
      path: "../../../public/fonts/ExpoArabic/Expo-Arabic-Bold.ttf",
      weight: "700",
    },
  ],
});

export const metadata: Metadata = {
  title: "Algeria Virtual Travel",
  description:
    "Algeria virtual travel is a platform that connects travelers with local hosts and guides.",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${montserrat.variable} ${locale === "ar" ? ExpoArabic.className : ""} `}
    >
      <head>
        {/* google site verification */}
        <meta
          name="google-site-verification"
          content="yAIvLItoyYvEOurSbCj6AUQCwUL8VarvKWQ1ZLtbmwc"
        />
        {/* google ads tag */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5968788068135165"
          crossOrigin="anonymous"
        ></script>
      </head>

      <body className="flex min-h-screen w-full flex-col antialiased">
        <Providers locale={locale} messages={messages}>
          <Navbar />
          <main className="grow">{children}</main>
          <Footer />
          <ChatbotButton />
          <Toaster />
          <CookieConsentDialog />
        </Providers>
      </body>
    </html>
  );
}
