import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const role = req.auth?.user?.role

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if ((pathname === "/login" || pathname === "/register") && isLoggedIn) {
    const redirect = role === "ADMIN" ? "/admin/dashboard" : "/dashboard"
    return NextResponse.redirect(new URL(redirect, req.url))
  }
})

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login", "/register"],
}
