import { NextRequest, NextResponse } from "next/server";

/**
 * Rewrites requests for /{key}.txt to IndexNow key API, so the key file
 * is served from env without committing it. Excludes /robots.txt.
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname.endsWith(".txt") && pathname !== "/robots.txt") {
    const key = pathname.slice(1, -4); // strip leading / and trailing .txt
    const url = new URL("/api/indexnow-key", request.url);
    url.searchParams.set("key", key);
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  // Match any path like /something.txt except /robots.txt (handled by app/robots.ts)
  matcher: ["/((?!robots$)[^/]+)\\.txt"],
};
