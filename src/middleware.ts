import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll().map(cookie => ({
            name: cookie.name,
            value: cookie.value,
          }));
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Set cookie in the request
              request.cookies.set({
                name,
                value,
                ...options,
              });
              
              // Set cookie in the response
              response.cookies.set(name, value, {
                path: options?.path,
                maxAge: options?.maxAge,
                domain: options?.domain,
                secure: options?.secure,
                sameSite: (options?.sameSite as "lax" | "strict" | "none" | undefined) || "lax"
              });
            });
          } catch (error) {
            // This can fail in middleware or other contexts where cookies cannot be set
            console.error('Failed to set cookies:', error);
          }
        },
      },
    }
  );

  // Refresh session if needed
  const { data: { session } } = await supabase.auth.getSession();

  // Check if the route requires authentication
  const url = new URL(request.url);
  const isProtectedRoute = 
    url.pathname.startsWith('/game/create') || 
    url.pathname.startsWith('/favorites') ||
    url.pathname.startsWith('/profile');

  // Check if favoriting a card as anonymous user
  const isFavoritingCard = url.pathname.startsWith('/api/favorites/add') && !session;
  
  if (isFavoritingCard) {
    // Store the current URL to redirect back after auth
    const redirectBackUrl = request.headers.get('referer') || '/';
    
    // Redirect to login with return URL in query params
    return NextResponse.redirect(new URL(`/auth/login?returnUrl=${encodeURIComponent(redirectBackUrl)}`, request.url));
  }

  // For protected routes, check if user is authenticated
  if (isProtectedRoute && !session) {
    // Redirect to login with return URL
    return NextResponse.redirect(new URL(`/auth/login?returnUrl=${encodeURIComponent(url.pathname)}`, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api routes that don't require authentication
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
    '/api/favorites/:path*',
  ],
}; 