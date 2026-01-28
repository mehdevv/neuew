"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useBlogStore } from "@/store/blog";
import Image from "next/image";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BlogListPage() {
  const { blogs } = useBlogStore();

  return (
    <div className="px-3 py-6">
      <h1 className="mb-6 text-2xl font-bold">Blogs</h1>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <Card
            key={blog.id}
            className="overflow-hidden rounded-2xl p-0 shadow-sm transition hover:shadow-md"
          >
            {blog.featuredImage && (
              <Image
                width={480}
                height={270}
                src={blog.featuredImage}
                alt={blog.featuredImageAltText || blog.name}
                className="h-48 w-full object-cover"
              />
            )}
            <CardHeader>
              <h2 className="line-clamp-2 text-lg font-semibold">
                {blog.name}
              </h2>
              <p className="text-muted-foreground text-sm">
                {blog.authorName} ·{" "}
                {format(new Date(blog.publishDate), "dd-MM-yyyy")}
              </p>
            </CardHeader>
            <CardContent className="py-3">
              <p className="text-muted-foreground line-clamp-3 text-sm">
                {blog.metaDescription ||
                  blog.postSummary?.replace(/<[^>]+>/g, "")}
              </p>
              <Button
                asChild
                variant="link"
                className="text-avt-green mt-2 px-0 font-bold"
              >
                <Link href={blog.slug.slice(3)}>Read more →</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
