import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  console.log("USING MIDDLEWARE");
  // Token will exist if the user is logged in
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  const { pathname } = req.nextUrl;

  // Redirects to homepage if already authenticated
  if (token && pathname === "/login") {
    console.log("Redirect to HOME");
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (token || pathname.includes("/api/auth")) {
    return NextResponse.next();
  }

  // Redirects to login if NOT authenticated
  if (!token && pathname !== "/login") {
    // Redirecting to login
    console.log("Redirect to LOGIN");
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/", "/login"],
};
