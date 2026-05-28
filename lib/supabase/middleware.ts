import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/dashboard"];

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const mockAuthCookie = request.cookies.get("freelamatch_mock_auth")?.value;

  if (!supabaseUrl || !supabaseKey) {
    const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

    if (isProtectedRoute && !mockAuthCookie) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  }

  // Verifica se existe cookie de sessão do Supabase (sb-access-token ou sb-refresh-token)
  const hasAccessToken = request.cookies.has("sb-access-token");
  const hasRefreshToken = request.cookies.has("sb-refresh-token");
  const hasSession = hasAccessToken || hasRefreshToken;

  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

  if (isProtectedRoute && !hasSession) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
