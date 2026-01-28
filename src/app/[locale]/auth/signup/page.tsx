"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TravelerSignupForm } from "../_components/TravelerSignupForm";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignupPage() {
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

  // Get the current tab for the login link
  const currentTab = searchParams.get("tab") || "agency";
  const loginHref = `/auth/login${currentTab === "traveler" ? "?tab=traveler" : ""}`;

  return (
    <div className="mx-auto max-w-lg py-10">
      <h1 className="mb-6 text-center text-3xl font-bold">Sign up</h1>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="agency">Agency</TabsTrigger>
          <TabsTrigger value="traveler">Traveler</TabsTrigger>
        </TabsList>

        {/* Traveler Sign Up */}
        <TabsContent value="traveler">
          <TravelerSignupForm />
        </TabsContent>

        {/* Agency Sign Up */}
        <TabsContent value="agency">
          <Link href="/create-store">
            <Button type="submit" className="avt-primary-button w-full">
              Create Store
            </Button>
          </Link>
        </TabsContent>
      </Tabs>
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link className="text-avt-green font-bold underline" href={loginHref}>
          Log In
        </Link>
      </div>
    </div>
  );
}
