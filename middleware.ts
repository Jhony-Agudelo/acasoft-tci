import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from '@/lib/jwt';

// Public API routes that do not require authentication
const publicRoutes = ['/api/auth/login', '/api/db-sync', '/api/enrollment'];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // We only intercept API routes that are not public
  if (path.startsWith('/api/') && !publicRoutes.includes(path)) {
    const token = req.cookies.get('tci_session')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No autorizado: Token no proporcionado' },
        { status: 401 }
      );
    }

    const payload = await verifyJwt(token);

    if (!payload || !payload.user) {
      return NextResponse.json(
        { success: false, error: 'No autorizado: Token inválido o expirado' },
        { status: 401 }
      );
    }
    
    // Token is valid. Proceed to the handler.
    return NextResponse.next();
  }

  // Non-API routes or public API routes continue normally
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
