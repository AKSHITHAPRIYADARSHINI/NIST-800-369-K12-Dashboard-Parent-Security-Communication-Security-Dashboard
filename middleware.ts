import { NextRequest, NextResponse } from "next/server"

const publicRoutes = [
  "/",
  "/auth/login",
  "/auth/mfa/verify",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/health",
]

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Allow public routes
  if (publicRoutes.includes(pathname) || pathname.startsWith("/auth/") || pathname.startsWith("/api/auth/")) {
    return NextResponse.next()
  }

  // Check for session token (simple cookie check, not database validation)
  // Full validation happens client-side and in protected API routes
  const sessionToken = request.cookies.get("session")?.value

  if (!sessionToken) {
    // Redirect to login
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Session cookie exists - allow access
  // Full validation will happen on the dashboard page via API call
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
