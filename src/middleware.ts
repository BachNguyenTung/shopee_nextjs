import { NextRequest, NextResponse } from 'next/server'

const publicRoutes = ["/register", '/login', '/']
const protectedRoutes = ['/account', '/checkout']
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const isProtectedRoute = protectedRoutes.includes(pathname)
  const isPublicRoute = publicRoutes.includes(pathname)
  const cookie = request.cookies.get('session')?.value
  // If there's a session, verify it for routes
  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !cookie) {
    const url = new URL('/', request.nextUrl)
    url.searchParams.set('forceLogout', '1')
    return NextResponse.redirect(url)
  }

  // 5. Redirect to / if the user is authenticated
  if (
    isPublicRoute &&
    cookie &&
    request.nextUrl.pathname !== '/'
  ) {
    const responseAPI = await fetch(`${BASE_URL}/profile`, {
      headers: {
        Cookie: `session=${cookie}`,
      },
    });
    if (!responseAPI.ok) {
      const url = new URL('/', request.nextUrl)
      url.searchParams.set('forceLogout', '1')
      return NextResponse.redirect(url);
    }
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  // Proceed with the request if it's a public route or if the session is valid for a protected route
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
    * Match all request paths except for the ones starting with:
    * - api (API routes)
    * - _next/static (static files)
    * - _next/image (image optimization files)
    * - img/ (img/ directory for images)
    * - favicon.ico, sitemap.xml, robots.txt (metadata files)
    */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|img/|sitemap.xml|robots.txt).*)',
  ],
}
