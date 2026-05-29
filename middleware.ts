import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected routes — require authentication
const PROTECTED = ['/feed']

export function middleware(request: NextRequest) {
  // TEMPORARILY DISABLED: Auth protection bypassed for dev mode
  return NextResponse.next()

  const { pathname } = request.nextUrl

  const isProtected = PROTECTED.some((path) => pathname.startsWith(path))
  if (!isProtected) return NextResponse.next()

  // Supabase stores the session token in a cookie named:
  // sb-<project-ref>-auth-token
  const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL!
    .replace('https://', '')
    .split('.')[0]

  const sessionCookie =
    request.cookies.get(`sb-${projectRef}-auth-token`)?.value ||
    request.cookies.get('sb-access-token')?.value

  if (!sessionCookie) {
    const loginUrl = new URL('/', request.url)
    loginUrl.searchParams.set('auth', 'required')
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/feed/:path*'],
}
