"use client";

import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaLinkedin,
  FaTelegram,
  FaCopy,
  FaShare,
} from "react-icons/fa6";
import { toast } from "sonner";

type ShareDrawerProps = {
  url: string;
  title: string;
};

export function ShareDrawer({ url, title }: ShareDrawerProps) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const shareText = `Check out this travel announcement: ${title}`;

  const shareOptions = [
    {
      name: "Facebook",
      icon: FaFacebook,
      color: "bg-blue-600 hover:bg-blue-700",
      onClick: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
          "_blank",
          "width=600,height=400",
        );
      },
    },
    {
      name: "Twitter",
      icon: FaTwitter,
      color: "bg-sky-500 hover:bg-sky-600",
      onClick: () => {
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`,
          "_blank",
          "width=600,height=400",
        );
      },
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      color: "bg-green-600 hover:bg-green-700",
      onClick: () => {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`,
          "_blank",
        );
      },
    },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      color: "bg-blue-700 hover:bg-blue-800",
      onClick: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
          "_blank",
          "width=600,height=400",
        );
      },
    },
    {
      name: "Telegram",
      icon: FaTelegram,
      color: "bg-blue-500 hover:bg-blue-600",
      onClick: () => {
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`,
          "_blank",
        );
      },
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="border-avt-green/30 bg-avt-green/10 text-avt-green hover:bg-avt-green/20 hover:border-avt-green/50 h-10 px-4 transition-all"
        >
          <FaShare className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-xl font-semibold text-gray-900">
            Share this announcement
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-6">
          {/* Social Media Options */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            {shareOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.name}
                  onClick={option.onClick}
                  className={`${option.color} flex h-12 w-12 items-center justify-center rounded-lg text-white transition-all hover:scale-105`}
                  title={option.name}
                >
                  <Icon className="h-5 w-5" />
                </button>
              );
            })}
          </div>

          {/* Copy Link Section */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="mb-3 text-sm font-medium text-gray-700">
              Or copy the link
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={currentUrl}
                readOnly
                className="focus:ring-avt-green/50 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:outline-none"
              />
              <Button
                onClick={handleCopyLink}
                className={`${
                  copied
                    ? "bg-avt-green text-white"
                    : "border-avt-green/30 bg-avt-green/10 text-avt-green hover:bg-avt-green/20"
                } flex items-center gap-2 transition-all`}
              >
                <FaCopy className="h-4 w-4" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
