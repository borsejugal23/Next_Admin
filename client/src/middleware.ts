import { getFirstAccessibleRoute } from "@/authorization/routeAccess";
import { getVerifiedAccessToken } from "@/lib/verify-access-token";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const authRoutes = ["/sign-in", "/sign-up"];

function redirectToSignIn(request: NextRequest, pathname: string) {
  const signInUrl = new URL("/sign-in", request.url);
  signInUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(signInUrl);
}

function clearAccessToken(response: NextResponse) {
  response.cookies.set("accessToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const tokenPayload = accessToken
    ? await getVerifiedAccessToken(accessToken)
    : null;
  const isAuthenticated = tokenPayload !== null;
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (!isAuthRoute && !isAuthenticated) {
    const response = redirectToSignIn(request, pathname);
    if (accessToken) clearAccessToken(response);
    return response;
  }

  if (isAuthRoute && isAuthenticated) {
    const fallbackRoute =
      (tokenPayload?.role && getFirstAccessibleRoute(tokenPayload.role)) ||
      "/product";
    return NextResponse.redirect(new URL(fallbackRoute, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
