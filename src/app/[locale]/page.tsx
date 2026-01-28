"use client";
import { SocialSideButton } from "./_components/SocialSideButton";
import { Hero } from "./_components/Hero";
import { Section2 } from "./_components/Section2";
import { Section3 } from "./_components/Section3";
import { Section4 } from "./_components/Section4";
import { Section5 } from "./_components/Section5";
import ContactUsSection from "./_components/ContactUsSection";
import NewsLetterSection from "./_components/NewsLetterSection";

export default function Home() {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <SocialSideButton />
      <Hero />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <ContactUsSection />
      <NewsLetterSection />
    </div>
  );
}
