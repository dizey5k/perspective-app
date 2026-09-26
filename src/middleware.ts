import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const teamId = request.cookies.get('team_id')?.value
  const isLoginPage = request.nextUrl.pathname === '/login'
  const isAdminPage = request.nextUrl.pathname === '/admin'

  if (!teamId && !isLoginPage && !isAdminPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (teamId && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Защищаем всё, кроме статики, API и картинок
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
