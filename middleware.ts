import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });



  const { data: { session } } = await supabase.auth.getSession();

  const isLoggedIn = !!session?.user;
  const { pathname } = req.nextUrl;
  //aqui se ponen las rutas a proteger
  const protectedRoutes = ['/dashboard', '/profile', '/notes'];
  if (!isLoggedIn && protectedRoutes.some((route) => pathname.startsWith(route))) {
    console.log('🔒 Acceso restringido a rutas protegidas:', pathname);
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (isLoggedIn && pathname === '/login') {
    console.log('🔓 Usuario autenticado, redirigiendo de /login a /dashboard');
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
