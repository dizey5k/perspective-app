import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const teamId = request.cookies.get('team_id')?.value

  if (
    pathname.startsWith('/icon') ||
    pathname.startsWith('/font') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.otf') ||
    pathname.endsWith('.ico')
  ) {
    return NextResponse.next()
  }

  const isLoginPage = pathname === '/login'
  const isAdminPage = pathname.startsWith('/admin')

  if (!teamId && !isLoginPage && !isAdminPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (teamId && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|icon|font|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|otf|ttf|woff|woff2)$).*)',
  ],
}
