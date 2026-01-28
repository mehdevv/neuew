import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://api.hubapi.com/cms/v3/blogs/posts", {
    headers: {
      Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch" },
      { status: res.status },
    );
  }

  const data = await res.json();
  
  return NextResponse.json(data.results);
}
