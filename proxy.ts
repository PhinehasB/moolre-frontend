import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard"];
const AUTH_ROUTES = ["/signin", "/signup", "/forgot-password", "/reset-password", "/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authCookie = request.cookies.get("klare-auth-token");
  const isAuthenticated = !!authCookie?.value;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.some((p) => pathname.startsWith(p));

  if (isProtected && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
