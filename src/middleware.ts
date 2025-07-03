import { NextRequest, NextResponse } from 'next/server'

const authPage = ["/register", '/login']
const protectedPage = ['/account', '/checkout']

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get("session");
  const pathname = request.nextUrl.pathname;

  const isAuthPage = authPage.some((path) =>
    pathname.startsWith(path)
  );
  const isProtectedPage = protectedPage.some((path) =>
    pathname.startsWith(path)
  );

  if (isAuthenticated) {
    // Redirect authenticated users away from auth pages
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }

    // Allow access to main or other pages (if required)
    return NextResponse.next();
  }

  // Redirect unauthenticated users trying to access protected pages
  if (isProtectedPage) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // Allow unauthenticated users to access public pages, including "/"
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
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - manifest.webmanifest, images/, img/ (your static asset folders)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|images/|img/|sitemap.xml|robots.txt).*)',
  ],
}
