"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AuthStoreForm } from "../_components/StoreAuthForm";
import { TravelerLoginForm } from "../_components/TravelerLoginForm";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function LogInPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>("agency");

  // Read tab from URL params on mount and when params change
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "traveler" || tab === "agency") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  // Get the current tab for the signup link
  const currentTab = searchParams.get("tab") || "agency";
  const signupHref = `/auth/signup${currentTab === "traveler" ? "?tab=traveler" : ""}`;

  return (
    <div className="mx-auto max-w-lg py-10">
      <h1 className="mb-6 text-center text-3xl font-bold">Log in</h1>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="agency">Agency</TabsTrigger>
          <TabsTrigger value="traveler">Traveler</TabsTrigger>
        </TabsList>

        {/* Traveler Login */}
        <TabsContent value="traveler">
          <TravelerLoginForm />
        </TabsContent>

        {/* Agency Login */}
        <TabsContent value="agency">
          <AuthStoreForm mode="login" userType="agency" />
        </TabsContent>
      </Tabs>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link
          className="text-avt-green font-bold underline"
          href={signupHref}
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
