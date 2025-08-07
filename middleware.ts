// import { NextRequest, NextResponse } from "next/server";
// import { getCookie } from "cookies-next/server";
// import { cookies } from "next/headers";

// type PublicRoutes = string | RegExp;

// // Public Routes (no authorization needed)
// const publicRoutes: PublicRoutes[] = [
//   /^\/login$/,
//   /^\/otp$/,
//   /^\/profile$/,
//   "/favicon.ico",
//   "/not-found",
//   /^\/_next\//,
//   /^\/static\//,
//   /^\/images\//,
// ];

// export async function middleware(req: NextRequest) {
//   const pathname = req.nextUrl.pathname;
//   const token = req.cookies.get("orio-attendance-token")?.value;
//   const isLoginPage = pathname.endsWith("/login");
//   const isOtpPage = pathname.endsWith("/otp");
//   const isPublicRoute = publicRoutes.some((route) =>
//     typeof route === "string"
//       ? route === pathname
//       : route instanceof RegExp
//       ? route.test(pathname)
//       : false
//   );

//   // Case 1: User has a token (fully authenticated)
//   if (token) {
//     console.log("Token found, user is fully authenticated");
//     if (isLoginPage || isOtpPage) {
//       return NextResponse.redirect(new URL("/", req.url));
//     }
//     return NextResponse.next();
//   }

//   // Case 2: User has no token
//   if (!token) {
//     if (isLoginPage || isPublicRoute) {
//       return NextResponse.next();
//     }
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/:path*"],
// };


import { NextRequest, NextResponse } from "next/server";

type PublicRoute = string | RegExp;

const PUBLIC_ROUTES: PublicRoute[] = [
  "/favicon.ico",
  "/not-found",
  "/robots.txt",
  "/manifest.json",
  "/login",
  "/otp",
  /^\/_next\//,
  /^\/images\//,
  /^\/static\//,
  /^\/icons\//,
  /^\/fonts\//,
];

// Token key in cookies
const AUTH_TOKEN_KEY = "orio-attendance-token";

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) =>
    typeof route === "string" ? route === pathname : route.test(pathname)
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(AUTH_TOKEN_KEY)?.value;

  const isAuthenticated = Boolean(token);
  const isAuthPage = pathname === "/login" || pathname === "/otp";

  // ✅ Public route — allow access
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // ✅ Authenticated — restrict auth pages
  if (isAuthenticated) {
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // 🚫 Unauthenticated — block access to protected routes
  return NextResponse.redirect(new URL("/login", req.url));
}

// Apply middleware to all routes
export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"], // Skip static files, API routes, etc.
};
