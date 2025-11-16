import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Allow API routes to pass through for all HTTP methods
  if (req.nextUrl.pathname.startsWith("/puck/api")) {
    return NextResponse.next();
  }

  const res = NextResponse.next();

  if (req.method === "GET") {
    // Rewrite routes that match "/[...puckPath]/edit" to "/puck/[...puckPath]"
    if (req.nextUrl.pathname.endsWith("/edit")) {
      const pathWithoutEdit = req.nextUrl.pathname.slice(
        0,
        req.nextUrl.pathname.length - 5
      );
      const pathWithEditPrefix = `/puck${pathWithoutEdit}`;
      
      // Preserve query parameters when rewriting
      const rewriteUrl = new URL(pathWithEditPrefix, req.url);
      rewriteUrl.search = req.nextUrl.search; // Preserve query string
      
      return NextResponse.rewrite(rewriteUrl);
    }

    // Disable "/puck/[...puckPath]" (but not API routes)
    if (req.nextUrl.pathname.startsWith("/puck")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return res;
}
