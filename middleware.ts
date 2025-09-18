import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return request.cookies.get(name)?.value
        },
        async set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        async remove(name: string, options: CookieOptions) {
          request.cookies.delete(name)
          response.cookies.delete(name)
        },
      },
    }
  )

  // Get the current user
  const { data: { user }, error } = await supabase.auth.getUser()
  
  const url = request.nextUrl.clone()
  const pathname = url.pathname

  // Define protected and public routes
  const protectedRoutes = ['/dashboard', '/profile', '/settings', '/vault']
  const authRoutes = ['/login', '/register', '/auth']
  const publicRoutes = ['/', '/about', '/contact']

  // Check if current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  
  // If user is not authenticated and trying to access protected route
  if (!user && isProtectedRoute) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  
  // If user is authenticated and trying to access auth routes, redirect to dashboard
  if (user && isAuthRoute) {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // For protected routes, also check if user has completed master password setup
  if (user && isProtectedRoute) {
    // You might want to check if user has set up master password
    // This would require checking your database or user metadata
    // For now, we'll assume they're good to go if they're authenticated
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}