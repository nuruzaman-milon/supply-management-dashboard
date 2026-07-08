import { NextRequest, NextResponse } from "next/server";
import { decrypt, SESSION_COOKIE } from "@/lib/auth";

// Routes that must NOT require a session.
const PUBLIC_PATHS = ["/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await decrypt(token) : null;

  const isPublic = PUBLIC_PATHS.includes(pathname);

  // Not logged in and trying to reach a protected page -> send to login,
  // remembering where they wanted to go.
  if (!session && !isPublic) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Already logged in but on the login page -> go to the dashboard.
  if (session && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on every route except Next internals, the auth API, and static assets.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
