import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    return NextResponse.json(
      { error: "API URL not configured" },
      { status: 500 },
    );
  }

  // Get query parameters from the request
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page");

  // Build the backend API URL
  const backendUrl = `${apiUrl}/api/announcements/active/announcements${
    page ? `?page=${page}` : ""
  }`;

  try {
    const res = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Forward authorization header if present
        ...(request.headers.get("authorization") && {
          Authorization: request.headers.get("authorization") || "",
        }),
      },
      // Forward cookies if needed
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Failed to fetch announcements" },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying announcements request:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 },
    );
  }
}

