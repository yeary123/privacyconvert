import { NextRequest, NextResponse } from "next/server";

const INDEXNOW_KEY = process.env.INDEXNOW_KEY;

/**
 * Serves the IndexNow key file for ownership verification.
 * Only responds when the requested key matches INDEXNOW_KEY.
 * Key file URL: https://yoursite.com/{INDEXNOW_KEY}.txt
 */
export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  if (!key || !INDEXNOW_KEY || key !== INDEXNOW_KEY) {
    return new NextResponse(null, { status: 404 });
  }
  return new NextResponse(INDEXNOW_KEY, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
