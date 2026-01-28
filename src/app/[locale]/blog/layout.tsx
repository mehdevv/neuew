"use client";

import { useBlogs } from "@/hooks/useBlogs";
import { useBlogStore } from "@/store/blog";
import { useEffect } from "react";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading, error } = useBlogs();
  const { setBlogs } = useBlogStore();

  // Sync React Query → Zustand
  useEffect(() => {
    if (data) setBlogs(data);
  }, [data, setBlogs]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load blogs</p>;

  return <div>{children}</div>;
}
