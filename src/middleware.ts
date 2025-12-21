import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath =
    ["/login", "/signup", "/"].includes(path) || path.includes("/verifyemail");
  const token = request.cookies.get("token")?.value || "";

  // If user is authenticated and tries to access public pages, redirect to profile
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/profile", request.nextUrl));
  }

  // If user is not authenticated and tries to access protected pages, redirect to home
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }
}

export const config = {
  matcher: ["/", "/signup", "/login", "/profile", "/verifyemail", "/ai_chat"],
};
