import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  FaHouse,
  FaCircleInfo,
  FaEnvelope,
  // FaUserSecret,
  FaScaleBalanced,
  // FaFileContract,
  FaBars,
} from "react-icons/fa6";

export function SideBarNav() {
  const sidebarLinks = [
    { label: "Home", href: "/", icon: <FaHouse /> },
    { label: "About Us", href: "/about", icon: <FaCircleInfo /> },
    { label: "Contact", href: "/contact", icon: <FaEnvelope /> },
    // { label: "Privacy Policy", href: "/privacy", icon: <FaUserSecret /> },
    { label: "Legal Notice", href: "/legal", icon: <FaScaleBalanced /> },
    // { label: "Terms of Use", href: "/terms", icon: <FaFileContract /> },
  ];

  const t = useTranslations();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size={"icon"}
          className="flex cursor-pointer bg-transparent hover:bg-zinc-800/80 hover:text-white"
        >
          <FaBars />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="border-r-avt-green max-w-xs bg-zinc-900/95 px-3 pt-12 text-white backdrop-blur-lg"
      >
        {/* links */}
        <nav className="space-y-2">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-x-2 rounded-md px-3 py-2 font-medium text-white/90 transition hover:bg-zinc-800 hover:text-white"
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </nav>

        <SheetFooter>
          <Button
            className="avt-outline-button shadow-lg"
            onClick={() => {
              redirect("/auth/login");
            }}
          >
            {t("AuthentificationPage.Login")}
          </Button>
          <p className="text-center text-xs text-white/50">
            All rights reserved. Copyright © {new Date().getFullYear()} Algeria
            Virtual Travel.
          </p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
