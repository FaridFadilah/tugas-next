import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(`[MIDDLEWARE] Processing request for: ${pathname}`);

  // Pages yang tidak memerlukan authentication
  const publicPages = ['/auth/login', '/auth/register'];
  
  // Jika user mengakses public pages, allow
  if (publicPages.includes(pathname)) {
    console.log(`[MIDDLEWARE] Public page accessed: ${pathname}, allowing request`);
    return NextResponse.next();
  }

  // Check for auth token
  const authTokenCookie = request.cookies.get('authToken');
  const authHeader = request.headers.get('authorization');
  
  console.log(`[MIDDLEWARE] Auth cookie exists: ${!!authTokenCookie}`);
  console.log(`[MIDDLEWARE] Auth cookie value: ${authTokenCookie?.value || 'null'}`);
  console.log(`[MIDDLEWARE] Auth header: ${authHeader || 'null'}`);
  
  const token = authTokenCookie?.value || authHeader?.replace('Bearer ', '');

  // Jika tidak ada token, redirect ke login
  if (!token) {
    console.log(`[MIDDLEWARE] No token found, redirecting to login`);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    // Verify token
    console.log(`[MIDDLEWARE] Verifying token...`);
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    await jwtVerify(token, secret);
    console.log(`[MIDDLEWARE] Token verified successfully, allowing access to: ${pathname}`);
    return NextResponse.next();
  } catch (error) {
    // Token invalid, redirect ke login
    console.error(`[MIDDLEWARE] Token verification failed:`, error);
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete('authToken'); // Clear invalid token
    console.log(`[MIDDLEWARE] Cleared invalid token and redirecting to login`);
    return response;
  }
}

// Configure which paths should be checked by middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
