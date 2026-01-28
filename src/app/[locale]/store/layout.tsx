"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  FaArrowRightFromBracket,
  FaBars,
  FaList,
  FaUser,
} from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, _hasHydrated, isStoreUser } = useAuthStore();
  const [open, setOpen] = useState(false);

  // Wait for Zustand to hydrate from localStorage before checking auth
  if (!_hasHydrated) {
    return <div>Loading…</div>;
  }

  if (!user) {
    redirect("/auth/login");
  }

  // Prevent travelers from accessing store pages
  if (!isStoreUser()) {
    toast.error("Access denied. This page is only available for store users.");
    redirect("/");
  }

  const storeSidebarLinks = [
    {
      name: "Dashboard",
      href: "/store",
      icon: <FaHome />,
    },
    {
      name: "Announcements",
      href: "/store/announcements",
      icon: <FaList />,
    },
    {
      name: "Profile",
      href: "/store/profile",
      icon: <FaUser />,
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col md:flex-row">
      {/* left sidebar for desktop */}
      <aside className="hidden w-64 shrink-0 flex-col justify-between border-r bg-zinc-50 p-4 md:flex">
        <nav className="space-y-2">
          {storeSidebarLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:border-avt-green flex items-center gap-x-2 rounded-lg border-2 border-zinc-200 bg-zinc-100 p-2"
            >
              {link.icon} {link.name}
            </Link>
          ))}
        </nav>
        <Button
          onClick={() => {
            logout();
            setOpen(false);
          }}
          className="flex items-center gap-x-2 rounded-lg bg-red-500 p-2 hover:bg-red-600"
        >
          <FaArrowRightFromBracket />
          Log out
        </Button>
      </aside>

      {/* mobile toggle + drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="m-3 md:hidden">
            <FaBars />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="flex w-64 flex-col justify-between gap-y-2 p-2 py-12"
        >
          <nav className="space-y-2">
            {storeSidebarLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:border-avt-green flex items-center gap-x-2 rounded-lg border-2 border-zinc-200 bg-zinc-100 p-2"
              >
                {link.icon} {link.name}
              </Link>
            ))}
          </nav>
          <Button
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="flex items-center gap-x-2 rounded-lg bg-red-500 p-2 hover:bg-red-600"
          >
            <FaArrowRightFromBracket />
            Log out
          </Button>
        </SheetContent>
      </Sheet>

      {/* main content */}
      <div className="w-full p-3">{children}</div>
    </div>
  );
}
