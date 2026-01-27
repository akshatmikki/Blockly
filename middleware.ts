import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const runtime = 'nodejs';

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Only protect admin dashboard
  if (!pathname.startsWith("/admin_dashboard")) {
    return NextResponse.next();
  }

  console.log("Middleware: Checking admin_dashboard access for:", pathname);

  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    console.log("Middleware: No token found, redirecting to /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  console.log("Middleware: Token found, verifying...");

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { userId: string; role: string };

    console.log("Middleware: Decoded token:", { userId: decoded.userId, role: decoded.role });

    if (decoded.role?.toLowerCase() !== "admin") {
      console.log("Middleware: Not an admin role, redirecting to /login");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    console.log("Middleware: Admin verified, allowing access");
    return NextResponse.next();
  } catch (err) {
    console.error("Middleware: JWT verification failed:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/admin_dashboard/:path*", "/admin_dashboard"],
};
