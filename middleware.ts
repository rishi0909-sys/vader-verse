import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  // Complete A-Z Middleware/Proxy Task
  const url = request.nextUrl;
  
  // Create a base response to attach headers to
  const response = NextResponse.next();

  // ==========================================
  // 1. SECURITY HEADERS (A to Z Protection)
  // ==========================================
  response.headers.set('X-Frame-Options', 'SAMEORIGIN'); // Prevent clickjacking
  response.headers.set('X-Content-Type-Options', 'nosniff'); // Prevent MIME sniffing
  response.headers.set('X-XSS-Protection', '1; mode=block'); // Basic XSS protection
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains'); // Force HTTPS

  // ==========================================
  // 2. API CORS & HEADERS
  // ==========================================
  if (url.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  // ==========================================
  // 3. AUTHENTICATION PROXY ROUTING
  // ==========================================
  // Note: Since VaderVerse heavily uses a client-side `vader_token` in localStorage,
  // the main protection happens in <AuthGuard>. 
  // We should NOT redirect from /login purely based on next-auth cookies, 
  // because the user might need to complete the token exchange process.
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
