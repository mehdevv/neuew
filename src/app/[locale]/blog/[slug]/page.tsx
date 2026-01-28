"use client";

import { useBlogStore } from "@/store/blog";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function BlogPostPage() {
  const { blogs } = useBlogStore();
  const { slug } = useParams();

  if (!slug) return <p>No slug provided</p>;

  const post = blogs.find((blog) =>
    blog.slug.endsWith(decodeURIComponent(slug.toString())),
  );

  if (!post) return <p>Post not found</p>;

  return (
    <article className="prose lg:prose-xl mx-auto max-w-4xl px-3 py-10">
      <h1 dangerouslySetInnerHTML={{ __html: post.htmlTitle }} />
      <p className="text-gray-500">
        {new Date(post.publishDate).toLocaleDateString()}
      </p>
      {post.featuredImage && (
        <div className="my-6">
          <Image
            src={post.featuredImage}
            alt={post.htmlTitle}
            width={800}
            height={400}
            className="rounded-lg"
          />
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: post.postBody }} />
    </article>
  );
}
