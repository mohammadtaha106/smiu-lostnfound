import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // 1. Cookie check karo (Better Auth ye cookie banata hai)
  const sessionCookie = request.cookies.get("better-auth.session_token");

  // 2. Agar cookie nahi hai, matlab login nahi hai
  if (!sessionCookie) {
    // User ko Home page par wapis bhej do
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Sab theek hai, jane do
  return NextResponse.next();
}

export const config = {
  matcher: ["/report", "/dashboard"], 
};