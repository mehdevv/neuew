"use client";
import React, { useEffect, useState } from "react";
import {
  FaComment,
  FaHeart,
  FaLanguage,
  FaMap,
  FaNewspaper,
  FaPlane,
  FaRightFromBracket,
  FaUser,
} from "react-icons/fa6";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { LanguageSwitch } from "./LanguageSwitch";
import { Button } from "../ui/button";
import { SideBarNav } from "./SideBarNav";
import { useAuthStore } from "@/store/auth";
import { LoginResponse } from "@/lib/service/store-auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner";

const Navbar = () => {
  // when the user is on the map page, the navbar should be hidden
  const pathname = usePathname();
  const isMap = pathname.toLowerCase() === "/map";
  const { user } = useAuthStore();

  const navLinks = [
    {
      name: "Map",
      href: "/map",
      icon: <FaMap size={24} />,
    },
    {
      name: "Travel",
      href: "/travel",
      icon: <FaPlane size={24} />,
    },
    {
      name: "Blog",
      href: "/blog",
      icon: <FaNewspaper size={24} />,
    },
  ];

  const [isMobile, setIsMobile] = useState(false);

  // Listen to window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind md breakpoint
    };
    handleResize(); // set on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className={`bg-avt-green flex p-2 text-white ${isMap && "hidden"}`}>
      {isMobile ? (
        <MobileNavbar navLinks={navLinks} user={user} />
      ) : (
        <DesktopNavbar navLinks={navLinks} user={user} />
      )}
    </header>
  );
};

const DesktopNavbar = ({
  navLinks,
  user,
}: {
  user: LoginResponse["user"] | null;
  navLinks: {
    name: string;
    href: string;
    icon: React.ReactNode;
  }[];
}) => {
  const t = useTranslations();
  const router = useRouter();
  const { logout, isStoreUser } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <nav id="main-navbar" className="sticky flex w-screen">
      {/* desktop nav bar */}
      <div className="flex h-full w-full items-center justify-between">
        <SideBarNav />
        <Link href="/">
          <Image alt="logo" src="/images/logo.png" height={48} width={220} />
        </Link>

        {/* Right Container */}
        <ul className="flex h-full w-full items-center justify-end gap-x-2">
          {navLinks.map((link) => (
            <li
              key={link.name}
              className="flex h-full cursor-pointer items-center justify-center"
            >
              <Link
                href={link.href}
                className="flex cursor-pointer flex-col items-center justify-between rounded-lg p-2.5 hover:bg-zinc-800/80"
              >
                {link.icon}
                <span className="text-xs font-normal text-white">
                  {t(`NavBar.${link.name}`)}
                </span>
              </Link>
            </li>
          ))}

          <li className="flex h-full cursor-pointer items-center justify-center">
            <LanguageSwitch>
              <div className="relative flex cursor-pointer flex-col items-center justify-center rounded-lg p-2.5 hover:bg-zinc-800/80">
                <FaLanguage size={32} />
                <span className="text-xs font-normal text-white">
                  {t("NavBar.Language")}
                </span>
              </div>
            </LanguageSwitch>
          </li>
          {!user ? (
            <Button
              className="avt-outline-button shadow-lg"
              onClick={() => {
                router.push("/auth/login");
              }}
            >
              {t("AuthentificationPage.Login")}
            </Button>
          ) : isStoreUser() ? (
            <Button
              className="avt-outline-button h-10 w-10 cursor-pointer rounded-full p-0 shadow-lg"
              size={"icon"}
              onClick={() => {
                router.push("/store");
              }}
            >
              <Avatar className="h-full w-full">
                <AvatarImage
                  src={
                    user.profile_photo_url
                      ? user.profile_photo_url.startsWith("http")
                        ? user.profile_photo_url
                        : `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${user.profile_photo_url}`
                      : undefined
                  }
                  alt="Store Profile"
                />
                <AvatarFallback className="bg-zinc-200 text-zinc-600">
                  <FaUser size={16} />
                </AvatarFallback>
              </Avatar>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="avt-outline-button h-10 w-10 cursor-pointer rounded-full p-0 shadow-lg"
                  size={"icon"}
                >
                  <Avatar className="h-full w-full">
                    <AvatarImage
                      src={
                        user.profile_photo_url
                          ? user.profile_photo_url.startsWith("http")
                            ? user.profile_photo_url
                            : `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${user.profile_photo_url}`
                          : undefined
                      }
                      alt="Profile"
                    />
                    <AvatarFallback className="bg-zinc-200 text-zinc-600">
                      <FaUser size={16} />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/traveler/liked" className="flex items-center">
                    <FaHeart className="mr-2 h-4 w-4" />
                    Liked Posts
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/traveler/commented"
                    className="flex items-center"
                  >
                    <FaComment className="mr-2 h-4 w-4" />
                    My Comments
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  <FaRightFromBracket className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </ul>
      </div>
    </nav>
  );
};

const MobileNavbar = ({
  user,
  navLinks,
}: {
  user: LoginResponse["user"] | null;
  navLinks: { name: string; href: string; icon: React.ReactNode }[];
}) => {
  const t = useTranslations();
  const router = useRouter();
  const { logout, isStoreUser } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <nav className="flex h-full w-full flex-col gap-y-3">
      {/* Top Bar */}
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-x-2">
          <SideBarNav />
          <Link href="/">
            <Image alt="logo" src="/images/logo.png" height={48} width={220} />
          </Link>
        </div>

        <div className="flex items-center gap-x-3">
          <LanguageSwitch>
            <FaLanguage size={32} />
          </LanguageSwitch>

          {!user ? (
            <Button
              className="avt-outline-button shadow-lg"
              onClick={() => {
                router.push("/auth/login");
              }}
            >
              {t("AuthentificationPage.Login")}
            </Button>
          ) : isStoreUser() ? (
            <Button
              className="avt-outline-button h-10 w-10 rounded-full p-0 shadow-lg"
              size={"icon"}
              onClick={() => {
                router.push("/store");
              }}
            >
              <Avatar className="h-full w-full">
                <AvatarImage
                  src={
                    user.profile_photo_url
                      ? user.profile_photo_url.startsWith("http")
                        ? user.profile_photo_url
                        : `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${user.profile_photo_url}`
                      : undefined
                  }
                  alt="Store Profile"
                />
                <AvatarFallback className="bg-zinc-200 text-zinc-600">
                  <FaUser size={16} />
                </AvatarFallback>
              </Avatar>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="avt-outline-button h-10 w-10 rounded-full p-0 shadow-lg"
                  size={"icon"}
                >
                  <Avatar className="h-full w-full">
                    <AvatarImage
                      src={
                        user.profile_photo_url
                          ? user.profile_photo_url.startsWith("http")
                            ? user.profile_photo_url
                            : `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${user.profile_photo_url}`
                          : undefined
                      }
                      alt="Profile"
                    />
                    <AvatarFallback className="bg-zinc-200 text-zinc-600">
                      <FaUser size={16} />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/traveler/liked" className="flex items-center">
                    <FaHeart className="mr-2 h-4 w-4" />
                    Liked Posts
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/traveler/commented"
                    className="flex items-center"
                  >
                    <FaComment className="mr-2 h-4 w-4" />
                    My Comments
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  <FaRightFromBracket className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex w-full justify-around">
        {navLinks.map((link) => (
          <div key={link.name}>
            <Link href={link.href}>{link.icon}</Link>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
