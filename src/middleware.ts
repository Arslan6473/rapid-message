import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    salt: "",
    secret: "",
  });
  const url = request.nextUrl.pathname;

  if (
    token &&
    (url.endsWith("/signin") ||
      url.endsWith("/signup") ||
      url.endsWith("/verify") ||
      url.endsWith("/"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && url.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/signin", "/signup", "/dashboard/:path*", "/verify/:path*"],
};
