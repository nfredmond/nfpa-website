/**
 * Middleware for authentication and session management
 */

import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  // Only handle authentication for portal and auth routes
  // Marketing pages don't need Supabase authentication
  const isPortalRoute = request.nextUrl.pathname.startsWith('/portal') || 
                        request.nextUrl.pathname.startsWith('/dashboard')
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/signup')
  
  // For marketing pages, just pass through
  if (!isPortalRoute && !isAuthRoute) {
    return NextResponse.next()
  }
  
  // For portal routes, would need to check authentication
  // For now, redirect to login (auth system not yet implemented)
  if (isPortalRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Only run middleware on portal, dashboard, and auth routes
     * Skip static files, images, and API routes
     */
    '/portal/:path*',
    '/dashboard/:path*',
    '/login',
    '/signup',
  ],
}

