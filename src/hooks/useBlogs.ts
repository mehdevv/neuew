import { useQuery } from "@tanstack/react-query";

const fetchBlogs = async () => {
  const res = await fetch("/api/blogs");
  if (!res.ok) {
    throw new Error("Failed to fetch blogs");
  }
  return res.json();
};

export function useBlogs() {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      return await fetchBlogs();
    },
    staleTime: 1000 * 60 * 60, // 1h cache
  });
}
