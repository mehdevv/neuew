"use client";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import React from "react";
import { FaPlus } from "react-icons/fa6";

export default function StorePage() {
  return (
    <div>
      <Button
        className="avt-primary-button w-full"
        onClick={() => redirect("/store/add-announcement")}
      >
        <FaPlus />
        Create Announcement
      </Button>
    </div>
  );
}
